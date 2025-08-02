"use client"

import Link from 'next/link'
import { email, socialLinks } from '@/config/infoConfig'
import { CustomIcon } from '@/components/shared/CustomIcon'


export default function SocialLinks() {
    return (
        <div>
            <div className="mt-6 flex items-center gap-1">
                {socialLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Follow on ${link.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-morandi-gray-dark hover:bg-morandi-gray-light hover:text-morandi-gray-dark transition-colors"
                    >
                        <CustomIcon name={link.icon} />
                        <span className="sr-only">{link.name}</span>
                    </Link>
                ))}
            </div>
            <div className="mt-8 border-t pt-8 ">
                <Link
                    href={`mailto:${email}`}
                    className="group flex flex-row ml-3 justify-start items-center text-md font-medium transition text-morandi-gray-dark hover:text-morandi-blue"
                >
                    <CustomIcon name="email" size={22}/>
                    <span className="ml-4">{email}</span>
                </Link>
            </div>
        </div>

    )
}

