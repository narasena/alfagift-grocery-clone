export interface IAuthStore {
  _token: string | null;
  _email: string | null;
  _id: string | null;
}

export interface IAuthState {
  token: string | null;
  email: string | null;
  id: string | null;
  setAuth: ({ _token, _email, _id }: IAuthStore) => void;
}
