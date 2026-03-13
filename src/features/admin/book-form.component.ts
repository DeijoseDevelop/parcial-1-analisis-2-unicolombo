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
        cover: "",
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

    // helper to convert file to base64
    function fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error("error reading file"));
            reader.onload = () => resolve(String(reader.result ?? ""));
            reader.readAsDataURL(file);
        });
    }

    const onSubmit = form.handleSubmit(async (values) => {
        loading.value = true;
        try {
            await bookRepository.create({
                title: values.title,
                author: values.author,
                publisher: values.publisher,
                stock: Number(values.stock) || 0,
                synopsis: values.synopsis || undefined,
                cover: values.cover || undefined,
            });
            showToast("Libro creado exitosamente", "success");
            
            // Explicitly clear all fields
            form.fields.title.value.value = "";
            form.fields.author.value.value = "";
            form.fields.publisher.value.value = "";
            form.fields.stock.value.value = "";
            form.fields.synopsis.value.value = "";
            form.fields.cover.value.value = "";
            
            form.reset();
            onCreated();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Error al crear libro", "error");
        } finally {
            loading.value = false;
        }
    });

    const LABEL_CLASS = "block text-xs font-black uppercase tracking-widest text-gray-500 mb-2";
    const INPUT_CLASS = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400 shadow-sm";

    return html`
        <div class="w-full">
            <form @submit=${onSubmit} class="space-y-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Basic Info Column -->
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="col-span-full">
                                <label class=${LABEL_CLASS}>Título del Obra *</label>
                                <input type="text" class=${INPUT_CLASS} placeholder="E.g. Cien Años de Soledad"
                                    value=${() => form.fields.title.value.value}
                                    @input=${form.fields.title.onInput}
                                    @blur=${form.fields.title.onBlur}
                                />
                                ${() => {
                                    const err = form.fields.title.error.value;
                                    return err ? html`<p class="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">${err}</p>` : html`<span></span>`;
                                }}
                            </div>
                            
                            <div class="col-span-1">
                                <label class=${LABEL_CLASS}>Autor / Escritor *</label>
                                <input type="text" class=${INPUT_CLASS} placeholder="Nombre completo"
                                    value=${() => form.fields.author.value.value}
                                    @input=${form.fields.author.onInput}
                                    @blur=${form.fields.author.onBlur}
                                />
                                ${() => {
                                    const err = form.fields.author.error.value;
                                    return err ? html`<p class="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">${err}</p>` : html`<span></span>`;
                                }}
                            </div>

                            <div class="col-span-1">
                                <label class=${LABEL_CLASS}>Editorial *</label>
                                <input type="text" class=${INPUT_CLASS} placeholder="Casa editorial"
                                    value=${() => form.fields.publisher.value.value}
                                    @input=${form.fields.publisher.onInput}
                                    @blur=${form.fields.publisher.onBlur}
                                />
                                ${() => {
                                    const err = form.fields.publisher.error.value;
                                    return err ? html`<p class="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">${err}</p>` : html`<span></span>`;
                                }}
                            </div>

                            <div class="col-span-full">
                                <label class=${LABEL_CLASS}>Existencias Iniciales *</label>
                                <div class="relative max-w-xs">
                                    <input type="number" class=${INPUT_CLASS} placeholder="0" min="0"
                                        value=${() => form.fields.stock.value.value}
                                        @input=${form.fields.stock.onInput}
                                        @blur=${form.fields.stock.onBlur}
                                    />
                                    <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                        <span class="text-xs font-bold text-gray-300">UNIDADES</span>
                                    </div>
                                </div>
                                ${() => {
                                    const err = form.fields.stock.error.value;
                                    return err ? html`<p class="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">${err}</p>` : html`<span></span>`;
                                }}
                            </div>
                        </div>
                    </div>

                    <!-- Media & Synopsis Column -->
                    <div class="space-y-6">
                        <div>
                            <label class=${LABEL_CLASS}>Sinopsis de la Obra</label>
                            <textarea class=${`${INPUT_CLASS} h-32 resize-none`} placeholder="Describe brevemente la trama o contenido..."
                                value=${() => form.fields.synopsis.value.value}
                                @input=${form.fields.synopsis.onInput}
                            ></textarea>
                        </div>

                        <div>
                            <label class=${LABEL_CLASS}>Imagen de Portada</label>
                            <div class="relative group">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    class="hidden" 
                                    id="book-cover-upload"
                                    @change=${async (e: Event) => {
                                        const f = (e.target as HTMLInputElement).files?.[0];
                                        if (!f) return;
                                        try {
                                            const b = await fileToBase64(f);
                                            form.fields.cover.value.value = b;
                                        } catch (_err) {
                                            showToast("Error al procesar imagen", "error");
                                        }
                                    }} 
                                />
                                
                                <div class="flex gap-4 items-start">
                                    <label 
                                        for="book-cover-upload" 
                                        class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group-hover:shadow-inner"
                                    >
                                        <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                            🖼️
                                        </div>
                                        <p class="text-xs font-black text-indigo-600 uppercase tracking-widest">Subir Imagen</p>
                                        <p class="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">PNG, JPG hasta 5MB</p>
                                    </label>

                                    ${() => {
                                        const b = form.fields.cover.value.value;
                                        return b ? html`
                                            <div class="relative w-28 h-40 shrink-0 group/preview animate-fade-in">
                                                <img src=${b} class="w-full h-full object-cover rounded-xl shadow-lg border-2 border-white" />
                                                <button 
                                                    type="button"
                                                    class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg hover:bg-red-600 hover:scale-110 transition-all cursor-pointer"
                                                    @click=${() => form.fields.cover.value.value = ""}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ` : html`
                                            <div class="w-28 h-40 shrink-0 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center bg-gray-50/50">
                                                <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center px-4">Vista previa</span>
                                            </div>
                                        `;
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-start pt-6 border-t border-gray-100/50">
                    <button
                        type="submit"
                        class="px-10 py-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-3"
                        disabled=${() => loading.value}
                    >
                        ${() => (loading.value ? html`<span>⏳ PROCESANDO...</span>` : html`<span>➕ CREAR NUEVO LIBRO</span>`)}
                    </button>
                </div>
            </form>
        </div>
    `;
}
