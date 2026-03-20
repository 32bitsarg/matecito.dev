import * as React from "react";
import { cn } from "@/lib/utils";

// Definimos las propiedades del Componente, extendiendo las de un botón HTML estándar
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-white",

                    // Variants
                    variant === "default" && "bg-[var(--accent)] text-[var(--background)] hover:opacity-90 hover:shadow-lg",
                    variant === "outline" && "border border-[var(--foreground)] bg-transparent text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]",
                    variant === "ghost" && "hover:bg-[var(--foreground)]/10 text-[var(--foreground)]",
                    variant === "link" && "text-[var(--accent)] underline-offset-4 hover:underline",

                    // Sizes
                    size === "default" && "h-10 px-6 py-2",
                    size === "sm" && "h-8 px-4 text-xs",
                    size === "lg" && "h-14 px-8 text-base",
                    size === "icon" && "h-9 w-9",

                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
