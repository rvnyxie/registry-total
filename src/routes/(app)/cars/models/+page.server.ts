import type { Actions, PageServerLoad, RequestEvent } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'

import db from '$lib/server/database'
import {
    checkIfCarModelIdExists,
    checkIfCarModelNameExists,
    checkIfCarModelReferencedByOtherRecords,
    checkIfCarModelsReferencedByOtherRecords,
    checkIfOnlyOneCarModelExists,
    searchCarModelsMatchedWithQuery
} from '$lib/server/helpers/carModel.operations'

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login')
    } else {
        const carModels = await db.carModel.findMany({})

        return { carModels }
    }
}

export const actions: Actions = {
    createCarModel,
    editCarModel,
    deleteCarModel,
    deleteManyCarModels,
    searchCarModels
}

async function createCarModel(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    const formData = Object.fromEntries(await event.request.formData())

    const isFormDataValid = checkIfFormDataValid(formData)

    if (!isFormDataValid) {
        return fail(400, { status: 'failed', action: 'createCarModel', invalidData: true, message: 'Your car model is not valid. Please try again!' })
    }

    const newCarModel = formData as unknown as { modelName: string, manufacturer: string, version: string, engineType: string, fuelType: string, transmissionType: string, horsepower: string, torque: string, seatingCapacity: string }

    try {
        const isOnlyOneCarModelNameExisted = await checkIfOnlyOneCarModelExists(newCarModel.modelName, newCarModel.version, newCarModel.engineType, newCarModel.fuelType, newCarModel.seatingCapacity)

        if (isOnlyOneCarModelNameExisted) {
            return fail(400, { status: 'failed', action: 'createCarModel', invalidData: true, message: 'CarModel already exists!' })
        }

        // Create new car model
        await db.carModel.create({
            data: {
                modelName: newCarModel.modelName,
                manufacturer: newCarModel.manufacturer,
                version: newCarModel.version,
                engineType: newCarModel.engineType,
                fuelType: newCarModel.fuelType,
                transmissionType: newCarModel.transmissionType,
                horsepower: newCarModel.horsepower,
                torque: newCarModel.torque,
                seatingCapacity: parseInt(newCarModel.seatingCapacity)
            }
        })

        console.log('Car model created successfully!')
        return { status: 'success', action: 'createCarModel', invalidData: false, message: 'Car model created successfully!' }
    } catch (error) {
        console.error(error)
        return fail(400, { status: 'failed', action: 'createCarModel', invalidData: true, message: 'Something went wrong. Please recheck your car model information!' })
    }
}

function checkIfFormDataValid(formData: { [k: string]: FormDataEntryValue }) {
    if (
        !formData.modelName ||
        !formData.manufacturer ||
        !formData.version ||
        !formData.engineType ||
        !formData.fuelType ||
        !formData.transmissionType ||
        !formData.horsepower ||
        !formData.torque ||
        !formData.seatingCapacity
    ) {
        return false
    }

    return true
}

async function editCarModel(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'Access denied! You must be an administrator to edit car model!')
    }

    const formData = Object.fromEntries(await event.request.formData())

    const isFormDataValid = checkIfFormDataValid(formData)

    if (!isFormDataValid) {
        return fail(400, { status: 'failed', action: 'deleteCarModel', invalidData: true, message: 'Your car model is not valid. Please try again!' })
    }

    const updatedCarModel = formData as unknown as { id: string, modelName: string, manufacturer: string, version: string, engineType: string, fuelType: string, transmissionType: string, horsepower: string, torque: string, seatingCapacity: string }

    try {
        const isCarModelIdExisted = await checkIfCarModelIdExists(parseInt(updatedCarModel.id))

        if (!isCarModelIdExisted) {
            return fail(400, { status: 'failed', action: 'deleteCarModel', invalidData: true, message: 'Car model does not exist to be edited!' })
        }

        await db.carModel.update({
            where: { id: parseInt(updatedCarModel.id) },
            data: {
                modelName: updatedCarModel.modelName,
                manufacturer: updatedCarModel.manufacturer,
                version: updatedCarModel.version,
                engineType: updatedCarModel.engineType,
                fuelType: updatedCarModel.fuelType,
                transmissionType: updatedCarModel.transmissionType,
                horsepower: updatedCarModel.horsepower,
                torque: updatedCarModel.torque,
                seatingCapacity: parseInt(updatedCarModel.seatingCapacity)
            }
        })

        console.log('Car model updated successfully!')
        return { status: 'success', action: 'editCarModel', invalidData: false, message: 'Car model updated successfully!' }
    } catch (error) {
        console.error(error)
        return fail(400, { status: 'failed', action: 'editCarModel', invalidData: true, message: 'Something went wrong. Please recheck your car model information!' })
    }
}

