import api from "./config";
import type { LoginFormData, RegisterFormData, User } from "../types";

export const registerUser = async (formData: RegisterFormData) => {
    try {
        const { data } = await api.post<string>('/auth/register', formData)
        return data
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al registrar el usuario')
    }
}

export const loginUser = async (formData: LoginFormData) => {
    try {
        const { data } = await api.post<{ token: string; user: User }>('/auth/login', formData)
        localStorage.setItem('AUTH_TOKEN', data.token)
        localStorage.setItem('USER', JSON.stringify(data.user))
        return data
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al iniciar sesión')
    }
}

export const getUser = async () => {
    try {
        const stored = localStorage.getItem('USER')
        if (stored) {
            return JSON.parse(stored) as User
        }
        const { data } = await api.get<User>('/auth/user')
        localStorage.setItem('USER', JSON.stringify(data))
        return data
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al obtener el usuario')
    }
}