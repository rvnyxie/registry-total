import type { PageServerLoad, Actions, RequestEvent } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'

import db from '$lib/server/database'
import {
    checkIfIdOrPhonenumbeOrEmailExisted,
    checkIfOnlyOneOwnerMatch,
    searchOwnersMatchedWithQuery
} from '$lib/server/helpers/owner.operations'

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login')
    } else {
        const owners = await db.owner.findMany({
            select: {
                id: true,
                fullname: true,
                address: true,
                phoneNumber: true,
                email: true,
                ownerType: true,
                companyType: true,
                companyName: true,
                typeOfBusiness: true,
            }
        })

        return { owners }
    }
}

export const actions: Actions = {
    createOwner,
    editOwner,
    deleteOwner,
    deleteManyOwners,
    searchOwners
}

async function createOwner(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    const formData = Object.fromEntries(await event.request.formData())
    const isFormDataValid = checkIfFormDataValid(formData)

    if (!isFormDataValid) {
        return fail(400, { status: 'failed', action: 'createOwner', invalidData: true, message: 'Form data validation failed!' })
    }

    const requestedOwner =
        formData as unknown as { id: string, fullname: string, address: string, phoneNumber: string, email: string, ownerType: string, companyType: string, companyName: string, typeOfBusiness: string }

    const isIdOrPhonenumbeOrEmailExisted = await checkIfIdOrPhonenumbeOrEmailExisted(requestedOwner.id, requestedOwner.phoneNumber, requestedOwner.email)

    if (isIdOrPhonenumbeOrEmailExisted) {
        return fail(400, { status: 'failed', action: 'createOwner', invalidData: true, message: 'Owner existed!' })
    }

    try {
        if (requestedOwner.ownerType.toLowerCase() === 'personal') {
            await db.owner.create({
                data: {
                    id: requestedOwner.id,
                    fullname: requestedOwner.fullname,
                    address: requestedOwner.address,
                    phoneNumber: requestedOwner.phoneNumber,
                    email: requestedOwner.email,
                    ownerType: requestedOwner.ownerType
                }
            })
        } else {
            await db.owner.create({
                data: {
                    id: requestedOwner.id,
                    fullname: requestedOwner.fullname,
                    address: requestedOwner.address,
                    phoneNumber: requestedOwner.phoneNumber,
                    email: requestedOwner.email,
                    ownerType: requestedOwner.ownerType,
                    companyType: requestedOwner.companyType,
                    companyName: requestedOwner.companyName,
                    typeOfBusiness: requestedOwner.typeOfBusiness
                }
            })
        }

        console.log('Owner created successfully!')
        return { status: 'success', action: 'createOwner', invalidData: false, message: 'Owner created successfully!' }
    } catch (error) {
        console.error(error)

        return fail(400, { status: 'failed', action: 'createOwner', invalidData: true, message: 'Unable to create new owner. Something went wrong!' })
    }
}

function checkIfFormDataValid(formData: { [k: string]: FormDataEntryValue }) {
    if (
        !formData.id ||
        !formData.fullname ||
        !formData.address ||
        !formData.phoneNumber ||
        !formData.ownerType
    ) {
        return false
    }

    if (formData.ownerType.toString().toLowerCase() !== 'personal') {
        if (
            !formData.companyType ||
            !formData.companyName ||
            !formData.typeOfBusiness
        ) {
            return false
        }
    }

    return true
}

