import { html } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";

interface SpinnerProps {
    size?: string;
    trackColor?: string;
    activeColor?: string;
    padding?: string;
}

export function Spinner({
    size = "w-8 h-8",
    trackColor = "border-indigo-200",
    activeColor = "border-t-indigo-600",
    padding = "py-16",
}: SpinnerProps = {}): NixTemplate {
    return html`
        <div class=${`flex justify-center ${padding}`}>
            <div class=${`animate-spin ${size} border-4 ${trackColor} ${activeColor} rounded-full`}></div>
        </div>
    `;
}
