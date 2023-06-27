import db from "$lib/server/database"

export async function checkIfCarInspectionIdExists(id: string) {
    const carInspection = await db.carInspection.findUnique({
        where: { id }
    })

    if (!carInspection) {
        return false
    }

    return true
}

export async function searchCarInspectionsMatchedWithQuery(searchQuery: string) {
    return await db.carInspection.findMany({
        where: {
            OR: [
                { id: { contains: searchQuery } },
                { inspectionType: { contains: searchQuery } },
                { result: { contains: searchQuery } },
                { note: { contains: searchQuery } },
                {
                    car: {
                        registrationNumber: { contains: searchQuery },
                        licensePlateNumber: { contains: searchQuery },
                    }
                },
                {
                    inspectionStation: {
                        stationName: { contains: searchQuery }
                    }
                }
            ]
        }
    })
}