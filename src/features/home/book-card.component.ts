import { html, useRouter } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import type { Book } from "../../shared/types/models";

export function BookCard(book: Book): NixTemplate {
    const router = useRouter();
    const available = book.stock > 0;

    return html`
        <div
            class="glass-effect rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group border border-white/40 mb-2"
            @click=${() => router.navigate(`/book/${book.id}`)}
        >
            <div class="h-56 bg-indigo-50 flex items-center justify-center overflow-hidden relative">
                ${book.cover
                    ? html`<img src=${book.cover} alt=${book.title} class="h-full w-full object-cover" />`
                    : html`<span class="text-7xl">📖</span>`
                }
                <div class="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-300 flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span class="text-white text-[10px] font-black tracking-widest uppercase bg-indigo-600 px-4 py-2 rounded-lg shadow-lg">DETALLES</span>
                    </div>
                </div>
                
                <div class="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border bg-white/90 shadow-sm ${available ? "text-green-600 border-green-100" : "text-red-600 border-red-100"}">
                    ${available ? "En Stock" : "Agotado"}
                </div>
            </div>
            
            <div class="p-6 flex flex-col flex-1 bg-white">
                <h3 class="font-bold text-gray-900 text-lg line-clamp-2 leading-tight">${book.title}</h3>
                <p class="text-sm text-gray-500 mt-2 font-medium">${book.author}</p>
                
                <div class="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                    <div class="flex flex-col">
                        <span class="text-[10px] tracking-wider text-gray-400 font-bold uppercase">Editorial</span>
                        <span class="text-xs text-gray-700 font-bold truncate max-w-[100px]">${book.publisher}</span>
                    </div>
                    <div class="flex flex-col items-end">
                        <span class="text-[10px] tracking-wider text-gray-400 font-bold uppercase">Copias</span>
                        <span class="text-xs font-black ${available ? "text-indigo-600" : "text-red-500"}">${book.stock}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}
