interface UserProps {
    id: string;
    name: string;
    userType_id: string;
    cnpj_cpf: string;
    email: string;
    phone: string;
    created_at: string;
}

export const getLocalStorageUser = () => {
    const user = window.localStorage.getItem("user");

    if (user) {
        const userLocal: UserProps = JSON.parse(user)
        return userLocal;
    }

    return null;
}

export const dateFormatted = (data: string) => {
    const dataObj = new Date(data);
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear().toString();

    return `${dia}/${mes}/${ano}`;
}