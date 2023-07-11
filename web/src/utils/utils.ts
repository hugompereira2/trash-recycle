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

export const validateCnpj = (cnpj: string) => {
    const cleanedCnpj = cnpj.replace(/[^\d]+/g, '');

    if (cleanedCnpj.length !== 14) {
        return false;
    }

    if (/^(\d)\1+$/.test(cleanedCnpj)) {
        return false;
    }

    let sum = 0;
    let factor = 5;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanedCnpj.charAt(i)) * factor;
        factor = factor === 2 ? 9 : factor - 1;
    }
    let remainder = sum % 11;
    let digit = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cleanedCnpj.charAt(12)) !== digit) {
        return false;
    }

    sum = 0;
    factor = 6;
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cleanedCnpj.charAt(i)) * factor;
        factor = factor === 2 ? 9 : factor - 1;
    }
    remainder = sum % 11;
    digit = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cleanedCnpj.charAt(13)) !== digit) {
        return false;
    }

    return true;
};

export const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}

export const formatCnpj = (cnpj: string) => {
    const numericCnpj = cnpj.replace(/\D/g, "");
  
    let formattedCnpj = numericCnpj;
    if (numericCnpj.length > 2) {
      formattedCnpj = `${numericCnpj.substring(0, 2)}.${numericCnpj.substring(2)}`;
    }
    if (numericCnpj.length > 5) {
      formattedCnpj = `${formattedCnpj.substring(0, 6)}.${formattedCnpj.substring(6)}`;
    }
    if (numericCnpj.length > 8) {
      formattedCnpj = `${formattedCnpj.substring(0, 10)}/${formattedCnpj.substring(10)}`;
    }
    if (numericCnpj.length > 12) {
      formattedCnpj = `${formattedCnpj.substring(0, 15)}-${formattedCnpj.substring(15)}`;
    }
  
    return formattedCnpj;
};

export const formatPhoneNumber = (phoneNumber: string) => {
    const numericPhone = phoneNumber.replace(/\D/g, "");

    let formattedPhone = numericPhone;
    if (numericPhone.length === 2) {
        formattedPhone = `(${numericPhone.substring(0, 2)}) ${numericPhone.substring(2)}`;
    }
    if (numericPhone.length === 6) {
        formattedPhone = `${formattedPhone.substring(0, 9)}-${formattedPhone.substring(9)}`;
    }
    if (numericPhone.length === 11) {
        formattedPhone = `(${numericPhone.substring(0, 2)}) ${numericPhone.substring(2, 7)}-${numericPhone.substring(7)}`;
    } else if (numericPhone.length === 10) {
        formattedPhone = `(${numericPhone.substring(0, 2)}) ${numericPhone.substring(2, 6)}-${numericPhone.substring(6)}`;
    }

    return formattedPhone;
};

export const formatCPF = (cpf: string) => {
    const numericCPF = cpf.replace(/\D/g, "");
  
    let formattedCPF = numericCPF;
    if (numericCPF.length > 3) {
      formattedCPF = `${numericCPF.substring(0, 3)}.${numericCPF.substring(3)}`;
    }
    if (numericCPF.length > 6) {
      formattedCPF = `${formattedCPF.substring(0, 7)}.${formattedCPF.substring(7)}`;
    }
    if (numericCPF.length > 9) {
      formattedCPF = `${formattedCPF.substring(0, 11)}-${formattedCPF.substring(11, 13)}`;
    }
  
    return formattedCPF;
};
  
  