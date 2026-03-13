import { html, signal, createQuery, invalidateQueries } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { bookRepository } from "../../data/repositories/book.repository";
import { reservationRepository } from "../../data/repositories/reservation.repository";
import { showToast } from "../../shared/components/toast.component";
import { formatDate } from "../../shared/utils/format";
import { Spinner } from "../../shared/components/spinner.component";
import { StatusBadge } from "../../shared/components/status-badge.component";
import type { Book, Reservation } from "../../shared/types/models";

const INPUT_CLASS = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400 shadow-sm";

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
            <div class="fixed inset-0 z-[110] flex items-center justify-center p-4" @keydown=${handleEditKeydown}>
                <div class="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm" @click=${closeEdit}></div>
                <div role="dialog" aria-modal="true" aria-labelledby="edit-book-title"
                     class="relative glass-effect bg-white/95 rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/50 animate-fade-in-up">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h2 id="edit-book-title" class="text-2xl font-black text-gray-900 tracking-tight">Editar Libro</h2>
                            <p class="text-sm text-gray-500 font-medium mt-1">Modifica los detalles del título en el inventario</p>
                        </div>
                        <button class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer" @click=${closeEdit}>✕</button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-5">
                            <div>
                                <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Título del Libro *</label>
                                <input type="text" class=${INPUT_CLASS}
                                    value=${() => editTitle.value}
                                    @input=${(e: Event) => { editTitle.value = (e.target as HTMLInputElement).value; }}
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Autor / Escritor *</label>
                                <input type="text" class=${INPUT_CLASS}
                                    value=${() => editAuthor.value}
                                    @input=${(e: Event) => { editAuthor.value = (e.target as HTMLInputElement).value; }}
                                />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Editorial *</label>
                                    <input type="text" class=${INPUT_CLASS}
                                        value=${() => editPublisher.value}
                                        @input=${(e: Event) => { editPublisher.value = (e.target as HTMLInputElement).value; }}
                                    />
                                </div>
                                <div>
                                    <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Stock *</label>
                                    <input type="number" min="0" class=${INPUT_CLASS}
                                        value=${() => editStock.value}
                                        @input=${(e: Event) => { editStock.value = (e.target as HTMLInputElement).value; }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="space-y-5">
                            <div>
                                <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Sinopsis Narrativa</label>
                                <textarea class=${`${INPUT_CLASS} h-32 resize-none`}
                                    placeholder="Breve resumen de la obra..."
                                    value=${() => editSynopsis.value}
                                    @input=${(e: Event) => { editSynopsis.value = (e.target as HTMLTextAreaElement).value; }}
                                ></textarea>
                            </div>
                            <div>
                                <label class="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Imagen de Portada</label>
                                <div class="flex items-center gap-4">
                                    <label class="cursor-pointer group">
                                        <div class="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            Seleccionar archivo
                                        </div>
                                        <input type="file" accept="image/*" class="hidden" @change=${async (e: Event) => {
                                            const f = (e.target as HTMLInputElement).files?.[0];
                                            if (!f) return;
                                            const reader = new FileReader();
                                            reader.onload = () => { editCover.value = String(reader.result ?? ""); };
                                            reader.readAsDataURL(f);
                                        }} />
                                    </label>
                                    ${() => editCover.value ? html`<div class="relative group"><img src=${() => editCover.value} class="w-12 h-16 object-cover rounded-lg shadow-md border border-white" /><button class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" @click=${() => editCover.value = ""}>✕</button></div>` : html`<span></span>`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4 justify-end mt-12 pt-8 border-t border-gray-100">
                        <button
                            class="px-8 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                            @click=${closeEdit}
                        >Descartar</button>
                        <button
                            class="px-10 py-3 text-sm font-black text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled=${() => editLoading.value}
                            @click=${handleSaveEdit}
                        >
                            ${() => editLoading.value ? html`<span>Actualizando...</span>` : html`<span>💾 GUARDAR CAMBIOS</span>`}
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    const ReservationChips = () => {
        if (expandedLoading.value) {
            return html`<div class="py-4 flex justify-center">${Spinner({ size: "w-6 h-6" })}</div>`;
        }
        if (expandedReservations.value.length === 0) {
            return html`
                <div class="text-center py-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <p class="text-sm font-bold text-gray-400">SIN RESERVAS ACTIVAS</p>
                </div>
            `;
        }
        return html`
            <div class="space-y-4">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 px-2">Reservas vinculadas (${() => expandedReservations.value.length})</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${() => expandedReservations.value.map((r) => html`
                        <div class="flex flex-col gap-3 bg-white/60 rounded-2xl px-5 py-4 border border-white/80 shadow-sm group hover:bg-white transition-all">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-black text-gray-900">Usuario #${r.userId}</span>
                                <div class="scale-75 origin-right">${StatusBadge(r.status)}</div>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Solicitud: ${formatDate(r.requestDate)}</span>
                                ${r.returnDate ? html`<span class="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Devolución: ${formatDate(r.returnDate)}</span>` : html`<span></span>`}
                            </div>
                        </div>
                    `)}
                </div>
            </div>
        `;
    };

    return html`
        ${() => EditModal()}

        <div class="w-full">
            ${createQuery(
                "books",
                () => bookRepository.getAll(),
                (books) => html`
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="bg-indigo-50/30 text-xs font-black text-indigo-900 uppercase tracking-[0.1em]">
                                    <th class="px-8 py-5">Identificador</th>
                                    <th class="px-8 py-5">Título y Catálogo</th>
                                    <th class="px-8 py-5">Gestión de Stock</th>
                                    <th class="px-8 py-5">Disponibilidad</th>
                                    <th class="px-8 py-5 text-right">Controles</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100/50">
                                ${books.map((book) => html`
                                    <tr class="group hover:bg-indigo-50/20 transition-colors">
                                        <td class="px-8 py-6 text-sm font-black text-gray-400 tracking-tighter">#${book.id}</td>
                                        <td class="px-8 py-6">
                                            <div class="flex flex-col">
                                                <span class="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors">${book.title}</span>
                                                <span class="text-xs text-gray-500 font-medium mt-1">${book.author} • <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">${book.publisher}</span></span>
                                            </div>
                                        </td>
                                        <td class="px-8 py-6">
                                            <div class="flex items-center gap-3 bg-white/50 w-fit p-1 rounded-xl border border-gray-100 shadow-sm">
                                                <button
                                                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white active:scale-95 transition-all cursor-pointer disabled:opacity-20"
                                                    disabled=${book.stock <= 0}
                                                    @click=${() => handleDecrementStock(book.id, book.stock)}
                                                >−</button>
                                                <span class="text-xs font-black text-gray-900 w-6 text-center">${book.stock}</span>
                                                <button
                                                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white active:scale-95 transition-all cursor-pointer"
                                                    @click=${() => handleIncrementStock(book.id, book.stock)}
                                                >+</button>
                                            </div>
                                        </td>
                                        <td class="px-8 py-6">
                                            <span class=${`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${book.stock > 0 ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                                                ${book.stock > 0 ? "DISPONIBLE" : "AGOTADO"}
                                            </span>
                                        </td>
                                        <td class="px-8 py-6 text-right">
                                            <div class="flex items-center justify-end gap-3">
                                                <button
                                                    class="w-10 h-10 flex items-center justify-center text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white active:scale-95 transition-all shadow-sm cursor-pointer"
                                                    title="Editar detalles"
                                                    @click=${() => openEdit(book)}
                                                >✏️</button>
                                                <button
                                                    class=${() => `h-10 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer border ${expandedBookId.value === book.id ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-200" : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"}`}
                                                    @click=${() => toggleReservations(book.id)}
                                                >${() => expandedBookId.value === book.id ? "Cerrar" : "Reservas"}</button>
                                            </div>
                                        </td>
                                    </tr>
                                    ${() => expandedBookId.value === book.id ? html`
                                        <tr class="animate-fade-in">
                                            <td colspan="5" class="px-8 py-8 bg-indigo-50/40 border-t border-indigo-100/50">
                                                ${ReservationChips()}
                                            </td>
                                        </tr>
                                    ` : html`<span></span>`}
                                `)}
                            </tbody>
                        </table>
                    </div>
                `,
                { fallback: html`<div class="py-20 flex justify-center">${Spinner()}</div>` },
            )}
        </div>
    `;
}
