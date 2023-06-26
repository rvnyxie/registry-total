import db from "$lib/server/database"

export async function checkIfIdOrPhonenumbeOrEmailExisted(id: string, phoneNumber: string, email: string) {
    const owner = await db.owner.findMany({
        where: {
            OR: [
                { id },
                { phoneNumber },
                { email }
            ]
        }
    })

    if (owner.length > 0)
        return true
    return false
}

export async function checkIfOnlyOneOwnerMatch(id: string, phoneNumber: string, email: string) {
    const owners = await db.owner.findMany({
        where: {
            OR: [
                { id },
                { phoneNumber },
                { email }
            ]
        }
    })

    if (owners.length !== 1) {
        return false
    }

    return true
}

export async function searchOwnersMatchedWithQuery(searchQuery: string) {
    return await db.owner.findMany({
        where: {
            OR: [
                { id: { contains: searchQuery } },
                { fullname: { contains: searchQuery } },
                { address: { contains: searchQuery } },
                { phoneNumber: { contains: searchQuery } },
                { email: { contains: searchQuery } },
                { ownerType: { contains: searchQuery } },
                { companyType: { contains: searchQuery } },
                { companyName: { contains: searchQuery } },
                { typeOfBusiness: { contains: searchQuery } }
            ]
        },
        select: { id: true }
    })
}