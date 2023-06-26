import type { Actions, PageServerLoad } from './$types'
import type { RequestEvent } from '@sveltejs/kit';
import { error, fail, redirect } from '@sveltejs/kit'

import db from '$lib/server/database'
import {
    checkIfInspectionStationExisted,
    checkIfUserIdExist,
    checkIfUsernameAndEmailExist,
    createNewAdminUser,
    createNewNormalUser,
    updateUser
} from '$lib/server/helpers/user.operations';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login')
    } else if (!locals.user.isAdmin) {
        throw error(401, 'You must be an administrator to view this page!')
    } else {
        const accounts = await db.user.findMany({
            select: {
                id: true,
                username: true,
                password: true,
                isAdmin: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                inspectionStationId: true
            }
        })

        return { accounts }
    }
}

export const actions: Actions = {
    addAccount,
    editAccount,
    deleteAccount,
    deleteManyAccounts,
    search
}

async function addAccount(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'You must be an administrator to add an account!')
    }

    const formData = Object.fromEntries(await event.request.formData());
    const isFormDataValid = checkValidFormSubmittedData(formData)

    if (!isFormDataValid) {
        return fail(400, { invalidData: true, message: 'Invalid account informations!' })
    }

    const { username, password, email, isAdmin, inspectionStationId } =
        formData as unknown as { username: string, password: string, email: string, isAdmin: string, inspectionStationId: string }

    const isUsernameOrEmailExisted = await checkIfUsernameAndEmailExist(username, email)
    if (isUsernameOrEmailExisted) {
        console.error('Could not create user! Username or email is existed!')
        return fail(400, { status: 'failed', action: 'create', invalidData: true, message: 'Could not create user! Username or email is existed!' })
    }

    // Create a new admin user
    if (isAdmin.toLowerCase() === 'yes' || isAdmin.toLowerCase() === 'true') {
        const newAdminUser = await createNewAdminUser(username, password, email)

        if (!newAdminUser) {
            console.error('Could not create admin user! Username or password or email is existed!')
            return fail(400, { status: 'failed', invalidData: true, message: 'Could not create admin user! Username or password or email is existed!' })
        }

        return { status: 'success', action: 'create', invalidData: false, message: 'Admin user created successfully!' }
    }

    // Create a new normal user
    const newNormalUser = await createNewNormalUser(username, password, email, inspectionStationId)

    if (!newNormalUser) {
        console.error('Could not create normal user!')
        return fail(400, { status: 'failed', action: 'create', invalidData: true, message: 'Could not create normal user! Username or password or email may exist!' })
    }

    return { status: 'success', action: 'create', invalidData: false, message: 'Admin user created successfully!' }

}

function checkValidFormSubmittedData(formData: { [k: string]: FormDataEntryValue }) {
    if (
        !formData.username ||
        !formData.password ||
        !formData.email ||
        (
            formData.isAdmin.toString().toLowerCase() !== 'yes' &&
            formData.isAdmin.toString().toLowerCase() !== 'no' &&
            formData.isAdmin.toString().toLowerCase() !== 'true' &&
            formData.isAdmin.toString().toLowerCase() !== 'false' &&
            formData.isAdmin.toString().toLowerCase() !== ''
        )
    ) {
        return false
    }

    return true
}