async function deleteCarModel(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'Access denied! You must be an administrator to delete car model!')
    }

    const formData = await event.request.formData()

    const deleteCarModelId = formData.get('id') as string

    if (!deleteCarModelId) {
        return fail(400, { status: 'failed', action: 'deleteCarModel', invalidId: true, message: 'Car model ID is required!' })
    }

    try {
        const isCarModelReferencedByOtherRecords = await checkIfCarModelReferencedByOtherRecords(parseInt(deleteCarModelId))

        if (isCarModelReferencedByOtherRecords) {
            return fail(400, { status: 'failed', action: 'deleteCarModel', invalidId: true, message: 'Unable to delete! Car model is referenced by other records!' })
        }

        const deleteCarModel = await db.carModel.delete({
            where: { id: parseInt(deleteCarModelId) }
        })

        if (!deleteCarModel) {
            return fail(400, { status: 'failed', action: 'deleteCarModel', invalidId: true, message: 'Car model does not exist to be deleted!' })
        }

        console.log('Car model deleted successfully!')
        return { status: 'success', action: 'deleteCarModel', invalidId: false, message: 'Car model deleted successfully!' }
    } catch (error) {
        console.error(error)
        return fail(400, { status: 'failed', action: 'deleteCarModel', invalidId: true, message: 'Unable to delete car model. Something went wrong!' })
    }

}

async function deleteManyCarModels(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'Access denied! You must be an administrator to edit car models!')
    }

    const formData = await event.request.formData()

    const rawDeleteCarModelIds = formData.get('ids') as string
    let deleteCarModelIds: number[]

    if (checkValidCarModelIds(rawDeleteCarModelIds)) {
        if (rawDeleteCarModelIds.length === 1) {
            deleteCarModelIds = [parseInt(rawDeleteCarModelIds)]
        } else {
            deleteCarModelIds = rawDeleteCarModelIds.split(',').map(id => parseInt(id))
        }

        try {
            const isCarModelsReferencedByOtherRecords = await checkIfCarModelsReferencedByOtherRecords(deleteCarModelIds)

            if (isCarModelsReferencedByOtherRecords) {
                return fail(400, { status: 'failed', action: 'deleteManyCarModels', invalidId: true, message: 'Unable to delete! One or many car models are referenced by other records!' })
            }

            const deletedCarModels = await db.carModel.deleteMany({
                where: { id: { in: deleteCarModelIds } }
            })

            if (deletedCarModels.count === 0) {
                return fail(400, { status: 'failed', action: 'deleteCarModel', invalidIds: true, message: 'Car models do not exist!' })
            }

            console.log('Car models deleted successfully!')
            return { status: 'success', action: 'deleteManyCarModels', invalidIds: false, message: 'Car models deleted successfully!' }
        } catch (error) {
            console.error(error)
            return fail(400, { status: 'failed', action: 'deleteManyCarModels', invalidIds: true, message: 'Unable to delete car models. Something went wrong!' })
        }
    } else {
        return fail(400, { status: 'failed', action: 'deleteManyCarModels', invalidIds: true, message: 'Car model IDs are required!' })
    }
}

function checkValidCarModelIds(rawDeleteCarModelIds: string) {
    // TODO: check if the format is correct
    // Expected format is: 1,2,3,4
    if (!rawDeleteCarModelIds) {
        return false
    }

    return true
}

async function searchCarModels(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    const formData = await event.request.formData()

    const searchQuery = String(formData.get('searchQuery'))

    const matchedCarModels = await searchCarModelsMatchedWithQuery(searchQuery)

    const matchedCarModelIds: number[] = []

    matchedCarModels.forEach(carModel => {
        matchedCarModelIds.push(carModel.id)
    })

    console.log('Search successfully!')
    return { status: 'success', action: 'searchCarModels', matchedCarModelIds }
}