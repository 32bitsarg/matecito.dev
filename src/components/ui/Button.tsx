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
                    variant === "default" && "bg-black text-white hover:bg-zinc-800 hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-zinc-200",
                    variant === "outline" && "border border-black bg-transparent text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black",
                    variant === "ghost" && "hover:bg-black/5 dark:hover:bg-white/5",
                    variant === "link" && "text-black underline-offset-4 hover:underline dark:text-white",

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
