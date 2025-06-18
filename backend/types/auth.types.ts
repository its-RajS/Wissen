//?Login
export interface ILoginRequest {
  email: string;
  password: string;
}

//?JWT
export interface IToken {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}
