export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  is_active?: boolean;
  role?: userRole;
}

export enum userRole {
  Admin = "admin",
  User = "user",
  Agent = "agent",
  Moderator = "moderator",
}
