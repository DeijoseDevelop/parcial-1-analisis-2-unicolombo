import { html, signal, createQuery, invalidateQueries } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { bookRepository } from "../../data/repositories/book.repository";
import { BookCard } from "./book-card.component";
import { Spinner } from "../../shared/components/spinner.component";
import { EmptyState } from "../../shared/components/empty-state.component";

export function HomeView(): NixTemplate {
    const search = signal<string>("");
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const { data, status } = createQuery("books", () => bookRepository.getAll(search.peek() || undefined));

    function handleSearchInput(e: Event) {
        search.value = (e.target as HTMLInputElement).value;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => invalidateQueries("books"), 400);
    }

    return html`
        <div class="mt-20 relative min-h-screen bg-gray-50/30">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

                <div class="mb-10 animate-fade-in">
                    <h1 class="text-4xl font-black text-gray-900 tracking-tight">Catálogo de Libros</h1>
                    <p class="mt-2 text-lg text-gray-500 font-medium">Descubre tu próxima gran aventura literaria</p>
                </div>

                <div class="glass-effect rounded-2xl p-6 mb-10 shadow-sm border border-white/40 animate-fade-in-up">
                    <div class="relative max-w-xl">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">🔍</span>
                        <input
                            type="text"
                            class="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 shadow-sm font-medium"
                            placeholder="Buscar por título, autor o editorial..."
                            @input=${handleSearchInput}
                        />
                    </div>
                </div>

                ${() => {
                    if (status.value === "pending") {
                        return html`<div class="py-20 flex justify-center">${Spinner()}</div>`;
                    }

                    if (status.value === "error") {
                        return html`
                            <div class="animate-fade-in-up">
                                ${EmptyState({ icon: "⚠️", message: "Ocurrió un error al cargar los libros." })}
                            </div>
                        `;
                    }

                    const books = data.value!;

                    if (books.length === 0) {
                        return html`
                            <div class="animate-fade-in-up delay-200">
                                ${EmptyState({ icon: "📭", message: "No se encontraron libros que coincidan con tu búsqueda." })}
                            </div>
                        `;
                    }

                    return html`
                        <div class="flex items-center justify-between mb-6">
                            <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                ${books.length} libro${books.length !== 1 ? "s" : ""} encontrado${books.length !== 1 ? "s" : ""}
                                ${search.peek() ? html` para <span class="text-indigo-600">"${search.peek()}"</span>` : ""}
                            </p>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            ${books.map((book) => BookCard(book))}
                        </div>
                    `;
                }}

            </div>
        </div>
    `;
}