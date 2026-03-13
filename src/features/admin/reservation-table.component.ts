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
        return html`
            <div class="py-12 animate-fade-in">
                ${EmptyState({ icon: "📋", message: `No hay registros${filterLabel}` })}
            </div>
        `;
    }

    return html`
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="bg-indigo-50/30 text-xs font-black text-indigo-900 uppercase tracking-[0.1em]">
                        <th class="px-8 py-5">Identificador</th>
                        <th class="px-8 py-5">Título y Usuario</th>
                        <th class="px-8 py-5">Solicitud</th>
                        <th class="px-8 py-5">Devolución</th>
                        <th class="px-8 py-5">Estado</th>
                        <th class="px-8 py-5 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100/50">
                    ${rows.map((r) => html`
                        <tr class="group hover:bg-white/40 transition-colors">
                            <td class="px-8 py-6 text-sm font-black text-gray-400 tracking-tighter">#${r.id}</td>
                            <td class="px-8 py-6">
                                <div class="flex flex-col">
                                    <span class="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors">${r.bookTitle}</span>
                                    <div class="flex items-center gap-2 mt-1">
                                        <div class="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px]">👤</div>
                                        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">${r.userName || `ID #${r.userId}`}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-8 py-6 text-sm text-gray-500 font-medium">${formatDate(r.requestDate)}</td>
                            <td class="px-8 py-6 text-sm text-gray-400 font-medium">${r.returnDate ? formatDate(r.returnDate) : "—"}</td>
                            <td class="px-8 py-6">
                                <div class="scale-90 origin-left">${StatusBadge(r.status)}</div>
                            </td>
                            <td class="px-8 py-6 text-right">
                                ${r.status === "RESERVED"
                                    ? html`<button
                                        class="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                                        @click=${() => handleConfirmLoan(r)}
                                    >Confirmar Préstamo</button>`
                                    : r.status === "BORROWED"
                                        ? html`<button
                                            class="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-green-600 bg-white border border-green-100 rounded-xl hover:bg-green-600 hover:text-white hover:border-green-600 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                                            @click=${() => handleReturnBook(r)}
                                        >Registrar Devolución</button>`
                                        : html`<span class="text-xs font-bold text-gray-300 tracking-widest">—</span>`
                                }
                            </td>
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `;
}
