'use client';

import type { ComponentPropsWithoutRef, CSSProperties, ElementType } from 'react';

type FadeContentProps<T extends ElementType> = {
  as?: T;
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'style' | 'onClick'>;

export default function FadeContent<T extends ElementType = 'span'>({
  as,
  text,
  delay = 0,
  duration = 600,
  className,
  style,
  onClick,
  ...rest
}: FadeContentProps<T>) {
  const Tag = (as || 'span') as ElementType;
  const animationStyle: CSSProperties = {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    ...style,
  };

  return (
    <Tag
      className={['dv-fade-content', className].filter(Boolean).join(' ')}
      style={animationStyle}
      onClick={onClick}
      {...rest}
    >
      {text}
    </Tag>
  );
}
