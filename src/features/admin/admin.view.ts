import { html, signal, invalidateQueries } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { BookFormComponent } from "./book-form.component";
import { ManageBooksView } from "./manage-books.view";
import { ManageReservationsView } from "./manage-reservations.view";

type AdminTab = "books" | "loans";

export function AdminView(): NixTemplate {
    const activeTab = signal<AdminTab>("books");

    function handleTabBooks() { activeTab.value = "books"; }
    function handleTabLoans() { activeTab.value = "loans"; }

    return html`
        <div class="mt-20 relative min-h-screen bg-gray-50/20 py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="mb-12 animate-fade-in">
                    <h1 class="text-4xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
                    <p class="mt-2 text-lg text-gray-500 font-medium whitespace-pre-line">Infraestructura de gestión bibliotecaria centralizada</p>
                </div>

                <div class="mb-10 flex p-1.5 bg-gray-100/80 rounded-2xl w-fit border border-gray-200/50 animate-fade-in delay-100">
                    <button
                        class=${() => `px-8 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${activeTab.value === "books" ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-900"}`}
                        @click=${handleTabBooks}
                    >📚 Inventario</button>
                    <button
                        class=${() => `px-8 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${activeTab.value === "loans" ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-900"}`}
                        @click=${handleTabLoans}
                    >📋 Operaciones</button>
                </div>

                <div>
                    ${() => activeTab.value === "books"
                        ? html`
                                <div class="grid grid-cols-1 gap-12">
                                    <div class="glass-effect p-8 rounded-3xl border border-white/40 shadow-xl">
                                        <h2 class="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-100 pb-4">Registrar Nuevo Título</h2>
                                        ${BookFormComponent(() => invalidateQueries("books"))}
                                    </div>
                                    <div class="glass-effect p-8 rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                                        <h2 class="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-100 pb-4">Gestión de Catálogo</h2>
                                        ${ManageBooksView()}
                                    </div>
                                </div>
                            `
                        : html`
                            <div class="glass-effect p-8 rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                                <h2 class="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-100 pb-4">Monitor de Préstamos y Reservas</h2>
                                ${ManageReservationsView()}
                            </div>
                        `
                    }
                </div>
            </div>
        </div>
    `;
}
