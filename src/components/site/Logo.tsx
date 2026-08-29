import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  showText?: boolean;
  to?: string;
  asLink?: boolean;
}

const SIZE_CONFIG = {
  sm: {
    img: "h-6 w-auto",
    text: "text-base",
    gap: "gap-2",
  },
  md: {
    img: "h-7 w-auto",
    text: "text-lg",
    gap: "gap-2",
  },
  lg: {
    img: "h-9 w-auto",
    text: "text-xl",
    gap: "gap-2.5",
  },
} as const;

export function Logo({
  variant = "light",
  size = "md",
  className,
  imageClassName,
  textClassName,
  showText = true,
  to = "/",
  asLink = true,
}: LogoProps) {
  const isDark = variant === "dark";
  const config = SIZE_CONFIG[size];

  const content = (
    <>
      <img
        src={isDark ? "/Kyeline-logo-transparent-white.webp" : "/Kyeline-logo-transparent.webp"}
        alt="KyteLine Logo"
        width={36}
        height={36}
        decoding="async"
        loading="eager"
        className={cn(
          config.img,
          "object-contain transition-transform duration-200 group-hover:scale-105",
          imageClassName
        )}
      />
      {showText && (
        <span
          className={cn(
            "font-display tracking-tight leading-none select-none flex items-center",
            config.text,
            textClassName
          )}
        >
          <span
            className={cn(
              "font-bold",
              isDark ? "text-white" : "text-navy-deep"
            )}
          >
            Kyte
          </span>
          <span
            className={cn(
              "font-normal ml-px transition-colors",
              isDark ? "text-signal" : "text-navy-soft"
            )}
          >
            Line
          </span>
        </span>
      )}
    </>
  );

  const containerClasses = cn(
    "group inline-flex items-center",
    config.gap,
    className
  );

  if (!asLink) {
    return <div className={containerClasses}>{content}</div>;
  }

  return (
    <Link to={to} className={containerClasses}>
      {content}
    </Link>
  );
}
