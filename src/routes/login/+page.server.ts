import type { Actions } from './$types'

import db from '$lib/database/database'

export const actions: Actions = {
    login: async ({ request }) => {
        const data = await request.formData()
        const username = data.get('username')
        const password = data.get('password')

        console.log({ username, password })
    }
}
