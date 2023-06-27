import db from '$lib/server/database'
import type { Prisma } from '@prisma/client'
import type { PageServerLoad, RequestEvent, Actions } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'
import { checkIfCarInspectionIdExists, searchCarInspectionsMatchedWithQuery } from '$lib/server/helpers/carInspection.operations'

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login')
    } else {
        // This is required to explicitly define the format of carInspections we will select
        // Because if we don't, when we pass the result of findMany, the "relations" will be ignored
        // So in the frontend, we can't access the relations's proprety (ex. car.registrationNumber)

        // Create a strongly typed `CarInspectionSelect` object with `satisfies`
        const carInspectionSelect = {
            id: true,
            inspectionType: true,
            inspectionDate: true,
            result: true,
            expiredDate: true,
            note: true,
            carId: true,
            car: {
                select: {
                    id: true,
                    registrationNumber: true,
                    licensePlateNumber: true
                }
            },
            inspectionStationId: true,
            inspectionStation: {
                select: {
                    stationName: true
                }
            }
        } satisfies Prisma.CarInspectionSelect

        // Infer the resulting payload type
        type MyCarInspectionPayload = Prisma.CarInspectionGetPayload<{ select: typeof carInspectionSelect }>

        // Get the car inspection data
        if (locals.user.isAdmin) {
            const carInspections = await db.carInspection.findMany({
                select: carInspectionSelect
            })

            return { carInspections }
        } else {
            // If not admin, user should be connected to a station
            // Retrieve carInpections that has inspectionStationId which matchs with the station of user
            let carInspections = await db.carInspection.findMany({
                select: carInspectionSelect
            })

            // Get inspectionStationId that user is connected to
            const userMatchedWithLocalsData = await db.user.findUnique({
                where: { username: locals.user.name },
                select: {
                    inspectionStationId: true
                }
            })

            if (userMatchedWithLocalsData?.inspectionStationId) {
                carInspections = await db.carInspection.findMany({
                    where: {
                        inspectionStationId: userMatchedWithLocalsData?.inspectionStationId
                    },
                    select: carInspectionSelect
                })
            }

            return { carInspections, userStationId: userMatchedWithLocalsData?.inspectionStationId }
        }
    }
}

export const actions: Actions = {
    createCarInspection,
    editCarInspection,
    deleteCarInspection,
    deleteManyCarInspections,
    searchCarInspections
}

async function createCarInspection(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    const formData = Object.fromEntries(await event.request.formData())

    const isFormDataValid = checkIfFormDataValid(formData)

    if (!isFormDataValid) {
        return fail(400, { status: 'failed', action: 'createCarInspection', invalidData: true, message: 'Your inspection is invalid. Some fields are incorrect! ' })
    }

    const newCarInspection = formData as unknown as { id: string, inspectionType: string, result: string, expiredDate: string, note: string, registrationNumber: string, licensePlateNumber: string, inspectionStationId: string }

    try {
        const isCarInspectionIdExisted = await checkIfCarInspectionIdExists(newCarInspection.id)

        if (isCarInspectionIdExisted) {
            return fail(400, { status: 'failed', action: 'createCarInspection', invalidData: true, message: 'This car inspection already exists!' })
        }

        // Prepare data to create
        const expiredDate = setExpiredDate(newCarInspection.expiredDate)
        const carDoesInspect = await db.car.findUnique({
            where: { registrationNumber: newCarInspection.registrationNumber }
        })

        // Create new car inspection
        if (!carDoesInspect) {
            return fail(400, { status: 'failed', action: 'createCarInspection', invalidData: true, message: 'Car registration number or license plate number is incorrect!' })
        } else {
            await db.carInspection.create({
                data: {
                    id: newCarInspection.id,
                    inspectionType: newCarInspection.inspectionType.toLowerCase(),
                    inspectionDate: new Date(),
                    result: newCarInspection.result.toLowerCase(),
                    expiredDate: expiredDate,
                    note: newCarInspection.note ? newCarInspection.note : '',

                    carId: carDoesInspect.id,

                    inspectionStationId: parseInt(newCarInspection.inspectionStationId),
                }
            })
        }


        console.log('Car inspection created successfully!')
        return { status: 'success', action: 'createCarInspection', invalidData: false, message: 'Car inspection created successfully!' }
    } catch (error) {
        console.error(error)
        return fail(400, { status: 'failed', action: 'createCarInspection', invalidData: true, message: 'Something went wrong with your inspection! Please try again!' })
    }
}

function checkIfFormDataValid(formData: { [k: string]: FormDataEntryValue }) {
    if (
        !formData.id ||
        !formData.inspectionType ||
        !formData.result ||
        !formData.expiredDate ||
        !formData.registrationNumber ||
        !formData.inspectionStationId
    ) {
        return false
    }

    return true
}

