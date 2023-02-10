import axios from "axios";

interface RegisterUser {
    address: {
        district: string
        cep: string
        city: string
        state: string
        street: string
        street_number?: string
    };
    cnpj_cpf: string;
    email: string;
    name: string;
    userType_id: string;
    whatsapp: string;
}

interface LoginUser {
    email: string;
    password: string;
}

interface UpdateUser {
    name: string;
    cnpj_cpf: string;
    email: string;
    whatsapp: string;
    userType_id: string;
}

const api = axios.create({
    baseURL: 'http://localhost:3333',
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json'
        //'Authorization': 'token <your-token-here> -- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token'
    }
});

export const registerUser = async (payload: RegisterUser) => {
    const response = await api.post(`register`, payload);
    return response.data;
}

export const login = async (payload: LoginUser) => {
    const response = await api.post(`login`, payload);
    return response.data;
}

export const updateUser = async (payload: UpdateUser) => {
    const response = await api.post(`update`, payload);
    return response.data;
}