async function editOwner(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'You are not authorized to edit this owner!')
    }

    const formData = Object.fromEntries(await event.request.formData())

    const isFormDataValid = checkIfFormDataValid(formData)

    if (!isFormDataValid) {
        return fail(400, { status: 'failed', action: 'editOwner', invalidData: true, message: 'Your owner info is incorrect!' })
    }

    const { id, fullname, address, phoneNumber, email, ownerType, companyName, companyType, typeOfBusiness } =
        formData as unknown as { id: string, fullname: string, address: string, phoneNumber: string, email: string, ownerType: string, companyName: string, companyType: string, typeOfBusiness: string }

    const isOnlyOneOwnerMatched = checkIfOnlyOneOwnerMatch(id, phoneNumber, email)

    if (!isOnlyOneOwnerMatched) {
        return fail(400, { status: 'failed', action: 'editOwner', invalidData: true, message: 'Owner may not exist or (id, phone number, email) are used!' })
    }

    // From now, there's only one owner that matches with the data submitted
    // So we update the owner
    // TODO: one day, a hacker man may screw up the system by sending different id along with updated information
    // Maybe we need to do something to prevent that. But not today...
    try {
        if (ownerType.toLowerCase() === 'personal') {
            await db.owner.update({
                where: {
                    id: id
                },
                data: {
                    fullname: fullname,
                    address: address,
                    phoneNumber: phoneNumber,
                    email: email,
                    ownerType: ownerType
                }
            })
        } else {
            await db.owner.update({
                where: {
                    id: id
                },
                data: {
                    fullname: fullname,
                    address: address,
                    phoneNumber: phoneNumber,
                    email: email,
                    ownerType: ownerType,
                    companyType: companyType,
                    companyName: companyName,
                    typeOfBusiness: typeOfBusiness
                }
            })
        }

        console.log('Owner updated successfully!')
        return { status: 'success', action: 'editOwner', invalidData: false, message: 'Owner updated successfully!' }
    } catch (error) {
        console.error(error)
        return fail(400, { status: 'failed', action: 'editOwner', invalidData: true, message: 'Unable to update owner. Something went wrong!' })
    }
}



async function deleteOwner(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'You are not authorized to delete this owner!')
    }

    const formData = await event.request.formData()

    const deleteOwnerId = formData.get('id')

    if (!deleteOwnerId) {
        return fail(400, { status: 'failed', action: 'deleteOwner', invalidData: true, message: 'Owner id is required!' })
    }

    const deleteOwner = await db.owner.delete({
        where: { id: deleteOwnerId.toString() }
    })

    if (!deleteOwner) {
        return fail(400, { status: 'failed', action: 'deleteOwner', invalidData: true, message: 'Owner does not exist!' })
    }

    console.log('Owner deleted successfully!')
    return { status: 'success', action: 'deleteOwner', invalidData: false, message: 'Owner deleted successfully!' }
}

async function deleteManyOwners(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'You are not authorized to edit these owners!')
    }

    const formData = await event.request.formData()

    const rawDeleteOwnerIds = formData.get('ids')
    let deleteOwnerIds: string[] | undefined

    if (checkValidOwnerIds(rawDeleteOwnerIds)) {
        if (rawDeleteOwnerIds?.length === 1) {
            // There is only one id
            deleteOwnerIds = [rawDeleteOwnerIds.toString()]
        } else {
            deleteOwnerIds = rawDeleteOwnerIds?.toString().split(',')
        }

        const deleteOwners = await db.owner.deleteMany({
            where: { id: { in: deleteOwnerIds } }
        })

        if (deleteOwners.count === 0) {
            return fail(400, { status: 'failed', action: 'deleteManyOwners', invalidData: true, message: 'Owners do not exist!' })
        }

        console.log('Owners deleted successfully!')
        return { status: 'success', action: 'deleteManyOwners', invalidData: false, message: 'Owners deleted successfully!' }
    } else {
        return fail(400, { status: 'failed', action: 'deleteManyOwners', invalidData: true, message: 'Owner ids are required! Invalid owner ids!' })
    }
}

function checkValidOwnerIds(rawDeleteOwnerIds: FormDataEntryValue | null) {
    // TODO: check if the format is correct
    // Expected format is: 1,2,3,4
    if (!rawDeleteOwnerIds) {
        return false
    }

    return true
}

async function searchOwners(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    const formData = await event.request.formData()

    const searchQuery = String(formData.get('searchQuery'))

    const matchedOwners = await searchOwnersMatchedWithQuery(searchQuery)

    const matchedOwnerIds: string[] = []
    matchedOwners.forEach(owner => matchedOwnerIds.push(owner.id))

    console.log('Search successful!')
    return { status: 'success', action: 'searchOwners', matchedOwnerIds }
}