import * as userDB from '$lib/database/tables/user'

export const actions = {
    changeUser: async ({ request }) => {
        const data = await request.formData()

        const user_id = data.get('user_id') as string
        const username = data.get('username') as string 
        const password = data.get('password') as string
        const email = data.get('email') as string
        const is_admin = data.get('is_admin') as string
        const created_time = data.get('created_time') as string
        const last_update = data.get('last_update') as string
        const inspection_station_id = data.get('inspection_station_id') as string
        const action_type = data.get('action_type') as string // add_user | edit_user

        // Return this data to client, client will update local storage (yes, i'm cheating)
        return {
            changeStatus: true,
            user_id: user_id,
            username: username,
            password: password,
            email: email,
            is_admin: is_admin,
            created_time: created_time,
            last_update: last_update,
            inspection_station_id: inspection_station_id,
            action_type: action_type
        }
    },
    deleteUser: async ({ request }) => {
        const data = await request.formData()

        const user_id = data.get('user_id') as string

        return {
            deleteStatus: true,
            user_id: user_id
        }
    }
}