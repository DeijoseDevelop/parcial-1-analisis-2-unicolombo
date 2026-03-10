export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface AuthUser extends User {
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    stock: number;
    cover?: string;
    synopsis?: string;
}

export type ReservationStatus = "RESERVED" | "BORROWED" | "RETURNED" | "CANCELLED";

export interface Reservation {
    id: number;
    userId: number;
    bookId: number;
    bookTitle: string;
    bookAuthor: string;
    requestDate: string;
    returnDate: string | null;
    status: ReservationStatus;
}
