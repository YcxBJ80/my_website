"use client"

import { email, socialLinks } from '@/config/infoConfig'
import { utm_source } from '@/config/siteConfig'
import Link from 'next/link'
import { CustomIcon } from '@/components/shared/CustomIcon'
import { cn } from '@/lib/utils'

export default function SocialLinks({ className }: { className?: string }) {
    return (
        <div className={cn("mt-6 flex items-center", className)}>
            {socialLinks.map((link) => (
                <Link
                    key={link.name}
                    href={`${link.url}?utm_source=${utm_source}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Follow on ${link.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-morandi-gray-dark hover:bg-morandi-gray-light hover:text-morandi-gray-dark transition-colors"
                >
                    <CustomIcon name={link.icon} />
                    <span className="sr-only">{link.name}</span>
                </Link>
            ))}
            <Link
                href={`mailto:${email}`}
                target="_blank"
                rel="noreferrer"
                aria-label='Email'
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-morandi-gray-dark hover:bg-morandi-gray-light hover:text-morandi-gray-dark transition-colors"
            >
                <CustomIcon name='email' />
                <span className="sr-only">Email</span>
            </Link>
        </div>
    )
}