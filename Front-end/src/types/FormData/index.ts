export type FormData = {
  email: string;
  password: string;
};

export type FormDataSignUp = {
  email: string;
  password: string;
  confirmPassword: string;
};
export type FormChangePassword = {
  password: string;
  newPassword:string;
  newPasswordConfirm: string;
}
