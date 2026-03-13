import type { BookRepository } from "./repository.interface";
import type { Book } from "../../shared/types/models";
import { MOCK_BOOKS } from "../mock/books.mock";

// Simple delay function to simulate network
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Using a local copy to allow mutations in memory during session
let books = [...MOCK_BOOKS];

export const bookRepository: BookRepository = {
    async getAll(search?: string): Promise<Book[]> {
        await delay(300);
        if (!search) return books;
        const query = search.toLowerCase();
        return books.filter(
            b => b.title.toLowerCase().includes(query) || 
                 b.author.toLowerCase().includes(query)
        );
    },

    async getById(id: number): Promise<Book | null> {
        await delay(200);
        return books.find(b => b.id === id) || null;
    },

    async create(data: Omit<Book, "id">): Promise<Book> {
        await delay(500);
        const newBook: Book = {
            ...data,
            id: Math.max(...books.map(b => b.id)) + 1
        };
        books.push(newBook);
        return newBook;
    },

    async update(id: number, data: Partial<Book>): Promise<Book> {
        await delay(400);
        const index = books.findIndex(b => b.id === id);
        if (index === -1) throw new Error("Libro no encontrado");
        books[index] = { ...books[index], ...data };
        return books[index];
    },
};
