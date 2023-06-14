type userType = {
    user_id: number;
    username: string;
    password: string;
    is_admin: boolean;
    email?: string;
    created_time?: string;
    last_update?: string;
    inspection_station_id?: string;
};

const default_accounts = [
    {
        user_id: 1,
        username: 'ntn',
        password: '1',
        is_admin: true,
        email: 'ntn@mail.com',
        created_time: '2023-05-15',
        last_update: '2023-06-13',
        inspection_station_id: ''
    },
    {
        user_id: 2,
        username: 'guest',
        password: '2',
        is_admin: false,
        email: 'guest@mail.com',
        created_time: '2023-05-20',
        last_update: '2023-06-13',
        inspection_station_id: 'station1'
    }
]

let accounts: userType[] = default_accounts
// eslint-disable-next-line prefer-const
let role = ''

try {
    const localAccounts = localStorage.getItem('accounts')
    const isAdmin = localStorage.getItem('role');

    role = isAdmin === 'not_admin' ? 'not_admin' : 'admin'

    if (localAccounts !== null) {
        accounts = JSON.parse(localAccounts) as userType[];
    } else {
        accounts = default_accounts;
    }
} catch (error) {
    console.error(error)
}


export function load() {
    return {
        accountsData: accounts,
        role: role
    }
}