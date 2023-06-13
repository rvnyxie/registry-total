type ownerType = {
    owner_id: string,
    full_name: string,
    address?: string,
    phone_number?: string,
    email?: string,
    owner_type?: string,
    company_name?: string,
    type_of_business?: string,
    company_type?: string
}

const initialOwners: ownerType[] = [
    {
        owner_id: '123456789',
        full_name: 'Nyx Isl',
        address: '123 example strees',
        phone_number: '012345678',
        email: 'dp@mail.com',
        owner_type: 'personal',
        company_name: '',
        type_of_business: '',
        company_type: ''
    },
    {
        owner_id: '987654321',
        full_name: 'Nam Nt',
        address: '456 example strees',
        phone_number: '087654321',
        email: 'nt@mail.com',
        owner_type: 'commercial',
        company_name: 'fake compayny name',
        type_of_business: 'transporting',
        company_type: 'partnership'
    }
]

export const ownerDB = new Map()

for (let i = 0; i < initialOwners.length; i++) {
    ownerDB.set(initialOwners[i].owner_id, initialOwners[i])
}
