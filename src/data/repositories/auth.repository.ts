import type { AuthRepository } from "./repository.interface";
import type { AuthUser, LoginCredentials } from "../../shared/types/models";
import { MOCK_USERS } from "../mock/users.mock";
import { delay } from "../../shared/utils/delay";

export const authRepository: AuthRepository = {
    async login(credentials: LoginCredentials): Promise<AuthUser> {
        await delay(null, 600);
        const user = MOCK_USERS.find(
            (u) => u.email === credentials.email && u.password === credentials.password,
        );
        if (!user) {
            throw new Error("Credenciales inválidas");
        }
        const { password: _, ...userData } = user;
        return {
            ...userData,
            token: `mock-jwt-${userData.id}-${Date.now()}`,
        };
    },
};
