import type { AuthUser, LoginCredentials, Book, Reservation } from "../../shared/types/models";

export interface AuthRepository {
    login(credentials: LoginCredentials): Promise<AuthUser>;
}

export interface BookRepository {
    getAll(search?: string): Promise<Book[]>;
    getById(id: number): Promise<Book | null>;
    create(book: Omit<Book, "id">): Promise<Book>;
    update(id: number, data: Partial<Book>): Promise<Book>;
}

export interface ReservationRepository {
    getAll(): Promise<Reservation[]>;
    getByUser(userId: number): Promise<Reservation[]>;
    create(userId: number, bookId: number): Promise<Reservation>;
    cancel(reservationId: number): Promise<void>;
    confirmLoan(reservationId: number): Promise<void>;
    returnBook(reservationId: number): Promise<void>;
}
