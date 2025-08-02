import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-morandi-blue font-semibold text-white hover:bg-morandi-blue-dark active:bg-morandi-blue active:text-white/90',
  secondary:
    'bg-morandi-gray-light font-medium text-morandi-gray-dark hover:bg-morandi-gray active:bg-morandi-gray-light active:text-morandi-gray-dark/90',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
} & (
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
    variantStyles[variant],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
