import { awards } from '@/config/projects'
import { Card } from '@/components/shared/Card'

export function Awards() {
  return (
    <section className="md:border-l md:border-border md:pl-6">
      <div className="grid max-w-3xl grid-cols-1 items-baseline gap-y-8 md:grid-cols-4">
        <h2 className="text-sm font-semibold text-foreground">
          Awards
        </h2>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-4">
            {awards.map((award, index) => (
              <Card key={index}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{award.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {award.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {award.description}
                  </p>
                  {award.link && (
                    <a
                      href={award.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
