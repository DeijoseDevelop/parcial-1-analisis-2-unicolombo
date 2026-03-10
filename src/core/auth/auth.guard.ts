import type { NavigationGuard } from "@deijose/nix-js";
import { isLoggedIn, userRole } from "./auth.store";

/** Ruta a la que redirigir después del login (set desde book-detail, etc.) */
let _pendingRedirect: string | null = null;

export function setPendingRedirect(path: string) {
    _pendingRedirect = path;
}

export function consumePendingRedirect(): string | null {
    const r = _pendingRedirect;
    _pendingRedirect = null;
    return r;
}

/**
 * Rutas que NO requieren autenticación.
 * El catálogo y el detalle de libro son públicos.
 */
function isPublicRoute(path: string): boolean {
    return (
        path === "/login" ||
        path === "/home" ||
        path === "/" ||
        path.startsWith("/book/")
    );
}

export const authGuard: NavigationGuard = (to, _from) => {
    if (isPublicRoute(to)) {
        if (to === "/login" && isLoggedIn.value) return "/home";
        if (to === "/") return "/home";
        return;
    }
    if (!isLoggedIn.value) {
        setPendingRedirect(to);
        return "/login";
    }
};

export const adminGuard: NavigationGuard = (_to, _from) => {
    if (!isLoggedIn.value) return "/login";
    if (userRole.value !== "ADMIN") return "/home";
};
