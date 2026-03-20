/**
 * Convierte un texto en un slug amigable para URLs.
 * Ejemplo: "Mi Proyecto" -> "mi-proyecto"
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Espacios a guiones
        .replace(/[^\w-]+/g, '')  // Quitar caracteres no alfanuméricos
        .replace(/--+/g, '-')     // Quitar múltiples guiones
}

/**
 * Helper para clases condicionales (si ya usas clsx/tailwind-merge)
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
