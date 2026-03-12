import type { ReservationRepository } from "./repository.interface";
import type { Reservation } from "../../shared/types/models";
import { httpClient } from "../../core/http/http.client";

function mapApiReservation(r: any): Reservation {
    return {
        id: r.id,
        userId: r.userId,
        bookId: r.bookId,
        bookTitle: r.Book?.title || r.bookTitle || "",
        bookAuthor: r.Book?.author || r.bookAuthor || "",
        requestDate: new Date(r.requestAt || r.requestDate).toISOString(),
        returnDate: r.returnAt ? new Date(r.returnAt).toISOString() : null,
        status: r.status,
    };
}

export const reservationRepository: ReservationRepository = {
    async getAll(): Promise<Reservation[]> {
        const res = await httpClient.get<any[]>("/reservations");
        return res.data.map(mapApiReservation);
    },

    async getByUser(userId: number): Promise<Reservation[]> {
        const res = await httpClient.get<any[]>(`/reservations/user/${userId}`);
        return res.data.map(mapApiReservation);
    },

    async create(userId: number, bookId: number): Promise<Reservation> {
        await httpClient.post("/reservations", { userId, bookId });
        const list = await this.getByUser(userId);
        // return the most recent reservation
        return list.sort((a, b) => (a.requestDate < b.requestDate ? 1 : -1))[0];
    },

    async cancel(reservationId: number): Promise<void> {
        await httpClient.post(`/reservations/${reservationId}/cancel`);
    },

    async confirmLoan(reservationId: number): Promise<void> {
        await httpClient.post(`/reservations/${reservationId}/confirm`);
    },

    async returnBook(reservationId: number): Promise<void> {
        await httpClient.post(`/reservations/${reservationId}/return`);
    },
};
