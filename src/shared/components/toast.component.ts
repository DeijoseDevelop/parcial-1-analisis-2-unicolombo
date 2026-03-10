import { signal, html, NixComponent } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";

type ToastType = "success" | "error" | "info";

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

const toasts = signal<ToastItem[]>([]);
let _nextId = 0;

export function showToast(message: string, type: ToastType = "info", duration = 3500) {
    const id = _nextId++;
    toasts.update((list) => [...list, { id, message, type }]);
    setTimeout(() => {
        toasts.update((list) => list.filter((t) => t.id !== id));
    }, duration);
}

const TYPE_CLASSES: Record<ToastType, string> = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
};

export class ToastContainer extends NixComponent {
    render(): NixTemplate {
        return html`
            <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
                ${() =>
                toasts.value.map(
                    (t) => html`
                            <div class=${`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-[slideIn_0.3s_ease] ${TYPE_CLASSES[t.type]}`}>
                                ${t.message}
                            </div>
                        `,
                )
            }
            </div>
            <style>
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
            </style>
        `;
    }
}
