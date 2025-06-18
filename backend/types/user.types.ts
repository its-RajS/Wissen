//?Types of registered user
export interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

//? Type for the activaion token
export interface IActivationToken {
  token: string;
  activateCode: string;
}

//? Type for the activaion token
export interface IActivationRequest {
  activationToken: string;
  activationCode: string;
}
