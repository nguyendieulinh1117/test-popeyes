export type RegisterRequest = {
    body: RegisterRequestBody;
    onSuccess: (response?: any) => void;
    onError: (error?: any) => void;
}
export type LoginRequest = {
    body: LoginRequestBody;
    onSuccess: (response?: any) => void;
    onError: (error?: any) => void;
}

export type RegisterRequestBody = {
    phone: string;
    username: string;
    email: string;
    password: string;
    refreshToken: string;
    grantType: string;
}

export type LoginRequestBody = {
    account: string;
    password: string;
}