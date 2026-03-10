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
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                <p class="mt-1 text-gray-500">Gestiona libros, stock, préstamos y devoluciones</p>
            </div>

            <div class="flex gap-2 mb-6 border-b border-gray-200">
                <button
                    class=${() => `px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all cursor-pointer -mb-px ${activeTab.value === "books" ? "bg-white border border-b-white border-gray-200 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                    @click=${handleTabBooks}
                >📚 Libros</button>
                <button
                    class=${() => `px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all cursor-pointer -mb-px ${activeTab.value === "loans" ? "bg-white border border-b-white border-gray-200 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                    @click=${handleTabLoans}
                >📋 Préstamos</button>
            </div>

            ${() => activeTab.value === "books"
            ? html`
                    <div class="space-y-8">
                        ${BookFormComponent(() => invalidateQueries("books"))}
                        ${ManageBooksView()}
                    </div>
                `
            : ManageReservationsView()
        }
        </div>
    `;
}
