import { html, NixComponent, useRouter, signal, transition } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { isLoggedIn, userRole, authStore } from "../../core/auth/auth.store";
import { showToast } from "./toast.component";

export class Navbar extends NixComponent {
    private isMenuOpen = signal(false);

    render(): NixTemplate {
        const router = useRouter();

        const NavLink = (path: string, label: string) => html`
            <a
                href=${path}
                class=${() =>
                `block md:inline-block px-3 py-2 rounded-md text-base md:text-sm font-medium transition-colors ${router.current.value === path
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
                }`
            }
                @click=${(e: Event) => {
                e.preventDefault();
                router.navigate(path);
                this.isMenuOpen.value = false;
            }}
            >${label}</a>
        `;

        return html`
            <nav class="bg-indigo-600 shadow-lg fixed md:relative w-full z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex items-center gap-2">
                            <a
                                href="/home"
                                class="text-white font-bold text-xl tracking-tight cursor-pointer hover:opacity-90 flex items-center gap-2"
                                @click=${(e: Event) => {
                                    e.preventDefault();
                                    router.navigate("/home");
                                    this.isMenuOpen.value = false;
                                }}
                            >
                                📚 <span class="hidden sm:inline">BiblioUniColombo</span><span class="sm:hidden">BUC</span>
                            </a>
                        </div>

                        <!-- Desktop menu -->
                        <div class="hidden md:flex items-center gap-1">
                            ${() => {
                                if (!isLoggedIn.value) {
                                    return NavLink("/login", "Iniciar Sesión");
                                }
                                const links = [
                                    NavLink("/home", "Catálogo"),
                                    NavLink("/my-loans", "Mis Préstamos"),
                                ];
                                if (userRole.value === "ADMIN") {
                                    links.push(NavLink("/admin", "Admin"));
                                }
                                return html`
                                    ${links}
                                    <span class="text-indigo-200 text-sm ml-3">
                                        ${() => authStore.user.value?.name ?? ""}
                                    </span>
                                    <span class="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-800 text-indigo-200">
                                        ${() => authStore.user.value?.role ?? ""}
                                    </span>
                                    <button
                                        class="ml-3 px-3 py-1.5 text-sm bg-indigo-800 text-indigo-100 rounded-md hover:bg-indigo-900 active:scale-95 transition-all cursor-pointer flex items-center"
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

                        <!-- Mobile menu button -->
                        <div class="flex md:hidden items-center">
                            <button
                                type="button"
                                class="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors cursor-pointer"
                                aria-expanded="false"
                                @click=${() => {
                                    this.isMenuOpen.value = !this.isMenuOpen.value;
                                }}
                            >
                                <span class="sr-only">Abrir menú principal</span>
                                ${() => this.isMenuOpen.value 
                                    ? html`<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>` 
                                    : html`<svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                      </svg>`
                                }
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile menu panel -->
                ${() => transition(this.isMenuOpen.value ? html`
                    <div class="md:hidden absolute top-full left-0 w-full bg-indigo-600 border-t border-indigo-500/30 shadow-lg overflow-hidden transform-gpu origin-top">
                        <div class="px-2 pt-2 pb-3 space-y-1">
                            ${() => {
                                if (!isLoggedIn.value) {
                                    return html`<div class="flex flex-col space-y-1">${NavLink("/login", "Iniciar Sesión")}</div>`;
                                }
                                const links = [
                                    NavLink("/home", "Catálogo"),
                                    NavLink("/my-loans", "Mis Préstamos"),
                                ];
                                if (userRole.value === "ADMIN") {
                                    links.push(NavLink("/admin", "Admin"));
                                }
                                return html`
                                    <div class="flex flex-col space-y-1">
                                        ${links}
                                    </div>
                                    <div class="pt-4 pb-2 border-t border-indigo-500/30 mt-2">
                                        <div class="flex items-center px-3">
                                            <div class="flex-shrink-0">
                                                <div class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                                    ${() => (authStore.user.value?.name?.[0] ?? "").toUpperCase()}
                                                </div>
                                            </div>
                                            <div class="ml-3">
                                                <div class="text-base font-medium leading-none text-white">${() => authStore.user.value?.name ?? ""}</div>
                                                <div class="text-sm font-medium leading-none text-indigo-200 mt-1">${() => authStore.user.value?.role ?? ""}</div>
                                            </div>
                                        </div>
                                        <div class="mt-3 px-2 space-y-1">
                                            <button
                                                class="w-full text-left px-3 py-2 flex items-center text-base font-medium rounded-md text-indigo-100 hover:text-white hover:bg-indigo-500 transition-colors cursor-pointer"
                                                @click=${() => {
                                                    authStore.logout();
                                                    this.isMenuOpen.value = false;
                                                    showToast("Sesión cerrada", "info");
                                                    router.navigate("/login");
                                                }}
                                            >
                                                🚪 Salir
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }}
                        </div>
                    </div>
                ` : html``, { name: "slide", appear: true, duration: 1000 })}
            </nav>
        `;
    }
}
