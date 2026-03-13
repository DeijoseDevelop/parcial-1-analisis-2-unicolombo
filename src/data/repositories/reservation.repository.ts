import type { ReservationRepository } from "./repository.interface";
import type { Reservation } from "../../shared/types/models";
import { MOCK_RESERVATIONS, getNextReservationId } from "../mock/reservations.mock";
import { MOCK_BOOKS } from "../mock/books.mock";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let reservations = [...MOCK_RESERVATIONS];

export const reservationRepository: ReservationRepository = {
    async getAll(): Promise<Reservation[]> {
        await delay(300);
        return reservations;
    },

    async getByUser(userId: number): Promise<Reservation[]> {
        await delay(300);
        return reservations.filter(r => r.userId === userId);
    },

    async create(userId: number, bookId: number): Promise<Reservation> {
        await delay(500);
        const book = MOCK_BOOKS.find(b => b.id === bookId);
        if (!book) throw new Error("Libro no encontrado");

        const newReservation: Reservation = {
            id: getNextReservationId(),
            userId,
            bookId,
            bookTitle: book.title,
            bookAuthor: book.author,
            requestDate: new Date().toISOString(),
            status: "RESERVED",
        };
        reservations.push(newReservation);
        return newReservation;
    },

    async cancel(reservationId: number): Promise<void> {
        await delay(300);
        const index = reservations.findIndex(r => r.id === reservationId);
        if (index !== -1) {
            reservations[index] = { ...reservations[index], status: "CANCELLED" };
        }
    },

    async confirmLoan(reservationId: number): Promise<void> {
        await delay(300);
        const index = reservations.findIndex(r => r.id === reservationId);
        if (index !== -1) {
            reservations[index] = { ...reservations[index], status: "BORROWED" };
        }
    },

    async returnBook(reservationId: number): Promise<void> {
        await delay(300);
        const index = reservations.findIndex(r => r.id === reservationId);
        if (index !== -1) {
            reservations[index] = { 
                ...reservations[index], 
                status: "RETURNED",
                returnDate: new Date().toISOString()
            };
        }
    },
};
