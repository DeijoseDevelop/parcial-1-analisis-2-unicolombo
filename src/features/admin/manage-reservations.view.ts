import { html, signal, createQuery } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { reservationRepository } from "../../data/repositories/reservation.repository";
import { ReservationTable } from "./reservation-table.component";
import { Spinner } from "../../shared/components/spinner.component";
import type { ReservationStatus } from "../../shared/types/models";

const FILTER_OPTIONS: { value: ReservationStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "Todos" },
    { value: "RESERVED", label: "Reservados" },
    { value: "BORROWED", label: "Prestados" },
    { value: "RETURNED", label: "Devueltos" },
    { value: "CANCELLED", label: "Cancelados" },
];

export function ManageReservationsView(): NixTemplate {
    const filter = signal<ReservationStatus | "ALL">("ALL");

    const renderReservationsQuery = () => createQuery(
        "reservations",
        () => reservationRepository.getAll(),
        (all) => html`
            ${() => ReservationTable({ reservations: all, currentFilter: filter.value })}
        `,
        { fallback: Spinner({ size: "w-6 h-6", padding: "py-8" }) },
    );

    return html`
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                <h2 class="text-lg font-bold text-gray-900">Gestión de Préstamos</h2>
                <div class="flex gap-1.5">
                    ${FILTER_OPTIONS.map((opt) => html`
                        <button
                            class=${() => `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filter.value === opt.value ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                            @click=${() => { filter.value = opt.value; }}
                        >${opt.label}</button>
                    `)}
                </div>
            </div>

            ${renderReservationsQuery()}
        </div>
    `;
}
