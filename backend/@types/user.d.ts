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

//? Type to upadate user info
export interface IUpdateUserInfo {
  name: string;
  email: string;
}

export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateAvatar {
  avatar: string;
}
