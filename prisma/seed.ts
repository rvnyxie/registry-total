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
    await prisma.owner.create({
        data: {
            id: '099342993',
            address: 'P. Nguyễn Cơ Thạch, Mỹ Đình, Từ Liêm, Hà Nội, Vietnam',
            phoneNumber: '0989111222',
            email: 'long22@mail.com',
            ownerType: 'personal',
            fullname: 'Nguyễn Hoàng Long',
        }
    })
    await prisma.owner.create({
        data: {
            id: '099341992',
            address: '4 P. Hàm Nghi, Mỹ Đình 1, Từ Liêm, Hà Nội, Vietnam',
            phoneNumber: '0989342126',
            email: 'kien26@mail.com',
            ownerType: 'personal',
            fullname: 'Nguyễn Đăng Kiên',
        }
    })
    await prisma.owner.create({
        data: {
            id: '099783452',
            address: 'P. Hàm Nghi, Cầu Diễn, Từ Liêm, Hà Nội, Vietnam',
            phoneNumber: '0989532723',
            email: 'an23@mail.com',
            ownerType: 'personal',
            fullname: 'Lê Mai An',
        }
    })
    await prisma.owner.create({
        data: {
            id: '099315558',
            address: '234 Street, My Dinh 1 Ward, Nam Tu Liem District, Hanoi City',
            phoneNumber: '0989324226',
            email: 'hoa26@mail.com',
            ownerType: 'personal',
            fullname: 'Nguyễn Trung Hòa',
        }
    })

    await prisma.owner.create({
        data: {
            id: '098823423',
            address: 'Handi Resco Building, 521 P. Kim Mã, Ngọc Khánh, Ba Đình, Hà Nội, Vietnam',
            phoneNumber: '0919334239',
            email: 'an39@mail.com',
            ownerType: 'company',
            fullname: 'Nguyễn Kim An',
            companyName: 'Atlas Co.',
            companyType: 'corporation',
            typeOfBusiness: 'transportation',
        }
    })
    await prisma.owner.create({
        data: {
            id: '098845922',
            address: '29 P. Liễu Giai, Ngọc Khánh, Ba Đình, Hà Nội 100000, Vietnam',
            phoneNumber: '0919336712',
            email: 'tai12@mail.com',
            ownerType: 'company',
            fullname: 'Phạm Chí Tài',
            companyName: 'Mireli Co.',
            companyType: 'corporation',
            typeOfBusiness: 'manufacturing',
        }
    })
    await prisma.owner.create({
        data: {
            id: '098823119',
            address: '360 P. Kim Mã, Ngọc Khánh, Ba Đình, Hà Nội 10000, Vietnam',
            phoneNumber: '0919334237',
            email: 'ngo37@mail.com',
            ownerType: 'company',
            fullname: 'Mai Bình Ngô',
            companyName: 'Norenu',
            companyType: 'Limited Liability Company (LLC)',
            typeOfBusiness: 'retail',
        }
    })
    await prisma.owner.create({
        data: {
            id: '09873377',
            address: 'Handi Resco Building, 521 P. Kim Mã, Ngọc Khánh, Ba Đình, Hà Nội, Vietnam',
            phoneNumber: '0919331088',
            email: 'duyen88@mail.com',
            ownerType: 'company',
            fullname: 'Phan Mi Duyên',
            companyName: 'Peta Co.',
            companyType: 'corporation',
            typeOfBusiness: 'transportation',
        }
    })

    // CREATE CARMODEL DATA
    await prisma.carModel.create({
        data: {
            modelName: "Vinfast VF8 2022",
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
            modelName: "Vinfast VF9 2023",
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
            modelName: "Vinfast VF e34 2023",
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
    await prisma.carModel.create({
        data: {
            modelName: "Mazda CX-5 2023",
            manufacturer: "Mazda",
            version: "CX-5",
            engineType: "Inline-4",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "187",
            torque: "186",
            seatingCapacity: 5,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Toyota Camry 2.5G 2023",
            manufacturer: "Toyota",
            version: "2.5G",
            engineType: "Inline-4",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "178",
            torque: "221",
            seatingCapacity: 5,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Toyota Innova 2.0E 2020",
            manufacturer: "Toyota",
            version: "2.0E",
            engineType: "Inline-4",
            fuelType: "Gasoline",
            transmissionType: "Manual",
            horsepower: "134",
            torque: "183",
            seatingCapacity: 7,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Toyota Alphard Luxury 2023",
            manufacturer: "Toyota",
            version: "Luxury",
            engineType: "V6",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "275",
            torque: "355",
            seatingCapacity: 7,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Mercedes S-Class 2023",
            manufacturer: "Mercedes",
            version: "2023",
            engineType: "V6",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "429",
            torque: "384",
            seatingCapacity: 5,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Mercedes S-Class 2023",
            manufacturer: "Mercedes",
            version: "2023",
            engineType: "V6",
            fuelType: "Diesel",
            transmissionType: "Automatic",
            horsepower: "429",
            torque: "384",
            seatingCapacity: 5,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Mercedes C-Class 2023",
            manufacturer: "Mercedes",
            version: "2023",
            engineType: "Inline-4",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "255",
            torque: "273",
            seatingCapacity: 5,
        }

    })
    await prisma.carModel.create({
        data: {
            modelName: "Mercedes CLA-Class 2023",
            manufacturer: "Mercedes",
            version: "2023",
            engineType: "Inline-4",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "221",
            torque: "258",
            seatingCapacity: 5,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Mercedes E-Class 2023",
            manufacturer: "Mercedes",
            version: "2023",
            engineType: "Inline-4",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "400",
            torque: "300",
            seatingCapacity: 5,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Mercedes E-Class 2023",
            manufacturer: "Mercedes",
            version: "2023",
            engineType: "Inline-6",
            fuelType: "Gasoline",
            transmissionType: "Automatic",
            horsepower: "450",
            torque: "400",
            seatingCapacity: 5,
        }
    })
    await prisma.carModel.create({
        data: {
            modelName: "Mercedes E-Class 2023",
            manufacturer: "Mercedes",
            version: "2023",
            engineType: "V8",
            fuelType: "Diesel",
            transmissionType: "Automatic",
            horsepower: "400",
            torque: "400",
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
    await prisma.car.create({
        data: {
            registrationNumber: '242832',
            registrationDate: new Date(2017, 1, 1),
            licensePlateNumber: '30A-342.90',
            owner: {
                connect: {
                    id: '099342993'
                }
            },
            carModel: {
                connect: {
                    id: 1
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'personal use'
                }
            }
        }
    })
    await prisma.car.create({
        data: {
            registrationNumber: '324118',
            registrationDate: new Date(2016, 12, 10),
            licensePlateNumber: '29A-324.32',
            owner: {
                connect: {
                    id: '099341992'
                }
            },
            carModel: {
                connect: {
                    id: 2
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'personal use'
                }
            }
        }
    })
    await prisma.car.create({
        data: {
            registrationNumber: '231990',
            registrationDate: new Date(2016, 12, 10),
            licensePlateNumber: '29A-223.14',
            owner: {
                connect: {
                    id: '099783452'
                }
            },
            carModel: {
                connect: {
                    id: 2
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'personal use'
                }
            }
        }
    })
    await prisma.car.create({
        data: {
            registrationNumber: '324872',
            registrationDate: new Date(2016, 12, 10),
            licensePlateNumber: '17A-123.32',
            owner: {
                connect: {
                    id: '099315558'
                }
            },
            carModel: {
                connect: {
                    id: 3
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'personal use'
                }
            }
        }
    })
    await prisma.car.create({
        data: {
            registrationNumber: '989623',
            registrationDate: new Date(2016, 12, 10),
            licensePlateNumber: '29A-363.21',
            owner: {
                connect: {
                    id: '098823423'
                }
            },
            carModel: {
                connect: {
                    id: 4
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'commercial use'
                }
            }
        }
    })
    await prisma.car.create({
        data: {
            registrationNumber: '321878',
            registrationDate: new Date(2016, 12, 10),
            licensePlateNumber: '19A-324.56',
            owner: {
                connect: {
                    id: '098845922'
                }
            },
            carModel: {
                connect: {
                    id: 5
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'commercial use'
                }
            }
        }
    })
    await prisma.car.create({
        data: {
            registrationNumber: '723774',
            registrationDate: new Date(2016, 12, 10),
            licensePlateNumber: '19A-199.37',
            owner: {
                connect: {
                    id: '098823119'
                }
            },
            carModel: {
                connect: {
                    id: 6
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'commercial use'
                }
            }
        }
    })
    await prisma.car.create({
        data: {
            registrationNumber: '774591',
            registrationDate: new Date(2016, 12, 10),
            licensePlateNumber: '24A-130.77',
            owner: {
                connect: {
                    id: '09873377'
                }
            },
            carModel: {
                connect: {
                    id: 10
                }
            },
            usagePurpose: {
                connect: {
                    purpose: 'commercial use'
                }
            }
        }
    })

    // CREATE INSPECTION STATION
    await prisma.inspectionStation.create({
        data: {
            stationName: 'Trạm đăng kiểm Long Thành',
            stattionAdrress: '24 Đào Tấn, Cống Vị, Ba Đình, Hà Nội 10000, Vietnam',
            inspectionStationType: 'Mobile inspection station',
        }
    })
    await prisma.inspectionStation.create({
        data: {
            stationName: 'Trạm đăng kiểm Kim Vân - Quảng Tây',
            stattionAdrress: '36 P. Lý Thường Kiệt, Hàng Bài, Hoàn Kiếm, Hà Nội, Vietnam',
            inspectionStationType: 'Emissions testing station',
        }
    })
    await prisma.inspectionStation.create({
        data: {
            stationName: 'Trạm đăng kiểm Mã Đáo - Mã Thị',
            stattionAdrress: '180/2 Nguyễn Lương Bằng, Chợ Dừa, Đống Đa, Hà Nội, Vietnam',
            inspectionStationType: 'Safety inspection statio',
        }
    })
    await prisma.inspectionStation.create({
        data: {
            stationName: 'Trạm đăng kiểm Bến Nghẽ',
            stattionAdrress: '2RHG+MVH, Chợ Dừa, Đống Đa, Hà Nội, Vietnam',
            inspectionStationType: 'Safety inspection statio',
        }
    })
    await prisma.inspectionStation.create({
        data: {
            stationName: 'Trạm đăng kiểm Phú Hòa',
            stattionAdrress: '8 P. Phủ Doãn, Hàng Bông, Hoàn Kiếm, Hà Nội, Vietnam',
            inspectionStationType: 'Trailer inspection station',
        }
    })

    // CREATE CAR INSPECTION
    await prisma.carInspection.create({
        data: {
            // 3-first-digit of car, 3-first-digit of station id, date of inspection, random 3 characters
            id: '242001230623XYZ',
            inspectionType: 'Vehicle Registration Inspection',
            expiredDate: new Date(2024, 6, 23),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '242832'
                }
            },
            inspectionStation: {
                connect: {
                    id: 1
                }
            }
        }
    })
    await prisma.carInspection.create({
        data: {
            // 3-first-digit of car, 3-first-digit of station id, date of inspection, random 3 characters
            id: '324001230623TUS',
            inspectionType: 'Periodic vehicle inspection',
            expiredDate: new Date(2024, 6, 23),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '324118'
                }
            },
            inspectionStation: {
                connect: {
                    id: 1
                }
            }
        }
    })
    await prisma.carInspection.create({
        data: {
            // 3-first-digit of car, 3-first-digit of station id, date of inspection, random 3 characters
            id: '231002200623TIX',
            inspectionType: 'Pre-purchase inspection',
            expiredDate: new Date(2024, 6, 20),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '231990'
                }
            },
            inspectionStation: {
                connect: {
                    id: 2
                }
            }
        }
    })
    await prisma.carInspection.create({
        data: {
            // 3-first-digit of car, 3-first-digit of station id, date of inspection, random 3 characters
            id: '324004120123XAA',
            inspectionType: 'Pre-purchase inspection',
            expiredDate: new Date(2024, 1, 12),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '324872'
                }
            },
            inspectionStation: {
                connect: {
                    id: 4
                }
            }
        }
    })
    await prisma.carInspection.create({
        data: {
            // 3-first-digit of car, 3-first-digit of station id, date of inspection, random 3 characters
            id: '989005230623ZZZ',
            inspectionType: 'Commercial vehicle inspection',
            expiredDate: new Date(2024, 6, 23),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '989623'
                }
            },
            inspectionStation: {
                connect: {
                    id: 5
                }
            }
        }
    })
    await prisma.carInspection.create({
        data: {
            // 3-first-digit of car, 3-first-digit of station id, date of inspection, random 3 characters
            id: '321004100623PPZ',
            inspectionType: 'Commercial vehicle inspection',
            expiredDate: new Date(2024, 6, 10),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '321878'
                }
            },
            inspectionStation: {
                connect: {
                    id: 4
                }
            }
        }
    })
    await prisma.carInspection.create({
        data: {
            // 3-first-digit of car, 3-first-digit of station id, date of inspection, random 3 characters
            id: '723005120323XYZ',
            inspectionType: 'Safety inspection',
            expiredDate: new Date(2024, 3, 12),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '723774'
                }
            },
            inspectionStation: {
                connect: {
                    id: 5
                }
            }
        }
    })
    await prisma.carInspection.create({
        data: {
            // 3-first-digit of car, 3-first-digit of station id, date of inspection, random 3 characters
            id: '774002230623XDR',
            inspectionType: 'Safety inspection',
            expiredDate: new Date(2024, 6, 23),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '774591'
                }
            },
            inspectionStation: {
                connect: {
                    id: 2
                }
            }
        }
    })
    await prisma.carInspection.create({
        data: {
            // 3-first-digit of car, 3-first-digit of station id, date of inspection, random 3 characters
            id: '774003230623XJY',
            inspectionType: 'Vehicle Registration Inspection',
            expiredDate: new Date(2024, 6, 23),
            result: 'success',
            note: '',
            car: {
                connect: {
                    registrationNumber: '774591'
                }
            },
            inspectionStation: {
                connect: {
                    id: 3
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