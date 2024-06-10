export default function userEntity(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  userName: string,
  imageUrl:string
) {
  return {
    getFirstName: (): string => firstName,
    getLastName: (): string => lastName,
    getUserName: (): string => userName,
    getEmail: (): string => email,
    getPhone: (): number => parseInt(phone),
    getPassword: (): string => password,
    getImageUrl:():string=>imageUrl
  };
}




export type UserEntityType = ReturnType<typeof userEntity>;
