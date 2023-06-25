import type { Actions, PageServerLoad } from './$types'
import type { RequestEvent } from '@sveltejs/kit';
import { error, fail, redirect } from '@sveltejs/kit'

import db from '$lib/server/database'
import bcrypt from 'bcrypt'

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

async function checkIfUsernameAndEmailExist(username: string, email: string) {
    const user = await db.user.findMany({
        where: {
            OR: [
                { username: username },
                { email: email }
            ]
        }
    })

    // Empty array means truthy in JS
    if (user.length === 0) {
        return false
    }

    return true
}


async function createNewAdminUser(username: string, password: string, email: string) {
    const newAdminUser = await db.user.create({
        data: {
            username: username,
            password: await bcrypt.hash(password, 10),
            email: email,
            isAdmin: true,
            createdAt: new Date(),
        }
    })

    return newAdminUser
}

async function createNewNormalUser(username: string, password: string, email: string, inspectionStationId: string) {
    const inspectionStationExist = await db.inspectionStation.findUnique({
        where: { id: Number(inspectionStationId) }
    })

    let newNormalUser

    if (inspectionStationExist) {
        newNormalUser = await db.user.create({
            data: {
                username: username,
                password: await bcrypt.hash(password, 10),
                email: email,
                isAdmin: false,
                inspectionStation: {
                    connect: {
                        id: Number(inspectionStationId)
                    }
                }
            }
        })
    } else {
        newNormalUser = await db.user.create({
            data: {
                username: username,
                password: await bcrypt.hash(password, 10),
                email: email,
                isAdmin: false,
                inspectionStationId: null
            }
        })
    }


    return newNormalUser
}

async function editAccount(event: RequestEvent) {
    const formData = Object.fromEntries(await event.request.formData())
    console.log(formData)

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

        const inspectionStationExist = await db.inspectionStation.findUnique({
            where: { id: Number(inspectionStationId) }
        })

        if (!inspectionStationExist) {
            await db.user.update({
                where: { id: Number(id) },
                data: {
                    username: username,
                    password: await bcrypt.hash(password, 10),
                    email: email,
                    isAdmin: isAdminValue,
                    updatedAt: new Date(),
                    inspectionStationId: null
                }
            })
        } else {
            await db.user.update({
                where: { id: Number(id) },
                data: {
                    username: username,
                    password: await bcrypt.hash(password, 10),
                    email: email,
                    isAdmin: isAdminValue,
                    updatedAt: new Date(),
                    inspectionStation: {
                        connect: {
                            id: Number(inspectionStationId)
                        }
                    }
                }
            })
        }

        console.log('Updated successfully!')

        return { status: 'success', action: 'edit', invalidEditedData: false, message: 'Updated successfully!' }
    } catch (error) {
        console.error(error)
        return fail(400, { status: 'failed', action: 'edit', invalidEditedData: true, message: 'Username or email may be taken or inspection station id is incorrect! Try again!' })
    }

}

async function checkIfUserIdExist(id: number) {
    const user = await db.user.findUnique({
        where: { id: id }
    })

    if (!user) {
        return false
    }

    return true
}


async function deleteAccount(event: RequestEvent) {
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