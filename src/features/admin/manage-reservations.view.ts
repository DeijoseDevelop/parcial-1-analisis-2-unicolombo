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
        { fallback: html`<div class="py-20 flex justify-center">${Spinner()}</div>` },
    );

    return html`
        <div class="w-full">
            <div class="mb-8 flex items-center justify-between gap-6 flex-wrap">
                <div class="flex flex-wrap gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100/50">
                    ${FILTER_OPTIONS.map((opt) => html`
                        <button
                            class=${() => `px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${filter.value === opt.value ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-800"}`}
                            @click=${() => { filter.value = opt.value; }}
                        >${opt.label}</button>
                    `)}
                </div>
            </div>

            <div>
                ${renderReservationsQuery()}
            </div>
        </div>
    `;
}