async function editAccount(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'You must be an administrator to edit an account!')
    }

    const formData = Object.fromEntries(await event.request.formData())

    const isFormDataValid = checkValidFormSubmittedData(formData)

    if (!isFormDataValid) {
        return fail(400, { status: 'failed', action: 'edit', invalidEditedData: true, message: 'Your updated data is invalid values! Try again!' })
    }

    const { id, username, password, email, isAdmin, inspectionStationId } =
        formData as unknown as { id: string, username: string, password: string, email: string, isAdmin: string, inspectionStationId: string }

    const isUserIdExisted = await checkIfUserIdExist(Number(id))
    // TODO: one day, a hacker man may screw up the system by sending different id along with updated information
    // Maybe we need to do something to prevent that. But not today...

    if (!isUserIdExisted) {
        return fail(400, { status: 'failed', action: 'edit', invalidEditedData: true, message: 'Can not find the user! Try again!' })
    }

    try {
        let isAdminValue = false;
        if (isAdmin.toLowerCase() === 'yes' || isAdmin.toLowerCase() === 'true') {
            isAdminValue = true;
        }

        const inspectionStationExist = await checkIfInspectionStationExisted(inspectionStationId)

        await updateUser({ id, username, password, email, isAdminValue, inspectionStationId, inspectionStationExist })

        console.log('Updated successfully!')

        return { status: 'success', action: 'edit', invalidEditedData: false, message: 'Updated successfully!' }
    } catch (error) {
        console.error(error)
        return fail(400, { status: 'failed', action: 'edit', invalidEditedData: true, message: 'Username or email may be taken or inspection station id is incorrect! Try again!' })
    }

}

async function deleteAccount(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'You must be an administrator to delete an account!')
    }

    const formData = await event.request.formData()

    const deleteAccountId = formData.get('id')

    const user = await db.user.findUnique({
        where: { id: Number(deleteAccountId) }
    })

    if (!user) {
        return fail(400, { status: 'failed', action: 'delete', invalidId: true, message: 'Something went wrong! Unable to find the account to delete' })
    }

    const deletedAccount = await db.user.delete({
        where: { id: Number(deleteAccountId) }
    })

    if (!deletedAccount) {
        return fail(400, { status: 'failed', action: 'delete', invalidId: true, message: 'Something went wrong! Unable to delete the account' })
    }

    return { status: 'success', action: 'delete', invalidId: false, message: 'Account deleted successfully!' }
}

async function deleteManyAccounts(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'You must be an administrator to delete these accounts!')
    }

    const formData = await event.request.formData()

    const rawDeleteAccountIds = formData.get('ids') // format is `1,2,3,4`
    let deleteAccountIds: number[] | undefined

    console.log(rawDeleteAccountIds)

    if (checkValidAccountIds(rawDeleteAccountIds)) {
        // If there's only one id
        if (rawDeleteAccountIds?.length === 1) {
            deleteAccountIds = [Number(rawDeleteAccountIds)]
        } else {
            // Convert type from string[] to number[]
            deleteAccountIds = (rawDeleteAccountIds?.toString().split(','))?.map(stringId => Number(stringId))
        }

        const deleteUsers = await db.user.deleteMany({
            where: { id: { in: deleteAccountIds } }
        })

        if (deleteUsers.count === 0) {
            return fail(400, { status: 'failed', action: 'delete', invalidIds: true, message: 'Something went wrong! Unable to delete the accounts' })
        }

        return { status: 'success', action: 'delete', invalidIds: false, message: 'Accounts deleted successfully!' }
    } else {

        return fail(400, { status: 'failed', action: 'delete', invalidIds: true, message: 'Something went wrong! Account Ids in not in correct formmat!' })
    }
}

function checkValidAccountIds(deleteAccountIds: FormDataEntryValue | null) {
    if (!deleteAccountIds) {
        console.error('Incorrect type of deleteAccountIds!')
        return false
    }

    return true
}

async function search(event: RequestEvent) {
    if (!event.locals.user) {
        throw redirect(302, '/login')
    }

    if (!event.locals.user.isAdmin) {
        throw error(401, 'You must be an administrator to access this data!')
    }

    const formData = await event.request.formData();

    const searchQuery = String(formData.get('searchQuery'))

    const matchedUsers = await db.user.findMany({
        where: {
            OR: [
                { username: { contains: searchQuery } },
                { email: { contains: searchQuery } },
            ]
        },
        select: {
            id: true
        }
    })

    const matchedUsersId: number[] = []

    matchedUsers.forEach(user => {
        matchedUsersId.push(user.id)
    })

    console.log(matchedUsers)

    return { status: 'success', action: 'search', matchedUsersId }
}