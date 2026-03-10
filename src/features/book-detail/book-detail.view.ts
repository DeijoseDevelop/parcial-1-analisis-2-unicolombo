import { html, signal, createQuery, invalidateQueries, useRouter } from "@deijose/nix-js";
import type { NixTemplate } from "@deijose/nix-js";
import { bookRepository } from "../../data/repositories/book.repository";
import { reservationRepository } from "../../data/repositories/reservation.repository";
import { userId, isLoggedIn } from "../../core/auth/auth.store";
import { showToast } from "../../shared/components/toast.component";
import { setPendingRedirect } from "../../core/auth/auth.guard";
import { Spinner } from "../../shared/components/spinner.component";
import { EmptyState } from "../../shared/components/empty-state.component";

export function BookDetailView(): NixTemplate {
    const router = useRouter();
    const bookId = Number(router.params.value.id);
    const loading = signal(false);
    const reserved = signal(false);
    // Tracks stock optimistically after a reservation (null = use server value)
    const postReserveStock = signal<number | null>(null);

    function handleGoBack() { router.navigate("/home"); }
    function handleGoLoans() { router.navigate("/my-loans"); }
    function handleGoHome() { router.navigate("/home"); }

    const NotFound = () => EmptyState({
        icon: "🔍",
        message: "Libro no encontrado",
        action: { label: "Ir al catálogo", onClick: handleGoBack },
    });

    const BookDetails = (book: any) => {
        if (!book) return NotFound();

        const liveStock = () =>
            postReserveStock.value !== null ? postReserveStock.value : book.stock;

        function handleLoginRedirect() {
            setPendingRedirect(`/book/${book.id}`);
            showToast("Inicia sesión para reservar", "info");
            router.navigate("/login");
        }

        async function handleReserve() {
            const uid = userId.value;
            if (!uid) return;
            loading.value = true;
            try {
                await reservationRepository.create(uid, book.id);
                postReserveStock.value = liveStock() - 1;
                reserved.value = true;
                invalidateQueries("books");
                invalidateQueries(`my-loans-${uid}`);
                invalidateQueries(`book-${book.id}`);
                showToast("¡Reserva exitosa! 🎉", "success");
            } catch (err) {
                showToast(
                    err instanceof Error ? err.message : "Error al reservar",
                    "error",
                );
            } finally {
                loading.value = false;
            }
        }

        const ActionButtons = () => {
            if (reserved.value) {
                return html`
                    <div class="bg-green-50 border border-green-200 rounded-xl p-4 animate-[fadeIn_0.3s_ease]">
                        <p class="text-green-700 font-semibold flex items-center gap-2">
                            <span class="text-xl">✅</span> ¡Reserva realizada con éxito!
                        </p>
                        <p class="text-green-600 text-sm mt-1">Tu libro te espera. Revisa tu historial de préstamos.</p>
                        <div class="flex gap-3 mt-3">
                            <button
                                class="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 active:scale-95 transition-all cursor-pointer"
                                @click=${handleGoLoans}
                            >📋 Ver Mis Préstamos</button>
                            <button
                                class="px-4 py-2 bg-white text-green-700 text-sm font-semibold rounded-lg border border-green-300 hover:bg-green-50 active:scale-95 transition-all cursor-pointer"
                                @click=${handleGoHome}
                            >📚 Seguir Explorando</button>
                        </div>
                    </div>
                `;
            }

            if (!isLoggedIn.value) {
                return html`
                    <button
                        class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 hover:shadow-lg active:scale-95 focus:ring-4 focus:ring-indigo-300 transition-all cursor-pointer"
                        @click=${handleLoginRedirect}
                    >
                        🔐 Iniciar sesión para reservar
                    </button>
                `;
            }

            return html`
                <button
                    class=${() => `px-6 py-3 font-semibold rounded-lg transition-all focus:ring-4 focus:ring-indigo-300 ${liveStock() > 0 && !loading.value
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled=${() => liveStock() <= 0 || loading.value}
                    @click=${handleReserve}
                >
                    ${() => loading.value
                        ? html`<span class="flex items-center gap-2"><span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block"></span> Reservando...</span>`
                        : html`<span>📚 Hacer Reserva</span>`
                    }
                </button>
                ${() => liveStock() <= 0
                    ? html`<p class="mt-2 text-sm text-red-500 animate-pulse">No hay copias disponibles actualmente</p>`
                    : html`<span></span>`
                }
            `;
        };

        return html`
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div class="md:flex">
                    <div class="md:w-1/3 bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center p-8 min-h-[300px] relative overflow-hidden">
                        ${book.cover
                            ? html`<img src=${book.cover} alt=${book.title} class="max-h-80 rounded-lg shadow-md hover:scale-105 transition-transform duration-300" />`
                            : html`<span class="text-8xl">📖</span>`
                        }
                    </div>
                    <div class="md:w-2/3 p-8">
                        <div class="flex items-start justify-between gap-4">
                            <h1 class="text-2xl font-bold text-gray-900">${book.title}</h1>
                            <span class=${() => `shrink-0 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${liveStock() > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                ${() => liveStock() > 0 ? "Disponible" : "Agotado"}
                            </span>
                        </div>

                        <p class="text-lg text-gray-600 mt-1">${book.author}</p>

                        <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                            <span class="flex items-center gap-1">📄 <strong>Editorial:</strong> ${book.publisher}</span>
                            <span class="flex items-center gap-1">📦 <strong>Stock:</strong> ${() => liveStock()} copia${() => liveStock() !== 1 ? "s" : ""}</span>
                        </div>

                        ${book.synopsis
                            ? html`
                                <div class="mt-6">
                                    <h3 class="text-sm font-semibold text-gray-700 mb-2">Sinopsis</h3>
                                    <p class="text-gray-600 leading-relaxed">${book.synopsis}</p>
                                </div>
                            `
                            : html`<span></span>`
                        }

                        <div class="mt-8">
                            ${ActionButtons()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    return html`
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                class="group mb-6 text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 transition-all cursor-pointer"
                @click=${handleGoBack}
            >
                <span class="inline-block transition-transform group-hover:-translate-x-1">←</span> Volver al catálogo
            </button>

            ${createQuery(
                `book-${bookId}`,
                () => bookRepository.getById(bookId),
                BookDetails,
                { fallback: Spinner() }
            )}
        </div>
    `;
}
