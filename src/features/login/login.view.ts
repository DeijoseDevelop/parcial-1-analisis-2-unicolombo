import { html, signal, useRouter, createForm, required, email as emailValidator } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { authRepository } from "../../data/repositories/auth.repository";
import { authStore } from "../../core/auth/auth.store";
import { showToast } from "../../shared/components/toast.component";

export function LoginView(): NixTemplate {
    const router = useRouter();
    const loading = signal(false);
    const errorMsg = signal("");

    const form = createForm({
        email: "",
        password: "",
    }, {
        validators: {
            email: [required("El correo es obligatorio"), emailValidator("Correo inválido")],
            password: [required("La contraseña es obligatoria")],
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        loading.value = true;
        errorMsg.value = "";
        try {
            const authUser = await authRepository.login({
                email: values.email,
                password: values.password,
            });
            authStore.setAuth(
                { id: authUser.id, name: authUser.name, email: authUser.email, role: authUser.role },
                authUser.token,
            );
            showToast(`¡Bienvenido, ${authUser.name}!`, "success");
            const pending = (await import("../../core/auth/auth.guard")).consumePendingRedirect();
            router.navigate(pending ?? "/home");
        } catch (err) {
            errorMsg.value = err instanceof Error ? err.message : "Error al iniciar sesión";
            showToast(errorMsg.value, "error");
        } finally {
            loading.value = false;
        }
    });

    return html`
        <div class="min-h-screen flex items-center justify-center login-bg px-4 relative overflow-hidden">
            <!-- Decorative Elements -->
            <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>

            <div class="w-full max-w-lg z-10 animate-fade-in-up">
                <div class="glass-effect rounded-3xl shadow-2xl p-8 md:p-12">
                    <div class="text-center mb-10">
                        <div class="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl shadow-lg mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                            <span class="text-4xl text-white">📚</span>
                        </div>
                        <h1 class="text-4xl font-black text-gray-900 tracking-tight">BiblioUniColombo</h1>
                        <p class="mt-3 text-gray-600 font-medium text-lg">Tu puerta al conocimiento infinito</p>
                    </div>

                    <form @submit=${onSubmit} class="space-y-6">
                        <div class="group">
                            <label class="block text-sm font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">
                                Correo Institucional
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    📧
                                </span>
                                <input
                                    type="email"
                                    class="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 shadow-sm"
                                    placeholder="usuario@unicolombo.edu.co"
                                    value=${() => form.fields.email.value.value}
                                    @input=${form.fields.email.onInput}
                                    @blur=${form.fields.email.onBlur}
                                />
                            </div>
                            ${() => {
                                const err = form.fields.email.error.value;
                                return err
                                    ? html`<p class="mt-1.5 text-xs font-semibold text-red-500 ml-1 animate-fade-in">${err}</p>`
                                    : html`<span></span>`;
                            }}
                        </div>

                        <div class="group">
                            <label class="block text-sm font-bold text-gray-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">
                                Contraseña
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    🔒
                                </span>
                                <input
                                    type="password"
                                    class="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 shadow-sm"
                                    placeholder="••••••••"
                                    value=${() => form.fields.password.value.value}
                                    @input=${form.fields.password.onInput}
                                    @blur=${form.fields.password.onBlur}
                                />
                            </div>
                            ${() => {
                                const err = form.fields.password.error.value;
                                return err
                                    ? html`<p class="mt-1.5 text-xs font-semibold text-red-500 ml-1 animate-fade-in">${err}</p>`
                                    : html`<span></span>`;
                            }}
                        </div>

                        ${() =>
                            errorMsg.value
                                ? html`
                                    <div class="p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl text-sm text-red-700 font-medium flex items-center gap-3 animate-fade-in">
                                        <span>⚠️</span> ${errorMsg.value}
                                    </div>
                                `
                                : html`<span></span>`
                        }

                        <button
                            type="submit"
                            class="relative w-full py-4 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group/btn"
                            disabled=${() => loading.value}
                        >
                            <span class="relative z-10 flex items-center justify-center gap-2">
                                ${() => (loading.value 
                                    ? html`<span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Cargando...` 
                                    : html`Entrar al Sistema <span class="group-hover/btn:translate-x-1 transition-transform">→</span>`
                                )}
                            </span>
                            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        </button>
                    </form>

                    <div class="mt-10 pt-8 border-t border-gray-200/50">
                        <p class="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4 text-center">Credenciales de Acceso</p>
                        <div class="grid grid-cols-1 gap-2">
                            <div class="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/20 hover:bg-white/60 transition-colors">
                                <div class="flex flex-col">
                                    <span class="text-xs font-bold text-gray-600">Estudiante</span>
                                    <span class="text-[10px] text-gray-400 font-medium">Contraseña: 123456</span>
                                </div>
                                <span class="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">carlos@unicolombo.edu.co</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/20 hover:bg-white/60 transition-colors">
                                <div class="flex flex-col">
                                    <span class="text-xs font-bold text-gray-600">Admin</span>
                                    <span class="text-[10px] text-gray-400 font-medium">Contraseña: admin123</span>
                                </div>
                                <span class="text-[10px] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded-full">admin@unicolombo.edu.co</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p class="mt-8 text-center text-white/60 text-sm font-medium">
                    © 2026 BiblioUniColombo — Sistema de Gestión Bibliotecaria
                </p>
            </div>
        </div>
    `;
}
