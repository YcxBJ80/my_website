'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { getCurrentUser } from '@/lib/auth';
import { formatDate } from '@/lib/formatDate';
import { TextType } from '@/components/ui/text-type';
import { SquaresBackground } from '@/components/ui/squares-background';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface BlogType {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  slug: string;
  tags?: string[];
}

interface ProjectType {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  tags?: string[];
}

export default function HomePage() {
  const [recentBlogs, setRecentBlogs] = useState<BlogType[]>([]);
  const [recentProjects] = useState<ProjectType[]>([
    {
      id: '1',
      title: 'AI Image Recognition',
      description: 'A deep learning model for real-time image classification using TensorFlow',
      tags: ['Python', 'TensorFlow', 'Computer Vision']
    },
    {
      id: '2', 
      title: 'Natural Language Chatbot',
      description: 'An intelligent chatbot powered by transformer models and NLP',
      tags: ['Python', 'NLP', 'Transformers']
    },
    {
      id: '3',
      title: 'Data Analysis Platform',
      description: 'Interactive data visualization and analysis tool for students',
      tags: ['Python', 'Pandas', 'Streamlit']
    }
  ]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSecondaryText, setShowSecondaryText] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    loadRecentBlogs();
  }, []);

  const loadRecentBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const blogs = await response.json();
        setRecentBlogs(blogs.slice(0, 3));
      } else {
        console.error('Failed to fetch blogs:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayAuthor = (author: string) => {
    if (!author) return 'Anonymous';
    
    // Remove role information in parentheses (like "ycx (管理)" -> "ycx")
    const cleanAuthor = author.replace(/\s*\([^)]*\)/g, '').trim();
    
    // Handle email format
    if (cleanAuthor.includes('@')) {
      const username = cleanAuthor.split('@')[0];
      return username.length > 12 ? username.substring(0, 12) + '...' : username;
    }
    
    // Truncate long usernames
    if (cleanAuthor.length > 12) {
      return cleanAuthor.substring(0, 12) + '...';
    }
    
    return cleanAuthor;
  };

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Tech Blog',
      description: 'Share AI learning insights, project experiences and cutting-edge tech news',
      color: 'from-monet-blue to-monet-purple'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Community',
      description: 'Connect with fellow students to discuss AI topics and share resources',
      color: 'from-monet-green to-monet-blue'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Projects',
      description: 'Participate in AI project development and enhance practical skills',
      color: 'from-monet-purple to-monet-pink'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Innovation',
      description: 'Stay ahead with the latest AI trends and technological developments',
      color: 'from-monet-yellow to-monet-green'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Animated Background */}
      <section className="relative py-20 lg:py-32 overflow-hidden min-h-screen flex flex-col">
        <div className="absolute inset-0">
          <SquaresBackground 
            direction="diagonal" 
            speed={0.5} 
            borderColor="rgba(79, 70, 229, 0.3)" 
            squareSize={60} 
            hoverFillColor="rgba(79, 70, 229, 0.1)"
            className="opacity-80"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-monet-blue/5 via-transparent to-monet-purple/5"></div>
        
        <Container className="relative z-10 flex-1 flex flex-col">
          {/* Top Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-monet-blue/20 text-monet-blue rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Welcome to BJ80 AI
            </div>
          </div>

          {/* Centered Title */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
                <TextType 
                  text="Welcome to BJ80 AI"
                  speed={120}
                  className="bg-gradient-to-r from-monet-blue to-monet-purple bg-clip-text text-transparent"
                  onComplete={() => setShowSecondaryText(true)}
                />
              </h1>
            </div>
          </div>
        </Container>

        {/* Bottom Left Content - 移到 section 内但在 Container 外 */}
        {showSecondaryText && (
          <div className="absolute bottom-20 left-8 right-8 max-w-2xl z-20 lg:right-auto">
            <ScrollReveal>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                Join our high school AI club to learn cutting-edge technology, share project experiences, and build an intelligent world for the future
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                {user ? (
                  <Link
                    href="/blogs"
                    className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20 text-base md:text-lg text-center"
                  >
                    Browse Blogs
                  </Link>
                ) : (
                  <Link
                    href="/auth"
                    className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20 text-base md:text-lg text-center"
                  >
                    Join Now
                  </Link>
                )}
                <Link
                  href="/about"
                  className="border border-border text-foreground px-6 md:px-8 py-3 md:py-4 rounded-xl font-medium hover:bg-accent transition-all duration-300 text-base md:text-lg text-center"
                >
                  Learn More
                </Link>
              </div>
            </ScrollReveal>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/20">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What We Offer
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get a comprehensive AI learning experience, from theory to practice, from personal growth to team collaboration
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Recent Blogs Section */}
      <section className="py-20">
        <Container>
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Recent Articles
                </h2>
                <p className="text-lg text-muted-foreground">
                  Latest tech articles and insights shared by our club members
                </p>
              </div>
              <Link
                href="/blogs"
                className="mt-6 md:mt-0 inline-flex items-center text-monet-blue hover:text-monet-blue-dark transition-colors font-medium"
              >
                View All
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : recentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {recentBlogs.map((blog, index) => (
                <ScrollReveal key={blog.slug} delay={index * 100}>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="block bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-monet-blue/10 transition-all duration-300 group hover:-translate-y-1 hover:border-monet-blue/30 h-full flex flex-col"
                  >
                    {/* Date and Author */}
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(blog.date)}</span>
                      <span className="mx-2">•</span>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="truncate" title={blog.author}>
                        {getDisplayAuthor(blog.author)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-monet-blue transition-colors line-clamp-2 leading-tight flex-1">
                      {blog.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
                      {blog.description}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-monet-blue/10 text-monet-blue rounded-full border border-monet-blue/20"
                          >
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs text-muted-foreground">
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Articles Yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to publish a tech article!</p>
                {user && (
                  <Link
                    href="/blogs/create"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-monet-blue to-monet-purple text-white rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20"
                  >
                    Publish Article
                  </Link>
                )}
              </div>
            </ScrollReveal>
          )}
        </Container>
      </section>

      {/* Recent Projects Section */}
      <section className="py-20 bg-accent/20">
        <Container>
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Recent Projects
                </h2>
                <p className="text-lg text-muted-foreground">
                  Innovative AI projects developed by our club members
                </p>
              </div>
              <Link
                href="/projects"
                className="mt-6 md:mt-0 inline-flex items-center text-monet-blue hover:text-monet-blue-dark transition-colors font-medium"
              >
                View All
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {recentProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 100}>
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-monet-blue/10 transition-all duration-300 group hover:-translate-y-1 hover:border-monet-blue/30 h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-monet-blue transition-colors flex-1">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {project.description}
                  </p>
                  {project.tags && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-monet-blue/10 text-monet-blue rounded-md border border-monet-blue/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
