import type { AuthRepository } from "./repository.interface";
import type { AuthUser, LoginCredentials } from "../../shared/types/models";
import { MOCK_USERS } from "../mock/users.mock";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authRepository: AuthRepository = {
    async login(credentials: LoginCredentials): Promise<AuthUser> {
        await delay(600);
        const user = MOCK_USERS.find(
            u => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        // Return user without password but with a fake token
        const { password, ...userData } = user;
        return {
            ...userData,
            token: `mock-token-${userData.id}-${Date.now()}`
        };
    },
};
