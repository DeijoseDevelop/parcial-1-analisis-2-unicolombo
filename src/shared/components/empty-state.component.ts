import { html } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";

interface EmptyStateProps {
    icon: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, message, action }: EmptyStateProps): NixTemplate {
    return html`
        <div class="text-center py-16 text-gray-400">
            <p class="text-5xl mb-4">${icon}</p>
            <p class="text-lg">${message}</p>
            ${action
                ? html`
                    <button
                        class="mt-4 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
                        @click=${action.onClick}
                    >${action.label}</button>
                `
                : html`<span></span>`
            }
        </div>
    `;
}
