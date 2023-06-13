import * as userDB from '$lib/database/tables/user'
import { fail } from '@sveltejs/kit'

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

export function load() {
    return {}
}

/** @type {import('./$types').Actions} */
export const actions = {
    // Well, if the action name is incorrect, gonna get 500 error. That's very ambigious and time-wasting
    default: async ({ request }) => {
        const data = await request.formData()
        const username = data.get('username') as string
        const password = data.get('password') as string

        if (userDB.getUser(username) !== 'No user found') {
            const user = userDB.getUser(username) as userType
            if (user.password !== password) {
                return fail(422, {
                    error: 'Invalid password'
                })
            } else {
                // login successfully
                const isAdmin = user['is_admin'] === true ? 'admin' : 'not_admin'

                // using use:enhance in form so we can get this return value, we wont get this return without js (I think so?)
                return {
                    isCredentialValid: true,
                    username: username,
                    role: isAdmin
                }
            }
        } else {
            return fail(422, {
                error: 'Invalid username'
            })
        }
    }
}