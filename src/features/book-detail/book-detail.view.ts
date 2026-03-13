import { html, signal, createQuery, invalidateQueries, useRouter, NixComponent } from "@deijose/nix-js";
import { bookRepository } from "../../data/repositories/book.repository";
import { reservationRepository } from "../../data/repositories/reservation.repository";
import { userId, isLoggedIn } from "../../core/auth/auth.store";
import { showToast } from "../../shared/components/toast.component";
import type { Reservation } from "../../shared/types/models";
import { setPendingRedirect } from "../../core/auth/auth.guard";
import { Spinner } from "../../shared/components/spinner.component";
import { EmptyState } from "../../shared/components/empty-state.component";

export class BookDetailView extends NixComponent {
    private router = useRouter();
    private bookId = Number(this.router.params.value.id);
    
    loading = signal(false);
    checkingStatus = signal(isLoggedIn.value); // True initially if logged in
    reserved = signal(false);
    postReserveStock = signal<number | null>(null);
    userHasActiveInfo = signal<Reservation | null>(null);

    private handleGoBack = () => { this.router.navigate("/home"); };
    private handleGoLoans = () => { this.router.navigate("/my-loans"); };
    private handleGoHome = () => { this.router.navigate("/home"); };

    private NotFound = () => EmptyState({
        icon: "🔍",
        message: "Libro no encontrado",
        action: { label: "Ir al catálogo", onClick: this.handleGoBack },
    });

    private checkActiveStatus = async (bookId: number) => {
        const uid = userId.value;
        if (!uid) {
            this.checkingStatus.value = false;
            return;
        }
        
        this.checkingStatus.value = true;
        try {
            const list = await reservationRepository.getByUser(uid);
            this.userHasActiveInfo.value = list.find(
                (r: Reservation) => r.bookId === bookId && (r.status === "RESERVED" || r.status === "BORROWED")
            ) || null;
        } catch (e) {
            console.error("Error checking status", e);
        } finally {
            this.checkingStatus.value = false;
        }
    };

    private handleLoginRedirect = (bookId: number) => {
        setPendingRedirect(`/book/${bookId}`);
        showToast("Inicia sesión para reservar", "info");
        this.router.navigate("/login");
    };

    private handleReserve = async (book: any) => {
        const uid = userId.value;
        if (!uid) return;
        
        this.loading.value = true;
        try {
            await reservationRepository.create(uid, book.id);
            const currentStock = this.postReserveStock.value !== null ? this.postReserveStock.value : book.stock;
            this.postReserveStock.value = currentStock - 1;
            this.reserved.value = true;
            
            invalidateQueries("books");
            invalidateQueries(`my-loans-${uid}`);
            invalidateQueries(`book-${book.id}`);
            invalidateQueries(`user-reservations-${uid}`);
            
            showToast("¡Reserva exitosa! 🎉", "success");
            await this.checkActiveStatus(book.id);
        } catch (err) {
            showToast(
                err instanceof Error ? err.message : "Error al reservar",
                "error",
            );
        } finally {
            this.loading.value = false;
        }
    };

    onInit() {
        if (isLoggedIn.value) {
            this.checkActiveStatus(this.bookId);
        }
    }

