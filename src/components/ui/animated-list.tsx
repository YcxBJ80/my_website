'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedListProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  animationDuration?: number
  threshold?: number
}

export function AnimatedList({
  children,
  className = '',
  staggerDelay = 100,
  animationDuration = 600,
  threshold = 0.1
}: AnimatedListProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 逐个显示列表项
          children.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => new Set(prev).add(index))
            }, index * staggerDelay)
          })
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [children, staggerDelay, threshold])

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className="transition-all ease-out"
          style={{
            transform: visibleItems.has(index) ? 'translateY(0)' : 'translateY(30px)',
            opacity: visibleItems.has(index) ? 1 : 0,
            transitionDuration: `${animationDuration}ms`,
            transitionDelay: visibleItems.has(index) ? '0ms' : `${index * staggerDelay}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
} 