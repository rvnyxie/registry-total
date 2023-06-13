type userType = {
    user_id: number,
    username: string,
    password: string,
    is_admin: boolean,
    email?: string,
    created_time?: string,
    last_update?: string,
    inspection_station_id?: string,
}

const initialUsers: userType[] = [
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

const userDB = new Map()

for (let i = 0; i < 2; i++) {
    userDB.set(initialUsers[i].username, initialUsers[i])
}

export function getUser(username: string): userType | 'No user found' {
    if (!userDB.has(username)) {
        return 'No user found'
    }
    return userDB.get(username)
}

export function addUser(newUser: userType): 'User existed' | 'Added successfully' {
    if (userDB.has(newUser.username)) {
        return 'User existed'
    }

    userDB.set(newUser.username, newUser)
    return 'Added successfully'
}

export function editUser(updatedUser: userType): 'User not found to edit' | 'Edited successfully' {
    if (!userDB.has(updatedUser.username)) {
        return 'User not found to edit'
    }

    userDB.set(updatedUser.username, updatedUser)
    return 'Edited successfully'
}

export function deleteUser(username: string): 'User not found to delete' | 'Deleted successfully' {
    if (!userDB.has(username)) {
        return 'User not found to delete'
    }

    userDB.delete(username)
    return 'Deleted successfully'
}

export function getAllUser(): userType[] {
    return Array.from(userDB.values(), value => ({ ...value }))
}