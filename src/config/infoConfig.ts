export * from './projects'
export * from './education'
export * from './career'

// personal info
export const name = '高中AI社团'
export const headline = '探索人工智能的无限可能'
export const introduction =
  "欢迎来到高中AI社团！我们是一群热爱人工智能的高中生，致力于学习、探索和分享AI技术的最新发展。在这里，我们一起编程、讨论、创新，用AI改变世界。"
export const email = 'ai-club@school.org'
export const githubUsername = 'YcxBJ80'

// about page
export const aboutMeHeadline = '关于我们AI社团'
export const aboutParagraphs = [
  "高中AI社团成立于2024年，是由一群对人工智能充满热情的高中生自发组织的学习社团。我们的目标是为同学们提供一个学习AI技术、交流想法、实践项目的平台。",
  "我们定期举办技术分享会、编程工作坊、AI项目竞赛等活动。社团成员涵盖了从初学者到有经验的程序员，大家互相学习，共同进步。",
  "我们相信，通过学习和应用人工智能技术，每个人都能为这个快速发展的领域贡献自己的力量，并在未来的学习和工作中获得优势。",
]

// blog
export const blogHeadLine = "AI学习笔记与技术分享"
export const blogIntro =
  "分享我们在人工智能学习路上的心得体会、技术教程和项目经验。"

// social links
export type SocialLinkType = {
  name: string
  ariaLabel?: string
  icon: string
  href: string
}

export const socialLinks: Array<SocialLinkType> = [
  {
    name: 'GitHub',
    icon: 'github',
    href: 'https://github.com/YcxBJ80',
  },
  {
    name: 'Bilibili',
    icon: 'bilibili',
    href: 'https://space.bilibili.com/ai-club',
  },
]

// https://simpleicons.org/
export const techIcons = [
  'python',
  'tensorflow',
  'pytorch',
  'jupyter',
  'typescript',
  'javascript',
  'react',
  'nextdotjs',
  'nodedotjs',
  'firebase',
  'vercel',
  'git',
  'github',
  'visualstudiocode',
  'docker',
  'numpy',
  'pandas',
  'scikitlearn',
  'opencv',
  'mysql',
  'postgresql',
]

// project page  
export const projectHeadLine = "AI项目与作品展示"
export const projectIntro =
  "展示我们社团成员开发的AI项目和学习成果。"
