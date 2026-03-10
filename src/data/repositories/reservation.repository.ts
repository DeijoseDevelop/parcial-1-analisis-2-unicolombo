import type { ReservationRepository } from "./repository.interface";
import type { Reservation } from "../../shared/types/models";
import { MOCK_RESERVATIONS, getNextReservationId } from "../mock/reservations.mock";
import { MOCK_BOOKS } from "../mock/books.mock";
import { delay } from "../../shared/utils/delay";

const reservations = [...MOCK_RESERVATIONS];

export const reservationRepository: ReservationRepository = {
    async getAll(): Promise<Reservation[]> {
        return delay([...reservations]);
    },

    async getByUser(userId: number): Promise<Reservation[]> {
        const result = reservations.filter((r) => r.userId === userId);
        return delay([...result]);
    },

    async create(userId: number, bookId: number): Promise<Reservation> {
        await delay(null, 300);

        const activeCount = reservations.filter(
            (r) =>
                r.userId === userId &&
                (r.status === "RESERVED" || r.status === "BORROWED"),
        ).length;

        if (activeCount >= 5) {
            throw new Error("Has alcanzado el límite máximo de 5 libros reservados/prestados.");
        }

        const book = MOCK_BOOKS.find((b) => b.id === bookId);
        if (!book) throw new Error("Libro no encontrado.");
        if (book.stock <= 0) throw new Error("No hay copias disponibles de este libro.");

        book.stock--;

        const reservation: Reservation = {
            id: getNextReservationId(),
            userId,
            bookId,
            bookTitle: book.title,
            bookAuthor: book.author,
            requestDate: new Date().toISOString(),
            returnDate: null,
            status: "RESERVED",
        };

        reservations.push(reservation);
        return reservation;
    },

    async cancel(reservationId: number): Promise<void> {
        await delay(null, 300);
        const idx = reservations.findIndex((r) => r.id === reservationId);
        if (idx === -1) throw new Error("Reserva no encontrada.");

        const reservation = reservations[idx];
        if (reservation.status !== "RESERVED") {
            throw new Error("Solo se pueden cancelar reservas en estado RESERVED.");
        }

        reservation.status = "CANCELLED";

        const book = MOCK_BOOKS.find((b) => b.id === reservation.bookId);
        if (book) book.stock++;
    },

    async confirmLoan(reservationId: number): Promise<void> {
        await delay(null, 300);
        const reservation = reservations.find((r) => r.id === reservationId);
        if (!reservation) throw new Error("Reserva no encontrada.");
        if (reservation.status !== "RESERVED") {
            throw new Error("Solo se pueden confirmar préstamos en estado RESERVED.");
        }
        reservation.status = "BORROWED";
    },

    async returnBook(reservationId: number): Promise<void> {
        await delay(null, 300);
        const reservation = reservations.find((r) => r.id === reservationId);
        if (!reservation) throw new Error("Reserva no encontrada.");
        if (reservation.status !== "BORROWED") {
            throw new Error("Solo se pueden devolver libros en estado BORROWED.");
        }
        reservation.status = "RETURNED";
        reservation.returnDate = new Date().toISOString();

        const book = MOCK_BOOKS.find((b) => b.id === reservation.bookId);
        if (book) book.stock++;
    },
};
