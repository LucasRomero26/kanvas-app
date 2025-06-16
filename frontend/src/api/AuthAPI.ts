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
        const { data } = await api.post<{token: string}>('/auth/login', formData)
        localStorage.setItem('AUTH_TOKEN', data.token)
        return data
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al iniciar sesión')
    }
}

export const getUser = async () => {
    try {
        const { data } = await api.get<User>('/auth/user'); // Suponiendo que tienes un endpoint /auth/user
        return data
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al obtener el usuario')
    }
}