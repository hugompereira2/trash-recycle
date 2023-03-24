import { createContext } from "react";

interface Address {
  cep: string
  city: string
  state: string
  district: string
  street: string
  street_number: string
  location: [number, number]
}

type UserType = {
  name: string
  cnpj_cpf: string
  email: string
  password_hash?: string,
  userType_id: string
  address_id?: null | string
  phone: string
  address?: null | Address
  materialUser: { material_id: string }[]
}

interface UserContextType {
  user: UserType;
  setUser: (newValue: UserType | {}) => void;
}

export const userContext = createContext<UserContextType>({
  user: {} as UserType,
  setUser: () => { }
});

export default userContext;
