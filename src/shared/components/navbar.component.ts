import { html, NixComponent, useRouter } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { isLoggedIn, userRole, authStore } from "../../core/auth/auth.store";
import { showToast } from "./toast.component";

export class Navbar extends NixComponent {
    render(): NixTemplate {
        const router = useRouter();

        const navLink = (path: string, label: string) => html`
            <a
                href=${path}
                class=${() =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${router.current.value === path
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
                }`
            }
                @click=${(e: Event) => {
                e.preventDefault();
                router.navigate(path);
            }}
            >${label}</a>
        `;

        return html`
            <nav class="bg-indigo-600 shadow-lg">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex items-center gap-2">
                            <a
                                href="/home"
                                class="text-white font-bold text-xl tracking-tight cursor-pointer hover:opacity-90"
                                @click=${(e: Event) => {
                                    e.preventDefault();
                                    router.navigate("/home");
                                }}
                            >
                                📚 BiblioUniColombo
                            </a>
                        </div>

                        <div class="flex items-center gap-1">
                            ${() => {
                                if (!isLoggedIn.value) {
                                    return navLink("/login", "Iniciar Sesión");
                                }
                                const links = [
                                    navLink("/home", "Catálogo"),
                                    navLink("/my-loans", "Mis Préstamos"),
                                ];
                                if (userRole.value === "ADMIN") {
                                    links.push(navLink("/admin", "Admin"));
                                }
                                return html`
                                    ${links}
                                    <span class="text-indigo-200 text-sm ml-3 hidden sm:inline">
                                        ${() => authStore.user.value?.name ?? ""}
                                    </span>
                                    <span class="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-800 text-indigo-200 hidden sm:inline">
                                        ${() => authStore.user.value?.role ?? ""}
                                    </span>
                                    <button
                                        class="ml-3 px-3 py-1.5 text-sm bg-indigo-800 text-indigo-100 rounded-md hover:bg-indigo-900 active:scale-95 transition-all cursor-pointer"
                                        @click=${() => {
                                            authStore.logout();
                                            showToast("Sesión cerrada", "info");
                                            router.navigate("/login");
                                        }}
                                    >
                                        🚪 Salir
                                    </button>
                                `;
                            }}
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }
}
