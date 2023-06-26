import { JWT_ACCESS_SECRET } from '$env/static/private'
import type { Handle } from '@sveltejs/kit'

import jwt from 'jsonwebtoken'
import db from '$lib/server/database'

export const handle: Handle = async ({ event, resolve }) => {
    const authorizationToken = event.cookies.get('AuthorizationToken')

    if (authorizationToken) {
        // Get JWT token, the default format is: `Bearer ${jwtToken}`
        const jwtToken = authorizationToken.split(' ')[1]

        try {
            const jwtUser = jwt.verify(jwtToken, JWT_ACCESS_SECRET)

            if (typeof jwtUser === 'string') {
                throw new Error('Invalid JWT payload. Expected object type!')
            }

            const user = await db.user.findUnique({
                where: { id: jwtUser.id },
                select: { username: true, isAdmin: true }
            })

            if (!user) {
                throw new Error('User not found!')
            }

            event.locals.user = {
                name: user.username,
                isAdmin: user.isAdmin
            }
        } catch (error) {
            console.error(error)
        }
    }

    return await resolve(event)
}