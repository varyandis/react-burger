export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type TUser = {
  email: string;
  name: string;
};

export type TAuthRequest = {
  email: string;
  password: string;
};

export type TRegisterUserRequest = TAuthRequest & {
  name: string;
};

export type TUpdateUserRequest = {
  email: string;
  name: string;
  password: string;
};

export type TForgotPasswordRequest = {
  email: string;
};

export type TResetPasswordRequest = {
  password: string;
  token: string;
};

export type TSuccessResponse = {
  success: boolean;
  message: string;
};

export type TTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TAuthResponse = TTokenResponse & {
  user: TUser;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};
