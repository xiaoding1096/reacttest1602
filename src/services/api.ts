import { url } from "inspector"
import axios from "services/axios.customize"

export const loginApi = (email: string, password: string) => {
    const urlBackend = '/api/v1/auth/login'
    const data = {
        username: email,
        password: password,
    }
    return axios.post<IBackendRes<ILogin>>(urlBackend, data)
}

export const registerApi = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = '/api/v1/user/register'
    const data = {
        fullName: email,
        email: email,
        password: password,
        phone: phone
    }
    return axios.post<IBackendRes<IRegister>>(urlBackend, data)
}

export const fetchAccountAPI = () => {
    const urlBackend = `/api/v1/auth/account`
    return axios.get<IBackendRes<IFetch>>(urlBackend, {
        headers: {
            delay: 1000
        }
    })
}

export const logoutApi = () => {
    const urlBackend = `/api/v1/auth/logout`
    return axios.post<IBackendRes<ILogin>>(urlBackend)
}

export const getUsersAPI = (query : string) => {
    const urlBackend = `/api/v1/user?${query}`
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}

export const createUserApi = (fullName: string,password: string, email: string, phone: string ) => {
    const urlBackend = `/api/v1/user`
    return axios.post<IBackendRes<IUserTable>>(urlBackend, {fullName, password, email, phone})
}

export const bulkCreateUserAPI = (dataSubmit : {
    fullName: string,
    password: string,
    email: string,
    phone: string,
}[]) => {
    const urlBackend = '/api/v1/user/bulk-create'
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, dataSubmit)
}

export const updateUserApi = (_id: string, fullName: string, phone: string) => {
    const urlBackend = `/api/v1/user`
    return axios.put<IBackendRes<IRegister>>(urlBackend,{_id, fullName, phone} )
}

export const deleteUserApi = (id: string) => {
    const urlBackend = `/api/v1/user/${id}`
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}