import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-morandi-blue text-white shadow hover:bg-morandi-blue-dark",
        destructive:
          "bg-morandi-pink text-white shadow-sm hover:bg-morandi-pink-dark",
        outline:
          "border border-morandi-gray bg-background shadow-sm hover:bg-morandi-gray-light hover:text-morandi-gray-dark",
        secondary:
          "bg-morandi-green text-white shadow-sm hover:bg-morandi-green-dark",
        ghost: "hover:bg-morandi-gray-light hover:text-morandi-gray-dark",
        link: "text-morandi-blue underline-offset-4 hover:underline",
        // 新增莫兰迪色系变体
        morandiBlue: "bg-morandi-blue text-white shadow hover:bg-morandi-blue-dark",
        morandiGreen: "bg-morandi-green text-white shadow hover:bg-morandi-green-dark",
        morandiPurple: "bg-morandi-purple text-white shadow hover:bg-morandi-purple-dark",
        morandiPink: "bg-morandi-pink text-white shadow hover:bg-morandi-pink-dark",
        morandiYellow: "bg-morandi-yellow text-white shadow hover:bg-morandi-yellow-dark",
        morandiGray: "bg-morandi-gray text-white shadow hover:bg-morandi-gray-dark",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
