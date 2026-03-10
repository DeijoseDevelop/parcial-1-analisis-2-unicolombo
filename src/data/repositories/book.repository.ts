import type { BookRepository } from "./repository.interface";
import type { Book } from "../../shared/types/models";
import { MOCK_BOOKS } from "../mock/books.mock";
import { delay } from "../../shared/utils/delay";

const books = [...MOCK_BOOKS];
let nextId = books.length + 1;

export const bookRepository: BookRepository = {
    async getAll(search?: string): Promise<Book[]> {
        let result = books;
        if (search) {
            const q = search.toLowerCase();
            result = books.filter(
                (b) =>
                    b.title.toLowerCase().includes(q) ||
                    b.author.toLowerCase().includes(q),
            );
        }
        return delay([...result]);
    },

    async getById(id: number): Promise<Book | null> {
        const book = books.find((b) => b.id === id);
        return delay(book ?? null);
    },

    async create(data: Omit<Book, "id">): Promise<Book> {
        const book: Book = { ...data, id: nextId++ };
        books.push(book);
        return delay(book);
    },

    async update(id: number, data: Partial<Book>): Promise<Book> {
        const idx = books.findIndex((b) => b.id === id);
        if (idx === -1) throw new Error("Libro no encontrado");
        books[idx] = { ...books[idx], ...data };
        return delay(books[idx]);
    },
};
