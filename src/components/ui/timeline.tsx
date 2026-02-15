// src/components/ui/timeline.tsx
import React from "react";
import { cn } from "@/lib/utils";

// Componente principal del Timeline
const Timeline = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("space-y-0", className)}>{children}</div>;
};

// Item del timeline (contenedor principal de cada fila)
const TimelineItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex gap-4 min-h-[70px]", className)}>{children}</div>
  );
};

// Contenido opuesto (para la fecha/hora - lado izquierdo)
const TimelineOppositeContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("flex w-[150px] flex-col text-right text-sm", className)}
    >
      {children}
    </div>
  );
};

// Separador (contiene la línea y el punto)
const TimelineSeparator = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {children}
    </div>
  );
};

// Conector (la línea vertical)
const TimelineConnector = ({ className }: { className?: string }) => {
  return <div className={cn("w-0.5 flex-1 bg-border", className)} />;
};

// Punto del timeline (el círculo)
const TimelineDot = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  // Extraer el color de la clase si viene como bg-color-500
  const getBgColor = (classes: string = "") => {
    if (classes.includes("bg-")) return classes;
    return cn("w-3 h-3 rounded-full bg-primary", classes);
  };

  return <div className={getBgColor(className)}>{children}</div>;
};

// Contenido principal (lado derecho)
const TimelineContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex-1 pb-6 last:pb-0", className)}>{children}</div>
  );
};

// Componentes adicionales útiles (opcionales)
const TimelineHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
};

const TimelineDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
};

const TimelineDate = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn("text-xs text-muted-foreground block", className)}>
      {children}
    </span>
  );
};

export {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  // Componentes adicionales (opcionales)
  TimelineHeading,
  TimelineDescription,
  TimelineDate,
};
