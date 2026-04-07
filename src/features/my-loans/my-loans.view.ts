import { html, signal, createQuery, invalidateQueries, useRouter } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { formatDate } from "../../shared/utils/format";
import { reservationRepository } from "../../data/repositories/reservation.repository";
import { userId } from "../../core/auth/auth.store";
import { showToast } from "../../shared/components/toast.component";
import { Spinner } from "../../shared/components/spinner.component";
import { EmptyState } from "../../shared/components/empty-state.component";
import { StatusBadge } from "../../shared/components/status-badge.component";

export function MyLoansView(): NixTemplate {
    const router = useRouter();
    const uid = userId.peek();

    const modalOpen      = signal(false);
    const modalBookTitle = signal("");
    const pendingId      = signal<number | null>(null);

    const q = uid
        ? createQuery(`my-loans-${uid}`, () => reservationRepository.getByUser(uid))
        : null;

    function handleRefresh() {
        if (uid) invalidateQueries(`my-loans-${uid}`);
    }

    function handleNavigateHome() { router.navigate("/home"); }

    function handleCancelClick(id: number, title: string) {
        pendingId.value      = id;
        modalBookTitle.value = title;
        modalOpen.value      = true;
    }

    function handleModalDismiss() {
        modalOpen.value = false;
        pendingId.value = null;
    }

    async function handleModalConfirm() {
        const id = pendingId.value;
        if (id === null) return;
        modalOpen.value = false;
        pendingId.value = null;
        try {
            await reservationRepository.cancel(id);
            showToast("Reserva cancelada", "info");
            if (uid) invalidateQueries(`my-loans-${uid}`);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Error al cancelar", "error");
        }
    }

    function handleModalKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") handleModalDismiss();
    }

    const ConfirmModal = (): NixTemplate => html`
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4" @keydown=${handleModalKeydown}>
            <div class="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm" @click=${handleModalDismiss}></div>
            <div role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title"
                class="relative glass-effect bg-white/90 rounded-3xl shadow-2xl p-8 w-full max-w-sm animate-fade-in-up border border-white/50">
                <div class="flex flex-col items-center text-center">
                    <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mb-4 border border-red-100">⚠️</div>
                    <h2 id="cancel-modal-title" class="text-xl font-bold text-gray-900 mb-2">Cancelar reserva</h2>
                    <p class="text-gray-600 mb-8">
                        ¿Estás seguro de que quieres cancelar la reserva de
                        <strong class="text-gray-900 break-words">${() => modalBookTitle.value}</strong>?
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            class="flex-1 px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                            @click=${handleModalDismiss}
                        >No, volver</button>
                        <button
                            class="flex-1 px-6 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 active:scale-95 transition-all cursor-pointer"
                            @click=${handleModalConfirm}
                        >Sí, cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const ReservationsTable = (reservations: any[]): NixTemplate => {
        if (reservations.length === 0) {
            return html`
                <div class="animate-fade-in-up delay-200">
                    ${EmptyState({
                        icon: "📚",
                        message: "Aún no tienes préstamos. ¡Explora el catálogo y elige tu próxima lectura!",
                        action: { label: "📚 Explorar Catálogo", onClick: handleNavigateHome },
                    })}
                </div>
            `;
        }

        return html`
            <div class="glass-effect rounded-3xl shadow-xl overflow-hidden border border-white/40">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-indigo-50/50 text-xs font-black text-indigo-900 uppercase tracking-[0.1em]">
                                <th class="px-8 py-5">Libro</th>
                                <th class="px-8 py-5">Autor</th>
                                <th class="px-8 py-5">Solicitud</th>
                                <th class="px-8 py-5">Devolución</th>
                                <th class="px-8 py-5">Estado</th>
                                <th class="px-8 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100/50">
                            ${reservations.map((r) => html`
                                <tr class="group hover:bg-white/40 transition-colors">
                                    <td class="px-8 py-5">
                                        <div class="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">${r.bookTitle}</div>
                                    </td>
                                    <td class="px-8 py-5 text-sm text-gray-600 font-medium">${r.bookAuthor}</td>
                                    <td class="px-8 py-5 text-sm text-gray-500">${formatDate(r.requestDate)}</td>
                                    <td class="px-8 py-5 text-sm text-gray-500 font-medium">
                                        ${r.returnDate ? formatDate(r.returnDate) : html`<span class="text-gray-300">—</span>`}
                                    </td>
                                    <td class="px-8 py-5">
                                        <div class="scale-90 origin-left">${StatusBadge(r.status)}</div>
                                    </td>
                                    <td class="px-8 py-5 text-right">
                                        ${r.status === "RESERVED"
                                            ? html`
                                                <button
                                                    class="px-4 py-2 text-xs font-bold text-red-600 bg-red-50/50 rounded-xl hover:bg-red-500 hover:text-white active:scale-95 transition-all cursor-pointer border border-red-100"
                                                    @click=${() => handleCancelClick(r.id, r.bookTitle)}
                                                >CANCELAR</button>
                                            `
                                            : html`<span class="text-sm text-gray-300">—</span>`
                                        }
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };

    return html`
        <div class="mt-20 relative min-h-screen bg-gray-50/20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

                ${() => modalOpen.value ? ConfirmModal() : html`<span></span>`}

                <div class="mb-12 animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 class="text-4xl font-black text-gray-900 tracking-tight">Mis Préstamos</h1>
                        <p class="mt-2 text-lg text-gray-500 font-medium">Gestiona tus lecturas actuales y pasadas</p>
                    </div>
                    <button
                        class="px-6 py-3 text-sm font-bold text-indigo-600 bg-white border border-indigo-100 rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                        @click=${handleRefresh}
                    >🔄 Actualizar lista</button>
                </div>

                ${() => {
                    if (!uid || !q) {
                        return html`<div class="py-20 text-center text-gray-500">No autenticado</div>`;
                    }
                    if (q.status.value === "pending") {
                        return html`<div class="py-40 flex justify-center">${Spinner()}</div>`;
                    }
                    if (q.status.value === "error") {
                        return html`<p class="text-red-500 text-sm font-bold py-10 text-center">Error al cargar los préstamos.</p>`;
                    }
                    return ReservationsTable(q.data.value!);
                }}

            </div>
        </div>
    `;
}