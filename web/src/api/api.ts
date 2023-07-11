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

interface CepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    unidade: string;
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

interface Solicitation {
    client_user_id: string;
    company_user_id: string;
    materials: {
        id: string;
        amount: string;
    }[];
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
    try {
        const response = await api.post(`update`, payload);
        return response;
    } catch (err: any) {
        return err
    }
}

export const createSolicitation = async (payload: Solicitation) => {
    try {
        const response = await api.post(`createSolicitation`, payload);
        return response;
    } catch (err: any) {
        return err
    }
}

export const findMaterials = async () => {
    try {
        const response = await api.get(`findAllMaterials`);
        return response;
    } catch (err: any) {
        return err
    }
}

export const changeStatusSolicitation = async (solicitationId: string, status: boolean) => {
    try {
        const response = await api.patch(`changeStatusSolicitation/${solicitationId}`, status);
        return response;
    } catch (err: any) {
        return err
    }
}

export const finalizeSolicitation = async (solicitationId: string) => {
    try {
        const response = await api.patch(`finalizeSolicitation/${solicitationId}`);
        return response;
    } catch (err: any) {
        return err
    }
}

export const findCompanyByMaterial = async (material: string) => {
    try {
        const response = await api.get(`findByMaterial?materials=${encodeURIComponent(material)}`);
        return response;
    } catch (err: any) {
        return err
    }
}

export const findSolicitations = async (id: string) => {
    try {
        const response = await api.get(`findAllSolicitations/${encodeURIComponent(id)}`);
        return response;
    } catch (err: any) {
        return err
    }
}

export const validateEmail = async (email: string) => {
    try {
        const response = await api.get<boolean>(`validateEmail/${email}`);
        return response;
    } catch (err: any) {
        return err
    }
}

export const validateCnpj = async (cnpj: string) => {
    try {
        const response = await api.get<boolean>(`validateCnpj/${cnpj}`);
        return response;
    } catch (err: any) {
        return err
    }
}

export const validateCpf = async (cpf: string) => {
    try {
        const response = await api.get<boolean>(`validateCpf/${cpf}`);
        return response;
    } catch (err: any) {
        return err
    }
}

export const findCep = async (cep: string) => {
    try {
        const response = await axios.get<CepResponse>(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`);
        return response;
    } catch (err: any) {
        return err
    }
}
