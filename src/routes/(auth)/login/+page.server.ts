import type { Actions, PageServerLoad } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import db from '$lib/server/database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_ACCESS_EXPIRES_IN, JWT_ACCESS_SECRET } from '$env/static/private'

export const load: PageServerLoad = ({ locals }) => {
    if (locals.user) {
        throw redirect(302, '/')
    }
}

export const actions: Actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData()
        const username = String(data.get('username'))
        const password = String(data.get('password'))

        if (!credentialsInRightFormat(username, password)) {
            return fail(400, { invalid: true })
        }

        const loginResult = await loginUser(username, password)

        if (loginResult?.error) {
            return fail(401, loginResult.error)
        }

        const jwtToken = loginResult.token

        cookies.set('AuthorizationToken', `Bearer ${jwtToken}`, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production', // secure: true if running in production
            maxAge: 60 * 60 * 24
        })

        throw redirect(302, '/')
    }
}

function credentialsInRightFormat(username: string, password: string) {
    if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        !username ||
        !password
    ) {
        return false
    }
    return true
}

async function loginUser(username: string, password: string) {
    const user = await db.user.findUnique({
        where: { username }
    })

    if (!user) {
        return { error: { credentialsError: true } }
    }

    const passwordIsValid = await bcrypt.compare(password, user.password) ? true : false

    if (!passwordIsValid) {
        return { error: { credentialsError: true } }
    }

    const jwtUser = {
        id: user.id,
        username: user.username
    }

    const token = jwt.sign(jwtUser, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES_IN
    })

    return { token }
}