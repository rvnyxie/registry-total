import db from '$lib/server/database'

import bcrypt from 'bcrypt';

export async function checkIfUsernameAndEmailExist(username: string, email: string) {
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

export async function createNewAdminUser(username: string, password: string, email: string) {
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

export async function createNewNormalUser(username: string, password: string, email: string, inspectionStationId: string) {
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

type UpdatedUser = {
    id: string
    username: string,
    password: string,
    email: string,
    isAdminValue: boolean,
    inspectionStationId: string,
    inspectionStationExist: boolean
}

export async function updateUser(updatedUser: UpdatedUser) {
    const { id, username, password, isAdminValue, email, inspectionStationId, inspectionStationExist } = updatedUser

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
}

export async function checkIfUserIdExist(id: number) {
    const user = await db.user.findUnique({
        where: { id: id }
    })

    if (!user) {
        return false
    }

    return true
}

export async function checkIfInspectionStationExisted(inspectionStationId: string) {
    const foundInspectionStation = await db.inspectionStation.findUnique({
        where: { id: Number(inspectionStationId) }
    })

    if (!foundInspectionStation) {
        return false
    }

    return true
}