import React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

const spinnerVariants = cva("flex-col items-center justify-center", {
    variants: {
        show: {
            true: "flex",
            false: "hidden"
        }
    },
    defaultVariants: {
        show: true
    }
})

const loaderVariants = cva("animate-spin text-primary", {
    variants: {
        size: {
            xsmall: "size-5",
            small: "size-6",
            medium: "size-8",
            large: "size-12",
            xlarge: "size-32",
        }
    },
    defaultVariants: {
        size: "medium"
    }
})

export function Spinner({ size, show, children, className }) {
    return (
        <span className={spinnerVariants({ show })}>
            <Loader2 className={cn(loaderVariants({ size }), className)} />
            {children}
        </span>
    )
}
