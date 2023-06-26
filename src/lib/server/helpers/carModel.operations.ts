import db from '$lib/server/database'

export async function checkIfCarModelNameExists(modelName: string) {
    const carModel = await db.carModel.findUnique({
        where: { modelName }
    })

    if (!carModel) {
        return false
    }

    return true
}

export async function checkIfCarModelIdExists(id: number) {
    const carModel = await db.carModel.findUnique({
        where: { id }
    })

    if (!carModel) {
        return false
    }

    return true
}

export async function searchCarModelsMatchedWithQuery(searchQuery: string) {
    return await db.carModel.findMany({
        where: {
            OR: [
                { modelName: { contains: searchQuery } },
                { manufacturer: { contains: searchQuery } },
                { version: { contains: searchQuery } },
                { engineType: { contains: searchQuery } },
                { fuelType: { contains: searchQuery } },
                { transmissionType: { contains: searchQuery } },
                { horsepower: { contains: searchQuery } },
                { torque: { contains: searchQuery } }
            ]
        },
        select: { id: true }
    })
}