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
                `block md:inline-block px-4 py-2 rounded-xl text-base md:text-sm font-black uppercase tracking-widest transition-all ${router.current.value === path
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-white"
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
            <nav class="fixed top-0 left-0 w-full z-[100] transition-all duration-300 px-4 py-4">
                <div class="max-w-7xl mx-auto">
                    <div class="glass-effect rounded-2xl md:rounded-3xl shadow-lg border border-white/50 px-6 h-16 md:h-20 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <a
                                href="/home"
                                class="flex items-center gap-3 group px-2 py-1 rounded-xl transition-all"
                                @click=${(e: Event) => {
                                    e.preventDefault();
                                    router.navigate("/home");
                                    this.isMenuOpen.value = false;
                                }}
                            >
                                <span class="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">📚</span>
                                <div class="flex flex-col">
                                    <span class="text-gray-900 font-black text-sm tracking-tighter leading-none">BiblioUni</span>
                                    <span class="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">Colombo</span>
                                </div>
                            </a>
                        </div>

                        <!-- Desktop menu -->
                        <div class="hidden md:flex items-center gap-1">
                            ${() => {
                                if (!isLoggedIn.value) {
                                    return html`
                                        ${NavLink("/home", "Catálogo")}
                                        ${NavLink("/login", "Login")}
                                    `;
                                }
                                const links = [
                                    NavLink("/home", "Catálogo"),
                                    NavLink("/my-loans", "Mis Libros"),
                                ];
                                if (userRole.value === "ADMIN") {
                                    links.push(NavLink("/admin", "Admin"));
                                }
                                return html`
                                    <div class="flex items-center gap-1">
                                        ${links}
                                    </div>
                                    <div class="h-8 w-px bg-gray-200 mx-4"></div>
                                    <div class="flex items-center gap-3 pr-2">
                                        <div class="text-right hidden xl:block">
                                            <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">${() => authStore.user.value?.role ?? ""}</div>
                                            <div class="text-sm font-bold text-gray-900 leading-tight">${() => authStore.user.value?.name ?? ""}</div>
                                        </div>
                                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black shadow-md border border-white/20">
                                            ${() => (authStore.user.value?.name?.[0] ?? "U").toUpperCase()}
                                        </div>
                                        <button
                                            class="ml-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer group"
                                            title="Cerrar Sesión"
                                            @click=${() => {
                                                authStore.logout();
                                                showToast("Sesión cerrada", "info");
                                                router.navigate("/login");
                                            }}
                                        >
                                            <span class="text-xl group-hover:scale-110 inline-block transition-transform">🚪</span>
                                        </button>
                                    </div>
                                `;
                            }}
                        </div>

                        <!-- Mobile menu button -->
                        <div class="flex md:hidden items-center">
                            <button
                                type="button"
                                class="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-white transition-all cursor-pointer border border-transparent hover:border-gray-100 shadow-sm"
                                @click=${() => {
                                    this.isMenuOpen.value = !this.isMenuOpen.value;
                                }}
                            >
                                ${() => this.isMenuOpen.value 
                                    ? html`<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>` 
                                    : html`<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`
                                }
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile menu panel -->
                ${() => transition(this.isMenuOpen.value ? html`
                    <div class="md:hidden mt-2 animate-fade-in-up">
                        <div class="glass-effect rounded-2xl shadow-xl border border-white/50 p-4 space-y-2">
                            ${() => {
                                if (!isLoggedIn.value) {
                                    return html`
                                        ${NavLink("/home", "Catálogo")}
                                        ${NavLink("/login", "Iniciar Sesión")}
                                    `;
                                }
                                const links = [
                                    NavLink("/home", "Catálogo"),
                                    NavLink("/my-loans", "Mis Préstamos"),
                                ];
                                if (userRole.value === "ADMIN") {
                                    links.push(NavLink("/admin", "Admin"));
                                }
                                return html`
                                    <div class="flex flex-col gap-2">
                                        ${links}
                                    </div>
                                    <div class="border-t border-gray-100 my-4 pt-4 flex items-center justify-between px-2">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md">
                                                ${() => (authStore.user.value?.name?.[0] ?? "U").toUpperCase()}
                                            </div>
                                            <div>
                                                <div class="text-sm font-bold text-gray-900 leading-none">${() => authStore.user.value?.name ?? ""}</div>
                                                <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">${() => authStore.user.value?.role ?? ""}</div>
                                            </div>
                                        </div>
                                        <button
                                            class="p-2 text-red-500 bg-red-50 rounded-xl transition-all cursor-pointer"
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
                                `;
                            }}
                        </div>
                    </div>
                ` : html``, { name: "slide", appear: true, duration: 200 })}
            </nav>
        `;
    }
}