function setExpiredDate(time: string) {
    const digit = time.split(' ')[0]
    const modifier = time.split(' ')[1]

    const currentDate = new Date()
    const expiredDate = new Date()

    if (modifier.toLowerCase() === 'year') {
        expiredDate.setFullYear(currentDate.getFullYear() + parseInt(digit))
    } else if (modifier.toLowerCase() === 'month') {
        expiredDate.setMonth(currentDate.getMonth() + parseInt(digit))
    } else if (modifier.toLowerCase() === 'day') {
        expiredDate.setDate(currentDate.getDate() + parseInt(digit))
    }

    return expiredDate
}

async function editCarInspection(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    // Check submitted form data
    const isAdmin = event.locals.user.isAdmin

    const formData = Object.fromEntries(await event.request.formData())

    const isFormDataValid = checkIfFormDataValid(formData)

    if (!isFormDataValid) {
        return fail(400, { status: 'failed', action: 'editCarInspection', invalidData: true, message: 'Your inspection is invalid. Some fields are incorrect!' })
    }

    const updatedCarInspection = formData as unknown as { id: string, inspectionType: string, result: string, expiredDate: string, note: string, registrationNumber: string, licensePlateNumber: string, inspectionStationId: string }

    // User can only edit car inspection from inspection station that user has connection to
    // Check user permission
    if (!isAdmin) {
        // Normal can only edit carInspection that has the inspectionStationId match with user's
        const username = event.locals.user.name

        // Find inspection station that connect with user
        const inspectionStation = await db.user.findUnique({
            where: { username },
            select: {
                inspectionStationId: true
            }
        })

        if (!inspectionStation?.inspectionStationId) {
            // This normal user has no connection to any inspection station
            // This means the editing request is invalid
            throw error(401, 'This user do not have permission to edit any inspection! No inspection station is connected to!')
        }

        const inspectionStationId = inspectionStation.inspectionStationId

        // If editing request is for inspection created from other inspection station, it'll be denied!
        if (updatedCarInspection.inspectionStationId) {
            if (inspectionStationId !== parseInt(updatedCarInspection.inspectionStationId)) {
                return fail(400, { status: 'failed', action: 'editCarInspection', invalidData: true, message: 'Request denied! User can only edit inspection from relevant inspection station.' })
            }
        }
    }

    // Until this, the editing request is matched with user thas has right permission (even user is admin or normal)
    try {
        const isCarInspectionIdExisted = await checkIfCarInspectionIdExists(updatedCarInspection.id)

        if (!isCarInspectionIdExisted) {
            return fail(400, { status: 'failed', action: 'editCarInspection', invalidData: true, message: 'Car inspection does not exist to be edited!' })
        }

        // Prepare data
        const updatedDataMatchWithCar = await db.car.findUnique({
            where: { registrationNumber: updatedCarInspection.registrationNumber },
            select: { id: true }
        })

        if (!updatedDataMatchWithCar) {
            return fail(400, { status: 'failed', action: 'editCarInspection', invalidData: true, message: 'Could not find the car which matched with your registration number!' })
        }

        await db.carInspection.update({
            where: { id: updatedCarInspection.id },
            data: {
                id: updatedCarInspection.id,
                inspectionType: updatedCarInspection.inspectionType.toLowerCase(),
                result: updatedCarInspection.result.toLowerCase(),
                // TODO: update exprired date
                // expiredDate: updatedCarInspection.expiredDate,
                note: updatedCarInspection.note ? updatedCarInspection.note : '',
                carId: updatedDataMatchWithCar.id,
                inspectionStationId: parseInt(updatedCarInspection.inspectionStationId)
            }
        })

        console.log('Car inspection updated successfully!')
        return { status: 'success', action: 'editCarInspection', invalidData: false, message: 'Car inspection edited successfully!' }
    } catch (error) {
        console.error(error)
        return fail(400, { status: 'failed', action: 'editCarInspection', invalidData: true, message: 'Something went wrong with your inspection! Please try again!' })
    }
}

