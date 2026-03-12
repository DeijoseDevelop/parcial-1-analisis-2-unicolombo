import type { AuthRepository } from "./repository.interface";
import type { AuthUser, LoginCredentials } from "../../shared/types/models";
import { httpClient } from "../../core/http/http.client";

export const authRepository: AuthRepository = {
    async login(credentials: LoginCredentials): Promise<AuthUser> {
        const res = await httpClient.post("/login", credentials);
        const token: string = res.data.token;
        const user = res.data.user as Omit<AuthUser, "token">;
        return { ...user, token };
    },
};
