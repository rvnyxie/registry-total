import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'

import db from '$lib/server/database'

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login')
    } else {
        const username = locals.user.name

        const user = await db.user.findUnique({
            where: { username },
            select: {
                username: true,
                isAdmin: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                inspectionStation: {
                    select: {
                        id: true,
                        stationName: true
                    }
                }
            }
        })

        return { user }
    }


}

export const actions: Actions = {
    logout: async ({ cookies }) => {
        cookies.delete('AuthorizationToken')
        throw redirect(302, '/login')
    }
}