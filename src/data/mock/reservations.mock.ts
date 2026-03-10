import type { Reservation } from "../../shared/types/models";

export const MOCK_RESERVATIONS: Reservation[] = [
    {
        id: 1,
        userId: 1,
        bookId: 1,
        bookTitle: "Cien años de soledad",
        bookAuthor: "Gabriel García Márquez",
        requestDate: "2026-02-15T10:30:00",
        returnDate: "2026-03-01T09:00:00",
        status: "RETURNED",
    },
    {
        id: 2,
        userId: 1,
        bookId: 5,
        bookTitle: "Hábitos Atómicos",
        bookAuthor: "James Clear",
        requestDate: "2026-03-01T14:00:00",
        returnDate: null,
        status: "BORROWED",
    },
    {
        id: 3,
        userId: 2,
        bookId: 6,
        bookTitle: "Clean Code",
        bookAuthor: "Robert C. Martin",
        requestDate: "2026-02-20T08:00:00",
        returnDate: null,
        status: "RESERVED",
    },
    {
        id: 4,
        userId: 1,
        bookId: 3,
        bookTitle: "Don Quijote de la Mancha",
        bookAuthor: "Miguel de Cervantes",
        requestDate: "2026-03-05T16:45:00",
        returnDate: null,
        status: "RESERVED",
    },
];

let _nextId = MOCK_RESERVATIONS.length + 1;
export function getNextReservationId(): number {
    return _nextId++;
}
