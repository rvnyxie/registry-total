import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {

    // CREATE USER DATA
    // Admin user
    await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('admin', 10),
            email: 'admin@mail.com',
            isAdmin: true
        }
    })
    // Normal user, normal user is relevant to a specific inspection station
    await prisma.user.create({
        data: {
            username: 'normal',
            password: await bcrypt.hash('normal', 10),
            email: 'normal@mail.com',
            isAdmin: false,
            inspectionStation: {
                create: {
                    stationName: 'Normal Inspection Station',
                    stattionAdrress: '123 Street, Suite 330',
                    inspectionStationType: 'Car Inspection Station'
                }
            }
        }
    })

    // CREATE OWNER DATA
    // Owner 1
    await prisma.owner.create({
        data: {
            id: '099111222',
            address: '234 Street, My Dinh 1 Ward, Nam Tu Liem District, Hanoi City',
            phoneNumber: '0989111222',
            email: 'long@mail.com',
            ownerType: 'personal',
            fullname: 'Nguyen Hoang Long',
            companyName: '',
            companyType: '',
            typeOfBusiness: '',
        }
    })
    // Owner 2
    await prisma.owner.create({
        data: {
            id: '099222333',
            address: '234 Street, Chuong Duong Ward, Hoan Kiem District, Hanoi City',
            phoneNumber: '0989222333',
            email: 'an@mail.com',
            ownerType: 'company',
            fullname: 'Nguyen Kim An',
            companyName: 'Atlas Co.',
            companyType: 'corporation',
            typeOfBusiness: 'transportation',
        }
    })

    // CREATE CARMODEL DATA
    await prisma.carModel.create({
        data: {
            modelName: "Vinfast VF8",
            manufacturer: "Vinfast",
            version: "VF8",
            engineType: "V8",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "420",
            torque: "650",
            seatingCapacity: 4,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Vinfast VF9",
            manufacturer: "Vinfast",
            version: "VF9",
            engineType: "V6",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "360",
            torque: "600",
            seatingCapacity: 7,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Vinfast VF e34",
            manufacturer: "Vinfast",
            version: "VF34",
            engineType: "Inline-4",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "190",
            torque: "330",
            seatingCapacity: 5,
        }
    })

    // CREATE USAGE PURPOSE DATA
    await prisma.usagePurpose.create({
        data: { purpose: 'personal use' }
    })
    await prisma.usagePurpose.create({
        data: { purpose: 'commercial use' }
    })
    await prisma.usagePurpose.create({
        data: { purpose: 'public use' }
    })
    await prisma.usagePurpose.create({
        data: { purpose: 'construction and industrial use' }
    })

    // CREATE CAR DATA
    // Car relevant to owner 1
    await prisma.car.create({
        data: {
            registrationNumber: '222333',
            registrationDate: new Date(2017, 1, 1),
            licensePlateNumber: '30A-777.77',
            owner: {
                connect: {
                    id: '099111222'
                }
            },
            carModel: {
                connect: {
                    modelName: 'Vinfast VF8'
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'personal use'
                }
            }
        }
    })
    // Car relevant to owner 2
    await prisma.car.create({
        data: {
            registrationNumber: '333444',
            registrationDate: new Date(2016, 12, 10),
            licensePlateNumber: '29A-555.55',
            owner: {
                connect: {
                    id: '099222333'
                }
            },
            carModel: {
                connect: {
                    modelName: 'Vinfast VF e34'
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'commercial use'
                }
            }
        }
    })

    // CREATE CAR INSPECTION
    await prisma.carInspection.create({
        data: {
            // 3-last-digit of car, 3-last-digit of owner, first characters of station name, date of inspection, random 2 characters
            id: '444333NIS230623XZ',
            inspectionType: 'Vehicle Registration Inspection',
            expiredDate: new Date(2024, 6, 23),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '222333'
                }
            },
            inspectionStation: {
                connect: {
                    id: 1
                }
            }
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        process.exit(1)
    })