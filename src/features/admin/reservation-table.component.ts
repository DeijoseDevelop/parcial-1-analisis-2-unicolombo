import { html, invalidateQueries } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { showToast } from "../../shared/components/toast.component";
import { formatDate } from "../../shared/utils/format";
import { reservationRepository } from "../../data/repositories/reservation.repository";
import { EmptyState } from "../../shared/components/empty-state.component";
import { StatusBadge } from "../../shared/components/status-badge.component";
import { STATUS_LABEL } from "../../shared/constants/reservation.constants";
import type { Reservation, ReservationStatus } from "../../shared/types/models";

interface ReservationTableProps {
    reservations: Reservation[];
    currentFilter: ReservationStatus | "ALL";
}

export function ReservationTable({ reservations, currentFilter }: ReservationTableProps): NixTemplate {
    async function handleConfirmLoan(r: Reservation) {
        try {
            await reservationRepository.confirmLoan(r.id);
            showToast(`Préstamo confirmado: "${r.bookTitle}"`, "success");
            invalidateQueries("reservations");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Error al confirmar", "error");
        }
    }

    async function handleReturnBook(r: Reservation) {
        try {
            await reservationRepository.returnBook(r.id);
            showToast(`Devolución registrada: "${r.bookTitle}"`, "success");
            invalidateQueries("reservations");
            invalidateQueries("books");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Error al registrar devolución", "error");
        }
    }

    const rows = currentFilter === "ALL"
        ? reservations
        : reservations.filter((r) => r.status === currentFilter);

    if (rows.length === 0) {
        const filterLabel = currentFilter !== "ALL"
            ? ` con estado "${STATUS_LABEL[currentFilter as ReservationStatus]}"`
            : "";
        return EmptyState({ icon: "📋", message: `No hay registros${filterLabel}` });
    }

    return html`
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th class="px-6 py-3">ID</th>
                        <th class="px-6 py-3">Libro</th>
                        <th class="px-6 py-3">Autor</th>
                        <th class="px-6 py-3">Usuario ID</th>
                        <th class="px-6 py-3">Solicitud</th>
                        <th class="px-6 py-3">Devolución</th>
                        <th class="px-6 py-3">Estado</th>
                        <th class="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${rows.map((r) => html`
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 text-sm text-gray-400">#${r.id}</td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">${r.bookTitle}</td>
                            <td class="px-6 py-4 text-sm text-gray-600">${r.bookAuthor}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">Usuario #${r.userId}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">${formatDate(r.requestDate)}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">${r.returnDate ? formatDate(r.returnDate) : "—"}</td>
                            <td class="px-6 py-4">${StatusBadge(r.status)}</td>
                            <td class="px-6 py-4">
                                ${r.status === "RESERVED"
                                    ? html`<button
                                        class="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                                        @click=${() => handleConfirmLoan(r)}
                                    >✔ Confirmar préstamo</button>`
                                    : r.status === "BORROWED"
                                        ? html`<button
                                            class="px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                                            @click=${() => handleReturnBook(r)}
                                        >↩ Registrar devolución</button>`
                                        : html`<span class="text-sm text-gray-300">—</span>`
                                }
                            </td>
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `;
}
