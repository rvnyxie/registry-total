import db from '$lib/server/database'

export async function checkIfOnlyOneCarModelExists(modelName: string, version: string, engineType: string, fuelType: string, seatingCapacity: string) {
    const carModel = await db.carModel.findMany({
        where: {
            AND: [
                {
                    modelName,
                    version,
                    engineType,
                    fuelType,
                    seatingCapacity: parseInt(seatingCapacity)
                }
            ]

        }
    })

    if (carModel.length === 1) {
        return true
    }

    return false
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

export async function checkIfCarModelReferencedByOtherRecords(id: number) {
    const carModel = await db.carModel.findUnique({
        where: { id },
        select: {
            car: {
                select: { id: true }
            }
        }
    })

    if (!carModel || carModel.car.length !== 0) {
        return true
    }

    return false
}

export async function checkIfCarModelsReferencedByOtherRecords(ids: number[]) {
    const carModels = await db.carModel.findMany({
        where: { id: { in: ids } },
        select: {
            car: {
                select: { id: true }
            }
        }
    })

    for (const carModel of carModels) {
        if (carModel.car.length !== 0) {
            return true
        }
    }

    return false
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