import {$authHost, $host} from './index'
import {jwtDecode, JwtDecodeOptions} from "jwt-decode"


export const registration = async (email, password) => {
    const {data} = await $host.post('api/user/registration', {email, password, role: 'ADMIN'})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token, {header: true})
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token, {header: true})
}

export const check = async () => {
    try {
        const { data } = await $authHost.get('api/user/auth')

        if (!data || !data.token) {
            throw new Error('No token received')
        }
        localStorage.setItem('token', data.token)

        const decoded = jwtDecode(data.token)
        return decoded
    } catch (error) {
        console.error('Auth check failed: ', error.response?.data || error.message)
        return null
    }
}

export const changePassword = async (email, currentPassword, newPassword) => {
    const { data } = await $authHost.put('api/user/change-password', {
        email: String(email),
        currentPassword: String(currentPassword),
        newPassword: String(newPassword),
    })
    return data
}

export const updateProfile = async (userId, data) => {
    const { data: response } = await $authHost.put('api/user/update-profile', {
        userId,
        ...data,
    })
    return response
}