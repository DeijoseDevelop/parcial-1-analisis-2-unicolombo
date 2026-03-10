import { html, signal, createForm, required } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { bookRepository } from "../../data/repositories/book.repository";
import { showToast } from "../../shared/components/toast.component";

export function BookFormComponent(onCreated: () => void): NixTemplate {
    const loading = signal(false);

    const form = createForm({
        title: "",
        author: "",
        publisher: "",
        stock: "",
        synopsis: "",
    }, {
        validators: {
            title: [required("El título es obligatorio")],
            author: [required("El autor es obligatorio")],
            publisher: [required("La editorial es obligatoria")],
            stock: [
                required("El stock es obligatorio"),
                (v: string) => {
                    const n = Number(v);
                    return Number.isInteger(n) && n >= 0
                        ? null
                        : "Debe ser un número entero ≥ 0";
                },
            ],
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        loading.value = true;
        try {
            await bookRepository.create({
                title: values.title,
                author: values.author,
                publisher: values.publisher,
                stock: Number(values.stock) || 0,
                synopsis: values.synopsis || undefined,
            });
            showToast("Libro creado exitosamente", "success");
            form.reset();
            onCreated();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Error al crear libro", "error");
        } finally {
            loading.value = false;
        }
    });

    const INPUT_CLASS = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-sm";

    return html`
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Agregar Nuevo Libro</h2>
            <form @submit=${onSubmit} class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input type="text" class=${INPUT_CLASS} placeholder="Título del libro"
                            value=${() => form.fields.title.value.value}
                            @input=${form.fields.title.onInput}
                            @blur=${form.fields.title.onBlur}
                        />
                        ${() => {
                            const err = form.fields.title.error.value;
                            return err ? html`<p class="mt-1 text-xs text-red-500">${err}</p>` : html`<span></span>`;
                        }}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                        <input type="text" class=${INPUT_CLASS} placeholder="Nombre del autor"
                            value=${() => form.fields.author.value.value}
                            @input=${form.fields.author.onInput}
                            @blur=${form.fields.author.onBlur}
                        />
                        ${() => {
                            const err = form.fields.author.error.value;
                            return err ? html`<p class="mt-1 text-xs text-red-500">${err}</p>` : html`<span></span>`;
                        }}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Editorial</label>
                        <input type="text" class=${INPUT_CLASS} placeholder="Casa editorial"
                            value=${() => form.fields.publisher.value.value}
                            @input=${form.fields.publisher.onInput}
                            @blur=${form.fields.publisher.onBlur}
                        />
                        ${() => {
                            const err = form.fields.publisher.error.value;
                            return err ? html`<p class="mt-1 text-xs text-red-500">${err}</p>` : html`<span></span>`;
                        }}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input type="number" class=${INPUT_CLASS} placeholder="Cantidad" min="0"
                            value=${() => form.fields.stock.value.value}
                            @input=${form.fields.stock.onInput}
                            @blur=${form.fields.stock.onBlur}
                        />
                        ${() => {
                            const err = form.fields.stock.error.value;
                            return err ? html`<p class="mt-1 text-xs text-red-500">${err}</p>` : html`<span></span>`;
                        }}
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sinopsis (opcional)</label>
                    <textarea class=${`${INPUT_CLASS} h-20 resize-none`} placeholder="Breve descripción del libro..."
                        @input=${form.fields.synopsis.onInput}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    class="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 hover:shadow-lg active:scale-95 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                    disabled=${() => loading.value}
                >
                    ${() => (loading.value ? "⏳ Creando..." : "➕ Crear Libro")}
                </button>
            </form>
        </div>
    `;
}
