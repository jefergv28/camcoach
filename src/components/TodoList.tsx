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

const tasks = [
  {
    id: "t1",
    text: "Revisar resultados de **clientes** top del día anterior",  // ← Cambió "modelos"
    done: true,
  },
  {
    id: "t2",
    text: "Actualizar planes de trabajo de nuevos **clientes**",  // ← Cambió "nuevas modelos"
    done: false,
  },
  {
    id: "t3",
    text: "Programar capacitaciones de esta semana",
    done: false,
  },
  {
    id: "t4",
    text: "Enviar feedback personalizado a 3 **clientes**",  // ← Cambió "3 modelos"
    done: true,
  },
  {
    id: "t5",
    text: "Revisar ingresos por plataforma y ajustar metas",
    done: false,
  },
];

const TodoList = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">
        Tareas de la **asesora**  {/* ← Ya era perfecto */}
      </h1>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full">
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Selecciona una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* LISTA DE TAREAS */}
      <ScrollArea className="max-h-[400px] mt-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-center gap-4">
                <Checkbox id={task.id} defaultChecked={task.done} />
                <label
                  htmlFor={task.id}
                  className="text-sm text-muted-foreground"
                >
                  {task.text}
                </label>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TodoList;
