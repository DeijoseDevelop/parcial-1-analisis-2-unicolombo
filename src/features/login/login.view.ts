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
        <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
            <div class="w-full max-w-md">
                <div class="bg-white rounded-2xl shadow-xl p-8">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-900">📚 BiblioUniColombo</h1>
                        <p class="mt-2 text-gray-500">Inicia sesión para acceder al sistema</p>
                    </div>

                    <form @submit=${onSubmit} class="space-y-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                            <input
                                type="email"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                placeholder="correo@unicolombo.edu.co"
                                value=${() => form.fields.email.value.value}
                                @input=${form.fields.email.onInput}
                                @blur=${form.fields.email.onBlur}
                            />
                            ${() => {
            const err = form.fields.email.error.value;
            return err
                ? html`<p class="mt-1 text-sm text-red-500">${err}</p>`
                : html`<span></span>`;
        }}
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                placeholder="••••••••"
                                value=${() => form.fields.password.value.value}
                                @input=${form.fields.password.onInput}
                                @blur=${form.fields.password.onBlur}
                            />
                            ${() => {
            const err = form.fields.password.error.value;
            return err
                ? html`<p class="mt-1 text-sm text-red-500">${err}</p>`
                : html`<span></span>`;
        }}
                        </div>

                        ${() =>
            errorMsg.value
                ? html`<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">${errorMsg.value}</div>`
                : html`<span></span>`
        }

                        <button
                            type="submit"
                            class="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled=${() => loading.value}
                        >
                            ${() => (loading.value ? "Ingresando..." : "Iniciar Sesión")}
                        </button>
                    </form>

                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p class="text-xs font-semibold text-gray-500 mb-2">Usuarios de prueba:</p>
                        <div class="space-y-1 text-xs text-gray-600">
                            <p><span class="font-medium">Estudiante:</span> carlos@unicolombo.edu.co / 123456</p>
                            <p><span class="font-medium">Docente:</span> maria@unicolombo.edu.co / 123456</p>
                            <p><span class="font-medium">Admin:</span> admin@unicolombo.edu.co / admin123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
