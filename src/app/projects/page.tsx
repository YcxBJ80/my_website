import { type Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { projectHeadLine, projectIntro } from '@/config/infoConfig'

export const metadata: Metadata = {
  title: 'Projects',
  description: projectHeadLine,
}

export default function Projects() {
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              {projectHeadLine}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {projectIntro}
            </p>
          </header>
          
          {/* 暂时展示空状态 */}
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-r from-monet-blue to-monet-purple rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              项目开发中
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              我们正在努力开发各种AI项目，敬请期待！如果你有好的项目想法或想要参与开发，欢迎联系我们。
            </p>
            <div className="mt-8">
              <a
                href="/blogs/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-monet-blue to-monet-purple text-white rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20"
              >
                分享你的项目想法
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
