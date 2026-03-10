import { html, signal, createQuery, invalidateQueries } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { bookRepository } from "../../data/repositories/book.repository";
import { BookCard } from "./book-card.component";
import { Spinner } from "../../shared/components/spinner.component";
import { EmptyState } from "../../shared/components/empty-state.component";

export function HomeView(): NixTemplate {
    const search = signal<string>("");
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    function handleSearchInput(e: Event) {
        search.value = (e.target as HTMLInputElement).value;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            invalidateQueries("books");
        }, 400);
    }

    return html`
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Catálogo de Libros</h1>
                <p class="mt-1 text-gray-500">Explora y reserva libros de nuestra biblioteca</p>
            </div>

            <div class="mb-6">
                <div class="relative max-w-lg">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                        placeholder="Buscar por título o autor..."
                        @input=${handleSearchInput}
                    />
                </div>
            </div>

            ${createQuery(
                "books",
                () => bookRepository.getAll(search.peek() || undefined),
                (books) => {
                    if (books.length === 0) {
                        return EmptyState({ icon: "📭", message: "No se encontraron libros" });
                    }
                    return html`
                        <p class="mb-4 text-sm text-gray-500">
                            ${books.length} libro${books.length !== 1 ? "s" : ""} encontrado${books.length !== 1 ? "s" : ""}${search.peek() ? html` — "<strong>${search.peek()}</strong>"` : ""}
                        </p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            ${books.map((book) => BookCard(book))}
                        </div>
                    `;
                },
                { fallback: Spinner() },
            )}
        </div>
    `;
}
