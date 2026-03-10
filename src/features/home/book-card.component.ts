import { html, useRouter } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import type { Book } from "../../shared/types/models";

export function BookCard(book: Book): NixTemplate {
    const router = useRouter();
    const available = book.stock > 0;

    return html`
        <div
            class="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col group"
            @click=${() => router.navigate(`/book/${book.id}`)}
        >
            <div class="h-48 bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center overflow-hidden relative">
                ${book.cover
                    ? html`<img src=${book.cover} alt=${book.title} class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />`
                    : html`<span class="text-6xl group-hover:scale-110 transition-transform duration-300">📖</span>`
                }
                <div class="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors duration-300 flex items-center justify-center">
                    <span class="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-indigo-600/80 px-3 py-1.5 rounded-full backdrop-blur-sm">Ver detalle →</span>
                </div>
            </div>
            <div class="p-4 flex flex-col flex-1">
                <h3 class="font-bold text-gray-900 text-base line-clamp-2 group-hover:text-indigo-700 transition-colors">${book.title}</h3>
                <p class="text-sm text-gray-500 mt-1">${book.author}</p>
                <div class="mt-auto pt-3 flex items-center justify-between">
                    <span class="text-xs text-gray-400">${book.publisher}</span>
                    <span class=${`px-2.5 py-1 rounded-full text-xs font-semibold ${available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                        ${available ? `${book.stock} disponible${book.stock > 1 ? "s" : ""}` : "Agotado"}
                    </span>
                </div>
            </div>
        </div>
    `;
}
