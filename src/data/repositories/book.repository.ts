import type { BookRepository } from "./repository.interface";
import type { Book } from "../../shared/types/models";
import { httpClient } from "../../core/http/http.client";

export const bookRepository: BookRepository = {
    async getAll(search?: string): Promise<Book[]> {
        const res = await httpClient.get<Book[]>("/books", { params: { q: search } });
        return res.data;
    },

    async getById(id: number): Promise<Book | null> {
        const res = await httpClient.get<Book>(`/books/${id}`);
        return res.data ?? null;
    },

    async create(data: Omit<Book, "id">): Promise<Book> {
        const res = await httpClient.post<Book>("/books", data);
        return res.data;
    },

    async update(id: number, data: Partial<Book>): Promise<Book> {
        const res = await httpClient.put<Book>(`/books/${id}`, data);
        return res.data;
    },
};
