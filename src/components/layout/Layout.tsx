import Link from 'next/link'
import { AuthButton } from '@/components/auth/AuthButton'


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fullscreen-layout ai-gradient-bg">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-monet-blue to-monet-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-semibold text-lg">AI Community</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/blogs" className="text-gray-300 hover:text-monet-blue transition-colors">
                Blog
              </Link>
              <Link href="/blogs/create" className="text-gray-300 hover:text-monet-green transition-colors">
                Publish
              </Link>
              <Link href="/projects" className="text-gray-300 hover:text-monet-green transition-colors">
                Projects
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-monet-purple transition-colors">
                About
              </Link>
              <AuthButton />
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content Area */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  )
}
