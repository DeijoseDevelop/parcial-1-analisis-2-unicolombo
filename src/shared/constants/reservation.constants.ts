import type { ReservationStatus } from "../types/models";

export const STATUS_BADGE: Record<ReservationStatus, string> = {
    RESERVED: "bg-yellow-100 text-yellow-800",
    BORROWED: "bg-blue-100 text-blue-800",
    RETURNED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-500",
};

export const STATUS_LABEL: Record<ReservationStatus, string> = {
    RESERVED: "Reservado",
    BORROWED: "Prestado",
    RETURNED: "Devuelto",
    CANCELLED: "Cancelado",
};
