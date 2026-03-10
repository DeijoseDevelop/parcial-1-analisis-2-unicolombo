import { createStore, signal, computed } from "@deijose/nix-js";
import type { User, Role } from "../../shared/types/models";

const storedUser = localStorage.getItem("biblio_user");
const storedToken = localStorage.getItem("biblio_token");

const initialUser: User | null = storedUser ? JSON.parse(storedUser) : null;
const initialToken: string = storedToken ?? "";

export const authStore = createStore(
    {
        token: initialToken,
        user: initialUser as User | null,
    },
    (s) => ({
        setAuth(user: User, token: string) {
            s.user.value = user;
            s.token.value = token;
            localStorage.setItem("biblio_user", JSON.stringify(user));
            localStorage.setItem("biblio_token", token);
        },
        logout() {
            s.user.value = null;
            s.token.value = "";
            localStorage.removeItem("biblio_user");
            localStorage.removeItem("biblio_token");
        },
    }),
);

export const isLoggedIn = computed(() => !!authStore.token.value);
export const userRole = computed<Role | null>(() => authStore.user.value?.role ?? null);
export const userId = computed<number | null>(() => authStore.user.value?.id ?? null);

// Re-export a single signal for refresh triggers
export const authRefresh = signal(0);
