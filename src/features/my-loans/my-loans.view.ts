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

    const modalOpen = signal(false);
    const modalBookTitle = signal("");
    const pendingId = signal<number | null>(null);

    function handleRefresh() {
        const uid = userId.peek();
        if (uid) invalidateQueries(`my-loans-${uid}`);
    }

    function handleNavigateHome() {
        router.navigate("/home");
    }

    function handleCancelClick(id: number, title: string) {
        pendingId.value = id;
        modalBookTitle.value = title;
        modalOpen.value = true;
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
            const uid = userId.peek();
            if (uid) invalidateQueries(`my-loans-${uid}`);
        } catch (err) {
            showToast(
                err instanceof Error ? err.message : "Error al cancelar",
                "error",
            );
        }
    }

    function handleModalKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") handleModalDismiss();
    }

    return html`
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            ${() => modalOpen.value
                ? html`
                    <div class="fixed inset-0 z-50 flex items-center justify-center" @keydown=${handleModalKeydown}>
                        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click=${handleModalDismiss}></div>
                        <div role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title"
                            class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-fadeIn">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="text-2xl">⚠️</span>
                                <h2 id="cancel-modal-title" class="text-lg font-bold text-gray-900">Cancelar reserva</h2>
                            </div>
                            <p class="text-gray-600 mb-6">
                                ¿Seguro que deseas cancelar la reserva de
                                <strong>${() => modalBookTitle.value}</strong>?
                            </p>
                            <div class="flex gap-3 justify-end">
                                <button
                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                                    @click=${handleModalDismiss}
                                >No, volver</button>
                                <button
                                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
                                    @click=${handleModalConfirm}
                                >Sí, cancelar</button>
                            </div>
                        </div>
                    </div>
                `
                : html`<span></span>`
            }
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Mis Préstamos</h1>
                    <p class="mt-1 text-gray-500">Historial de reservas y préstamos</p>
                </div>
                <button
                    class="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    @click=${handleRefresh}
                >
                    🔄 Actualizar
                </button>
            </div>

            ${() => {
                const uid = userId.value;
                if (!uid) return html`<p class="text-gray-500">No autenticado</p>`;

                return createQuery(
                    `my-loans-${uid}`,
                    () => reservationRepository.getByUser(uid),
                    (reservations) => {
                        if (reservations.length === 0) {
                            return EmptyState({
                                icon: "📋",
                                message: "No tienes préstamos ni reservas aún",
                                action: { label: "📚 Explorar Catálogo", onClick: handleNavigateHome },
                            });
                        }

                        return html`
                            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                                <div class="overflow-x-auto">
                                    <table class="w-full">
                                        <thead>
                                            <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                <th class="px-6 py-3">Libro</th>
                                                <th class="px-6 py-3">Autor</th>
                                                <th class="px-6 py-3">Fecha Solicitud</th>
                                                <th class="px-6 py-3">Fecha Devolución</th>
                                                <th class="px-6 py-3">Estado</th>
                                                <th class="px-6 py-3">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-100">
                                            ${reservations.map((r) => html`
                                                <tr class="hover:bg-gray-50 transition-colors">
                                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${r.bookTitle}</td>
                                                    <td class="px-6 py-4 text-sm text-gray-600">${r.bookAuthor}</td>
                                                    <td class="px-6 py-4 text-sm text-gray-500">${formatDate(r.requestDate)}</td>
                                                    <td class="px-6 py-4 text-sm text-gray-500">${r.returnDate ? formatDate(r.returnDate) : "—"}</td>
                                                    <td class="px-6 py-4">${StatusBadge(r.status)}</td>
                                                    <td class="px-6 py-4">
                                                        ${r.status === "RESERVED"
                                                            ? html`
                                                                <button
                                                                    class="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 active:scale-95 transition-all cursor-pointer"
                                                                    @click=${() => handleCancelClick(r.id, r.bookTitle)}
                                                                >✕ Cancelar</button>
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
                    },
                    { fallback: Spinner() },
                );
            }}
        </div>
    `;
}