async function deleteCarInspection(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    // Check form data
    const formData = await event.request.formData()

    const deleteCarInspectionId = formData.get('id') as string

    if (!deleteCarInspectionId) {
        return fail(400, { status: 'failed', action: 'deleteCarInspection', invalidId: true, message: 'Car inspection ID is required!' })
    }

    // User can only delete car inspection from inspection station that user has connection to
    // Check user permission
    if (!event.locals.user.isAdmin) {
        // Normal can only delete carInspection that has the inspectionStationId match with user's
        const username = event.locals.user.name

        // Find inspection station that connect with user
        const stationConnectsWithUser = await db.user.findUnique({
            where: { username },
            select: {
                inspectionStationId: true
            }
        })

        if (!stationConnectsWithUser?.inspectionStationId) {
            // This normal user has no connection to any inspection station
            // This means the deleting request is invalid
            throw error(401, 'This user do not have permission to delete any inspection! No inspection station is connected to!')
        }

        const carInspectionWillBeDeleted = await db.carInspection.findUnique({
            where: { id: deleteCarInspectionId },
            select: { inspectionStationId: true }
        })

        const stationIdOfUser = stationConnectsWithUser.inspectionStationId
        const stationIdOfDelete = carInspectionWillBeDeleted?.inspectionStationId

        // If deleting request is for inspection created from other inspection station, it'll be denied!
        if (stationIdOfUser !== stationIdOfDelete) {
            return fail(400, { status: 'failed', action: 'editCarInspection', invalidData: true, message: 'Request denied! User can only edit inspection from relevant inspection station.' })
        }
    }

    // Until this, the deleting request is matched with user thas has right permission (even user is admin or normal)
    const deleteCarInspection = await db.carInspection.delete({
        where: { id: deleteCarInspectionId }
    })

    if (!deleteCarInspection) {
        return fail(400, { status: 'failed', action: 'deleteCarInspection', invalidId: true, message: 'Could not find the car inspection to be deleted!' })
    }

    console.log('Car inspection deleted successfully!')
    return { status: 'success', action: 'deleteCarInspection', invalidId: false, message: 'Car inspection deleted successfully!' }
}

async function deleteManyCarInspections(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    // User can only delete car inspections from inspection station that user has connection to
    // Check form data
    const formData = await event.request.formData()

    const rawDeleteCarInspectionIds = formData.get('ids') as string
    let deleteCarInspectionIds: string[]

    if (!checkValidCarInspectionIds(rawDeleteCarInspectionIds)) {
        return fail(400, { status: 'failed', action: 'deleteManyCarInspections', invalidId: true, message: 'Car inspection IDs is required!' })
    }

    if (rawDeleteCarInspectionIds.length === 1) {
        deleteCarInspectionIds = [rawDeleteCarInspectionIds]
    } else {
        deleteCarInspectionIds = rawDeleteCarInspectionIds.split(',')
    }

    // User can only delete car inspection from inspection station that user has connection to
    // Check user permission
    if (!event.locals.user.isAdmin) {
        // Normal can only delete carInspection that has the inspectionStationId match with user's
        const username = event.locals.user.name

        // Find inspection station that connect with user
        const stationConnectsWithUser = await db.user.findUnique({
            where: { username },
            select: {
                inspectionStationId: true
            }
        })

        if (!stationConnectsWithUser?.inspectionStationId) {
            // This normal user has no connection to any inspection station
            // This means the deleting request is invalid
            throw error(401, 'This user do not have permission to delete any inspection! No inspection station is connected to!')
        }

        const carInspectionsWillBeDeleted = await db.carInspection.findMany({
            where: {
                id: { in: deleteCarInspectionIds }
            },
            select: { inspectionStationId: true }
        })

        const stationIdOfUser = stationConnectsWithUser.inspectionStationId

        const isUserAuthorizedToDelete = checkIfUserAuthorizedToDelete(stationIdOfUser, carInspectionsWillBeDeleted)

        // If deleting request is for inspection created from other inspection station, it'll be denied!
        if (!isUserAuthorizedToDelete) {
            return fail(400, { status: 'failed', action: 'deleteManyCarInspections', invalidData: true, message: 'Request denied! User can only edit inspection from relevant inspection station.' })
        }
    }

    // Until this, the deleting request is matched with user thas has right permission (even user is admin or normal)
    const deleteCarInspections = await db.carInspection.deleteMany({
        where: { id: { in: deleteCarInspectionIds } }
    })

    if (!deleteCarInspections) {
        return fail(400, { status: 'failed', action: 'deleteCarInspection', invalidId: true, message: 'Could not find the car inspection to be deleted!' })
    }

    console.log('Car inspection deleted successfully!')
    return { status: 'success', action: 'deleteCarInspection', invalidId: false, message: 'Car inspection deleted successfully!' }
}

function checkValidCarInspectionIds(rawDeleteCarModelIds: string) {
    // TODO: check if the format is correct
    // Expected format is: str1,str2,str3,str4
    if (!rawDeleteCarModelIds) {
        return false
    }

    return true
}

function checkIfUserAuthorizedToDelete(stationIdOfUser: number, carInspections: { inspectionStationId: number }[]) {
    for (let i = 0; i < carInspections.length; i++) {
        if (stationIdOfUser !== carInspections[i].inspectionStationId) {
            return false
        }
        return true
    }
}


async function searchCarInspections(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    // Based on role of user, we add filter on the data that user has access to

    const formData = await event.request.formData()
    const searchQuery = String(formData.get('searchQuery'))

    const matchedCarInspections = await searchCarInspectionsMatchedWithQuery(searchQuery)

    const matchedCarInspectionIds: string[] = []

    matchedCarInspections.forEach(carInspection => {
        matchedCarInspectionIds.push(carInspection.id)
    })

    console.log('Search successfully!')
    return { status: 'success', action: 'searchCarInspections', matchedCarInspectionIds }
}