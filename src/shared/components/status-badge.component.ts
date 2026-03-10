import { html } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import type { ReservationStatus } from "../types/models";
import { STATUS_BADGE, STATUS_LABEL } from "../constants/reservation.constants";

export function StatusBadge(status: ReservationStatus): NixTemplate {
    return html`
        <span class=${`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[status]}`}>
            ${STATUS_LABEL[status]}
        </span>
    `;
}
