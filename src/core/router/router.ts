import { createRouter } from "@deijose/nix-js";
import type { Router } from "@deijose/nix-js";
import { authGuard, adminGuard } from "../auth/auth.guard";
import { LoginView } from "../../features/login/login.view";
import { HomeView } from "../../features/home/home.view";
import { BookDetailView } from "../../features/book-detail/book-detail.view";
import { MyLoansView } from "../../features/my-loans/my-loans.view";
import { AdminView } from "../../features/admin/admin.view";

export function setupRouter(): Router {
    const router = createRouter([
        {
            path: "/login",
            component: () => LoginView(),
        },
        {
            path: "/home",
            component: () => HomeView(),
        },
        {
            path: "/book/:id",
            component: () => BookDetailView(),
        },
        {
            path: "/my-loans",
            component: () => MyLoansView(),
        },
        {
            path: "/admin",
            component: () => AdminView(),
            beforeEnter: adminGuard,
        },
        {
            path: "*",
            component: () => HomeView(),
        },
    ]);

    router.beforeEach(authGuard);

    // Ejecutar el guard manualmente en la carga inicial
    // (el router no ejecuta guards en el primer render)
    const initial = window.location.pathname || "/";
    const result = authGuard(initial, initial);
    if (typeof result === "string" && result !== initial) {
        router.navigate(result);
    } else if (result === undefined && initial === "/admin") {
        // Verificar también el adminGuard en carga directa
        const adminResult = adminGuard(initial, initial);
        if (typeof adminResult === "string") {
            router.navigate(adminResult);
        }
    }

    return router;
}
