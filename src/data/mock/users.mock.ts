import type { User } from "../../shared/types/models";

export const MOCK_USERS: (User & { password: string })[] = [
    {
        id: 1,
        name: "Carlos Mendoza",
        email: "carlos@unicolombo.edu.co",
        role: "STUDENT",
        password: "123456",
    },
    {
        id: 2,
        name: "María López",
        email: "maria@unicolombo.edu.co",
        role: "TEACHER",
        password: "123456",
    },
    {
        id: 3,
        name: "Admin Sistema",
        email: "admin@unicolombo.edu.co",
        role: "ADMIN",
        password: "admin123",
    },
];
