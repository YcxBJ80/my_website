import Link from 'next/link'
import { AuthButton } from '@/components/auth/AuthButton'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fullscreen-layout ai-gradient-bg">
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo和标题 */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-monet-blue to-monet-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-semibold text-lg">高中AI社团</span>
            </Link>
            
            {/* 导航链接 */}
            <div className="hidden md:flex items-center space-x-8">
                                 <Link href="/blogs" className="text-gray-300 hover:text-monet-blue transition-colors">
                     博客
                   </Link>
                   <Link href="/blogs/create" className="text-gray-300 hover:text-monet-green transition-colors">
                     发布
                   </Link>
              <Link href="/projects" className="text-gray-300 hover:text-monet-green transition-colors">
                项目
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-monet-purple transition-colors">
                关于我们
              </Link>
              <AuthButton />
            </div>
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>
      
      {/* 主要内容区域 */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>
      
      {/* 底部信息 */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 高中AI社团. 探索人工智能的无限可能</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
