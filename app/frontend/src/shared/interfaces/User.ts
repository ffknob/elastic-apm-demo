export default interface User {
  _id: string;
  email: string;
  name: string;
  token?: string;
  tokenExpirationDate?: Date;
  image?: string;
}
