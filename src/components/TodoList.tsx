"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

/** ---------------- TYPES ---------------- */
type TareaItem = {
  id: string | number;
  texto: string;
  done: boolean;
};

type RawTask = {
  id?: string | number;
  text?: string;
  titulo?: string;
  descripcion?: string;
  done?: boolean;
  completada?: boolean;
  estado?: string;
};

interface TodoListProps {
  initialTodos?: RawTask[];
}

/** ---------------- FALLBACK ---------------- */
const fallbackTasks = [
  {
    id: "t1",
    text: "Revisar resultados de clientes top del día anterior",
    done: true,
  },
  {
    id: "t2",
    text: "Actualizar planes de trabajo de nuevos clientes",
    done: false,
  },
  { id: "t3", text: "Programar capacitaciones de esta semana", done: false },
  { id: "t4", text: "Enviar feedback personalizado a 3 clientes", done: true },
  {
    id: "t5",
    text: "Revisar ingresos por plataforma y ajustar metas",
    done: false,
  },
];

/** ---------------- NORMALIZER ---------------- */
const normalizeTasks = (tasks: RawTask[]): TareaItem[] => {
  return tasks.map((task, index) => ({
    id: task.id ?? `task-${index}`,
    texto: task.text ?? task.titulo ?? task.descripcion ?? "Sin título",
    done: task.done ?? task.completada ?? task.estado === "completada" ,
  }));
};

/** ---------------- COMPONENT ---------------- */
const TodoList = ({ initialTodos }: TodoListProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  const tasksToDisplay: TareaItem[] =
    initialTodos && initialTodos.length > 0
      ? normalizeTasks(initialTodos)
      : normalizeTasks(fallbackTasks);

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Tareas de la asesora</h1>

      {/* CALENDAR */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date ? format(date, "PPP") : "Selecciona una fecha"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* TASKS */}
      <ScrollArea className="max-h-96 mt-4">
        <div className="flex flex-col gap-3">
          {tasksToDisplay.map((task) => (
            <Card key={task.id} className="p-4 flex items-center gap-3">
              <Checkbox checked={task.done} />
              <span
                className={`text-sm ${
                  task.done ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.texto}
              </span>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TodoList;
