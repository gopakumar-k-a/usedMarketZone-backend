
export default function userEntity(firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string) {

    return {
        getFirstName: (): string => firstName,
        getLastName: (): string => lastName,
        getEmail: (): string => email,
        getPhone: (): number => parseInt(phone),
        getPassword: (): string => password
    }

}

export type UserEntityType = ReturnType<typeof userEntity>