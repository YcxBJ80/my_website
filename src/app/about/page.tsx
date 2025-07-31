import { Container } from '@/components/layout/Container';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Club Founder",
      role: "Technical Leader",
      description: "Focusing on deep learning and computer vision research",
      avatar: "TC"
    },
    {
      name: "Technical Mentor",
      role: "AI Expert",
      description: "Rich teaching experience in machine learning field",
      avatar: "TM"
    },
    {
      name: "Club Member",
      role: "Frontend Developer",
      description: "Passionate about web development and user experience design",
      avatar: "FE"
    },
    {
      name: "Club Member",
      role: "Data Science",
      description: "Focusing on data analysis and machine learning applications",
      avatar: "DS"
    }
  ];

  const milestones = [
    {
      year: "September 2023",
      title: "Club Establishment",
      description: "BJ80 AI Club was officially established and began recruiting the first batch of members"
    },
    {
      year: "October 2023",
      title: "First Tech Sharing",
      description: "Held the first AI tech sharing session, attracting over 50 students to participate"
    },
    {
      year: "December 2023",
      title: "Project Practice Launch",
      description: "Launched the first practical project: Smart Campus Assistant"
    },
    {
      year: "March 2024",
      title: "Tech Blog Platform",
      description: "Established the club's tech blog platform, members began sharing learning insights"
    },
    {
      year: "Now 2024",
      title: "Continuous Development",
      description: "The club now has over 30 active members and regularly hosts technical activities"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are a group of high school students passionate about artificial intelligence, dedicated to promoting AI technology on campus and cultivating students&apos; innovative thinking and practical abilities
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-monet-blue to-monet-purple rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide a platform for high school students to learn artificial intelligence, through tech sharing, project practice, and academic exchange,
                cultivate the next generation of AI talent and help more students understand and master cutting-edge technology.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-monet-green to-monet-blue rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the most active technical club in the school, establish a comprehensive AI learning system,
                cultivate young developers with innovative spirit, and contribute to future technological development.
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-monet-blue to-monet-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{member.avatar}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-monet-blue text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Development Milestones */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Development Milestones
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline Dot */}
                    <div className="flex-shrink-0 w-8 h-8 bg-monet-blue rounded-full border-4 border-background flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="ml-6 flex-1">
                      <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h3 className="text-lg font-semibold text-card-foreground">
                            {milestone.title}
                          </h3>
                          <span className="text-sm text-monet-blue font-medium">
                            {milestone.year}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Join Us
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              If you&apos;re interested in artificial intelligence and want to learn and grow with like-minded peers,
              welcome to join our club! Let&apos;s explore the infinite possibilities of AI together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/blogs"
                className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-8 py-4 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20"
              >
                Browse Our Blog
              </a>
              <a
                href="/auth"
                className="border border-border text-foreground px-8 py-4 rounded-xl font-medium hover:bg-accent transition-all duration-300"
              >
                Join the Club
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
