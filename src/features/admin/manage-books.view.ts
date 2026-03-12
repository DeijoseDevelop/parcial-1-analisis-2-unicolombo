import { html, signal, createQuery, invalidateQueries } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { bookRepository } from "../../data/repositories/book.repository";
import { reservationRepository } from "../../data/repositories/reservation.repository";
import { showToast } from "../../shared/components/toast.component";
import { formatDate } from "../../shared/utils/format";
import { Spinner } from "../../shared/components/spinner.component";
import { StatusBadge } from "../../shared/components/status-badge.component";
import type { Book, Reservation } from "../../shared/types/models";

const INPUT_CLASS = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-sm";

export function ManageBooksView(): NixTemplate {
    // Edit modal state
    const editingBook = signal<Book | null>(null);
    const editTitle = signal("");
    const editAuthor = signal("");
    const editPublisher = signal("");
    const editStock = signal("");
    const editSynopsis = signal("");
    const editCover = signal("");
    const editLoading = signal(false);

    // Reservations expansion per book row
    const expandedBookId = signal<number | null>(null);
    const expandedReservations = signal<Reservation[]>([]);
    const expandedLoading = signal(false);

    function openEdit(book: Book) {
        editingBook.value = book;
        editTitle.value = book.title;
        editAuthor.value = book.author;
        editPublisher.value = book.publisher;
        editStock.value = String(book.stock);
        editSynopsis.value = book.synopsis ?? "";
        editCover.value = book.cover ?? "";
    }

    function closeEdit() {
        editingBook.value = null;
    }

    function handleEditKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") closeEdit();
    }

    async function handleSaveEdit() {
        const book = editingBook.peek();
        if (!book) return;
        const stockNum = Number(editStock.value);
        if (!editTitle.value.trim() || !editAuthor.value.trim() || !editPublisher.value.trim()) {
            showToast("Completa los campos obligatorios", "error");
            return;
        }
        if (!Number.isInteger(stockNum) || stockNum < 0) {
            showToast("El stock debe ser un entero ≥ 0", "error");
            return;
        }
        editLoading.value = true;
        try {
            await bookRepository.update(book.id, {
                title: editTitle.value.trim(),
                author: editAuthor.value.trim(),
                publisher: editPublisher.value.trim(),
                stock: stockNum,
                synopsis: editSynopsis.value.trim() || undefined,
                cover: editCover.value || undefined,
            });
            showToast(`"${editTitle.value.trim()}" actualizado`, "success");
            closeEdit();
            invalidateQueries("books");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Error al actualizar", "error");
        } finally {
            editLoading.value = false;
        }
    }

    async function toggleReservations(bookId: number) {
        if (expandedBookId.value === bookId) {
            expandedBookId.value = null;
            return;
        }
        expandedBookId.value = bookId;
        expandedLoading.value = true;
        try {
            const all = await reservationRepository.getAll();
            expandedReservations.value = all.filter((r) => r.bookId === bookId);
        } catch (_e) {
            showToast("Error al cargar reservas", "error");
        } finally {
            expandedLoading.value = false;
        }
    }

    async function handleDecrementStock(id: number, currentStock: number) {
        if (currentStock <= 0) return;
        try {
            await bookRepository.update(id, { stock: currentStock - 1 });
            invalidateQueries("books");
        } catch (_err) {
            showToast("Error al actualizar stock", "error");
        }
    }

    async function handleIncrementStock(id: number, currentStock: number) {
        try {
            await bookRepository.update(id, { stock: currentStock + 1 });
            invalidateQueries("books");
        } catch (_err) {
            showToast("Error al actualizar stock", "error");
        }
    }

    const EditModal = () => {
        if (!editingBook.value) return html`<span></span>`;

        return html`
            <div class="fixed inset-0 z-50 flex items-center justify-center" @keydown=${handleEditKeydown}>
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click=${closeEdit}></div>
                <div role="dialog" aria-modal="true" aria-labelledby="edit-book-title"
                     class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4">
                    <div class="flex items-center justify-between mb-5">
                        <h2 id="edit-book-title" class="text-lg font-bold text-gray-900">✏️ Editar Libro</h2>
                        <button class="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer" @click=${closeEdit}>✕</button>
                    </div>
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                                <input type="text" class=${INPUT_CLASS}
                                    value=${() => editTitle.value}
                                    @input=${(e: Event) => { editTitle.value = (e.target as HTMLInputElement).value; }}
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Autor *</label>
                                <input type="text" class=${INPUT_CLASS}
                                    value=${() => editAuthor.value}
                                    @input=${(e: Event) => { editAuthor.value = (e.target as HTMLInputElement).value; }}
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Editorial *</label>
                                <input type="text" class=${INPUT_CLASS}
                                    value=${() => editPublisher.value}
                                    @input=${(e: Event) => { editPublisher.value = (e.target as HTMLInputElement).value; }}
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Stock *</label>
                                <input type="number" min="0" class=${INPUT_CLASS}
                                    value=${() => editStock.value}
                                    @input=${(e: Event) => { editStock.value = (e.target as HTMLInputElement).value; }}
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Sinopsis (opcional)</label>
                            <textarea class=${`${INPUT_CLASS} h-20 resize-none`}
                                value=${() => editSynopsis.value}
                                @input=${(e: Event) => { editSynopsis.value = (e.target as HTMLTextAreaElement).value; }}
                            ></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Portada (opcional)</label>
                            <input type="file" accept="image/*" class="block" @change=${async (e: Event) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => { editCover.value = String(reader.result ?? ""); };
                reader.onerror = () => { showToast("No se pudo leer la imagen", "error"); };
                reader.readAsDataURL(f);
            }} />
                            ${() => editCover.value ? html`<img src=${() => editCover.value} class="mt-2 w-28 h-36 object-cover rounded" />` : html`<span></span>`}
                        </div>
                    </div>
                    <div class="flex gap-3 justify-end mt-6">
                        <button
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                            @click=${closeEdit}
                        >Cancelar</button>
                        <button
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            disabled=${() => editLoading.value}
                            @click=${handleSaveEdit}
                        >${() => editLoading.value ? "Guardando..." : "💾 Guardar cambios"}</button>
                    </div>
                </div>
            </div>
        `;
    };

    const ReservationChips = () => {
        if (expandedLoading.value) {
            return Spinner({ size: "w-5 h-5", trackColor: "border-amber-200", activeColor: "border-t-amber-500", padding: "py-3" });
        }
        if (expandedReservations.value.length === 0) {
            return html`<p class="text-sm text-amber-700 text-center py-1">Sin reservas para este libro</p>`;
        }
        return html`
            <p class="text-xs font-semibold text-amber-800 mb-2">Reservas (${() => expandedReservations.value.length}):</p>
            <div class="flex flex-wrap gap-2">
                ${() => expandedReservations.value.map((r) => html`
                    <div class="flex items-center gap-2 text-xs bg-white rounded-lg px-3 py-1.5 shadow-sm border border-amber-100">
                        <span class="font-medium text-gray-700">Usuario #${r.userId}</span>
                        <span class="text-gray-400">${formatDate(r.requestDate)}</span>
                        ${r.returnDate ? html`<span class="text-gray-400">→ ${formatDate(r.returnDate)}</span>` : html`<span></span>`}
                        ${StatusBadge(r.status)}
                    </div>
                `)}
            </div>
        `;
    };

    return html`
        ${() => EditModal()}

        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
                <h2 class="text-lg font-bold text-gray-900">Gestión de Libros</h2>
            </div>
            ${createQuery(
        "books",
        () => bookRepository.getAll(),
        (books) => html`
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th class="px-6 py-3">ID</th>
                                    <th class="px-6 py-3">Título</th>
                                    <th class="px-6 py-3">Autor</th>
                                    <th class="px-6 py-3">Editorial</th>
                                    <th class="px-6 py-3">Stock</th>
                                    <th class="px-6 py-3">Estado</th>
                                    <th class="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${books.map((book) => html`
                                    <tr class="hover:bg-gray-50 transition-colors">
                                        <td class="px-6 py-4 text-sm text-gray-500">${book.id}</td>
                                        <td class="px-6 py-4 text-sm font-medium text-gray-900">${book.title}</td>
                                        <td class="px-6 py-4 text-sm text-gray-600">${book.author}</td>
                                        <td class="px-6 py-4 text-sm text-gray-500">${book.publisher}</td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-2">
                                                <button
                                                    class="w-7 h-7 flex items-center justify-center rounded bg-red-50 text-red-600 hover:bg-red-100 active:scale-90 text-sm font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                                    disabled=${book.stock <= 0}
                                                    @click=${() => handleDecrementStock(book.id, book.stock)}
                                                >−</button>
                                                <span class="text-sm font-semibold text-gray-700 w-8 text-center">${book.stock}</span>
                                                <button
                                                    class="w-7 h-7 flex items-center justify-center rounded bg-green-50 text-green-600 hover:bg-green-100 active:scale-90 text-sm font-bold transition-all cursor-pointer"
                                                    @click=${() => handleIncrementStock(book.id, book.stock)}
                                                >+</button>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class=${`px-2.5 py-1 rounded-full text-xs font-semibold ${book.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                ${book.stock > 0 ? "Disponible" : "Agotado"}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-2">
                                                <button
                                                    class="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer"
                                                    @click=${() => openEdit(book)}
                                                >✏️ Editar</button>
                                                <button
                                                    class=${() => `px-3 py-1.5 text-xs font-semibold rounded-lg active:scale-95 transition-all cursor-pointer ${expandedBookId.value === book.id ? "text-amber-700 bg-amber-100 hover:bg-amber-200" : "text-gray-600 bg-gray-100 hover:bg-gray-200"}`}
                                                    @click=${() => toggleReservations(book.id)}
                                                >${() => expandedBookId.value === book.id ? "🔼 Ocultar" : "📋 Reservas"}</button>
                                            </div>
                                        </td>
                                    </tr>
                                    ${() => expandedBookId.value === book.id ? html`
                                        <tr>
                                            <td colspan="7" class="px-6 py-3 bg-amber-50 border-t border-amber-100">
                                                ${ReservationChips()}
                                            </td>
                                        </tr>
                                    ` : html`<span></span>`}
                                `)}
                            </tbody>
                        </table>
                    </div>
                `,
        { fallback: Spinner({ size: "w-6 h-6", padding: "py-8" }) },
    )}
        </div>
    `;
}
