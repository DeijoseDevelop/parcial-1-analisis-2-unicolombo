import { html, RouterView, NixComponent } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { Navbar } from "./shared/components/navbar.component";
import { ToastContainer } from "./shared/components/toast.component";

export class App extends NixComponent {
    render(): NixTemplate {
        return html`
            <div class="min-h-screen bg-gray-50 flex flex-col">
                ${new Navbar()}
                <main class="flex-1 mt-12">
                    ${new RouterView()}
                </main>
                ${new ToastContainer()}
            </div>
        `;
    }
}