    private BookDetails = (book: any) => {
        if (!book) return this.NotFound();

        const liveStock = () =>
            this.postReserveStock.value !== null ? this.postReserveStock.value : book.stock;

        const ActionButtons = () => {
            if (this.checkingStatus.value) {
                return html`
                    <div class="h-[120px] flex items-center">
                        <div class="flex items-center gap-3 text-gray-400">
                            <span class="w-5 h-5 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></span>
                            <span class="text-xs font-black uppercase tracking-widest">Verificando estado...</span>
                        </div>
                    </div>
                `;
            }

            const ar = this.userHasActiveInfo.value;

            if (this.reserved.value || ar) {
                const statusLabel = ar?.status === "BORROWED" ? "prestado" : "reservado";
                return html`
                    <div class="mt-10 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-left">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="text-2xl">${ar?.status === "BORROWED" ? "📖" : "🔖"}</span>
                            <div>
                                <p class="text-indigo-900 font-black tracking-tight leading-none">Ya tienes este libro</p>
                                <p class="text-indigo-600/70 text-xs font-bold uppercase tracking-widest mt-1">Estado: ${statusLabel}</p>
                            </div>
                        </div>
                        <p class="text-gray-600 text-sm leading-relaxed mb-6">
                            Ya cuentas con una gestión activa para este título. No es posible realizar múltiples reservas del mismo libro simultáneamente.
                        </p>
                        <div class="flex flex-wrap gap-3">
                            <button
                                class="px-6 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all cursor-pointer"
                                @click=${this.handleGoLoans}
                            >📋 Mis Préstamos</button>
                            <button
                                class="px-6 py-3 bg-white text-gray-700 text-xs font-black uppercase tracking-widest rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                                @click=${this.handleGoHome}
                            >📚 Catálogo</button>
                        </div>
                    </div>
                `;
            }

            if (!isLoggedIn.value) {
                return html`
                    <button
                        class="px-8 py-4 bg-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 active:scale-95 focus:ring-4 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        @click=${() => this.handleLoginRedirect(book.id)}
                    >
                        🔐 Iniciar sesión para reservar
                    </button>
                `;
            }

            return html`
                <div class="flex flex-col gap-3 items-start">
                    <button
                        class=${() => `px-8 py-4 text-sm font-black uppercase tracking-widest rounded-2xl transition-all focus:ring-4 focus:ring-indigo-500/20 ${liveStock() > 0 && !this.loading.value
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 active:scale-95 cursor-pointer"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled=${() => liveStock() <= 0 || this.loading.value}
                        @click=${() => this.handleReserve(book)}
                    >
                        ${() => this.loading.value
                            ? html`<span class="flex items-center gap-3"><span class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span> PROCESANDO...</span>`
                            : html`<span>📚 Confirmar Reserva</span>`
                        }
                    </button>
                    ${() => liveStock() <= 0
                        ? html`<p class="text-center text-[10px] font-black uppercase tracking-[0.2em] text-red-500 animate-pulse mt-2">Inventario agotado temporalmente</p>`
                        : html`<span></span>`
                    }
                </div>
            `;
        };

        return html`
            <div class="mt-10 glass-effect rounded-3xl shadow-xl overflow-hidden border border-white/40">
                <div class="md:flex">
                    <div class="md:w-1/3 bg-gray-50 flex items-center justify-center p-12 min-h-[400px] relative">
                        ${book.cover
                            ? html`<img src=${book.cover} alt=${book.title} class="max-h-96 rounded-xl shadow-2xl z-10" />`
                            : html`<span class="text-9xl drop-shadow-xl z-10">📖</span>`
                        }
                    </div>
                    <div class="md:w-2/3 p-10 md:p-14 text-left">
                        <div class="flex items-start justify-between gap-6 mb-4">
                            <div>
                                <h1 class="text-4xl font-black text-gray-900 tracking-tight leading-tight">${book.title}</h1>
                                <p class="text-xl text-indigo-600 font-bold mt-2">${book.author}</p>
                            </div>
                            <span class=${() => `shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${liveStock() > 0 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-red-50 text-red-700 border-red-200"}`}>
                                ${() => liveStock() > 0 ? "● Disponible" : "○ Agotado"}
                            </span>
                        </div>

                        <div class="flex flex-wrap gap-8 text-sm text-gray-500 py-6 border-y border-gray-100 my-8">
                            <div class="flex flex-col">
                                <span class="uppercase tracking-widest text-[10px] font-black text-gray-400 mb-1">Editorial</span>
                                <span class="font-bold text-gray-700">${book.publisher}</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="uppercase tracking-widest text-[10px] font-black text-gray-400 mb-1">Existencias</span>
                                <span class="font-bold text-gray-700">${() => liveStock()} copia${() => liveStock() !== 1 ? "s" : ""}</span>
                            </div>
                        </div>

                        ${book.synopsis
                            ? html`
                                <div class="mb-10">
                                    <h3 class="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Sinopsis</h3>
                                    <p class="text-gray-600 leading-relaxed text-lg">${book.synopsis}</p>
                                </div>
                            `
                            : html`<span></span>`
                        }

                        <div class="pt-4">
                            ${ActionButtons()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    render() { 
        return html`
        <div class="mt-20 relative min-h-screen bg-transparent pt-10 pb-20">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-left">
                    <button
                        class="group mb-12 text-gray-500 hover:text-indigo-600 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer bg-white/50 px-4 py-2 rounded-full border border-gray-200 hover:border-indigo-200"
                        @click=${this.handleGoBack}
                    >
                        <span class="inline-block transition-transform group-hover:-translate-x-1">←</span> Volver al catálogo
                    </button>
                </div>

                ${() => createQuery(
                    `book-${this.bookId}`,
                    () => bookRepository.getById(this.bookId),
                    this.BookDetails,
                    { fallback: html`<div class="py-40 flex justify-center">${Spinner()}</div>` }
                )}
            </div>
        </div>
        `;
    }
}
