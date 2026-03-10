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

    return router;
}
