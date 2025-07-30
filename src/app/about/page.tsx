import { Container } from '@/components/layout/Container';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "社团创始人",
      role: "技术领导者",
      description: "专注于深度学习和计算机视觉研究",
      avatar: "TC"
    },
    {
      name: "技术导师",
      role: "AI专家",
      description: "在机器学习领域有丰富的教学经验",
      avatar: "TM"
    },
    {
      name: "社团成员",
      role: "前端开发",
      description: "热爱Web开发和用户体验设计",
      avatar: "FE"
    },
    {
      name: "社团成员",
      role: "数据科学",
      description: "专注于数据分析和机器学习应用",
      avatar: "DS"
    }
  ];

  const milestones = [
    {
      year: "2023年9月",
      title: "社团成立",
      description: "高中AI社团正式成立，开始招募第一批成员"
    },
    {
      year: "2023年10月",
      title: "第一次技术分享",
      description: "举办了第一次AI技术分享会，吸引了50多名同学参与"
    },
    {
      year: "2023年12月",
      title: "项目实践启动",
      description: "启动第一个实战项目：智能校园助手"
    },
    {
      year: "2024年3月",
      title: "技术博客平台",
      description: "建立了社团技术博客平台，成员开始分享学习心得"
    },
    {
      year: "2024年现在",
      title: "持续发展",
      description: "社团已有30多名活跃成员，定期举办技术活动"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              关于我们
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              我们是一群热爱人工智能的高中生，致力于在校园中推广AI技术，培养同学们的创新思维和实践能力
            </p>
          </div>

          {/* 使命愿景 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-monet-blue to-monet-purple rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground mb-4">我们的使命</h2>
              <p className="text-muted-foreground leading-relaxed">
                为高中生提供学习人工智能的平台，通过技术分享、项目实践和学术交流，
                培养下一代AI人才，让更多同学了解和掌握前沿技术。
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-monet-green to-monet-blue rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground mb-4">我们的愿景</h2>
              <p className="text-muted-foreground leading-relaxed">
                成为学校最活跃的技术社团，建立完善的AI学习体系，
                培养具有创新精神的年轻开发者，为未来的科技发展贡献力量。
              </p>
            </div>
          </div>

          {/* 核心价值 */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">核心价值</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-monet-blue to-monet-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">学习分享</h3>
                <p className="text-muted-foreground">
                  鼓励每个成员分享知识，互相学习，共同进步
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-monet-green to-monet-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">创新实践</h3>
                <p className="text-muted-foreground">
                  通过实际项目锻炼能力，培养创新思维和解决问题的能力
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-monet-purple to-monet-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">团队协作</h3>
                <p className="text-muted-foreground">
                  重视团队合作，培养良好的沟通能力和协作精神
                </p>
              </div>
            </div>
          </div>

          {/* 团队成员 */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">核心团队</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-monet-green to-monet-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{member.avatar}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-1">{member.name}</h3>
                  <p className="text-monet-blue text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 发展历程 */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">发展历程</h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-16 bg-gradient-to-r from-monet-blue to-monet-purple rounded-xl flex items-center justify-center">
                      <span className="text-white font-medium text-sm text-center">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-card border border-border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 联系我们 */}
          <div className="bg-gradient-to-r from-monet-blue to-monet-purple rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">加入我们</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              如果你对人工智能充满热情，想要与同龄人一起学习成长，欢迎加入我们的社团！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/auth"
                className="bg-white text-monet-blue px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                立即注册
              </a>
              <a
                href="mailto:ai-club@school.edu"
                className="border border-white/30 text-white px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
