"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

// --- DATOS DE PRUEBA (Les quitamos las imágenes para que usen la inicial por defecto) ---
const featuredClientes = [
  { id: 1, name: "Luna Star", badge: "Top ingresos", total: 4300 },
  { id: 2, name: "Mia Rose", badge: "Mayor crecimiento", total: 3200 },
  { id: 3, name: "Valeria Sky", badge: "Mejor constancia", total: 2400 },
];

const latestEarnings = [
  { id: 1, title: "Ingreso Plataforma A", badge: "Luna Star", amount: 1400 },
  { id: 2, title: "Ingreso Plataforma B", badge: "Mia Rose", amount: 2100 },
];

interface CardListProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
}

const CardList = ({ title, items }: CardListProps) => {
  // Si llegan datos reales del backend los usamos, si no, los de prueba
  const list = items && items.length > 0
    ? items
    : (title === "Clientes destacados" ? featuredClientes : latestEarnings);

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {list.map((item, index) => {

          // Mapeo seguro de nombres de variables
          const tituloItem = item.nombre || item.name || item.title || `Registro #${item.id || index}`;
          const badgeText = item.badge || item.estado || item.plataforma || "General";
          const valorItem = item.monto || item.total || item.amount || 0;

          // 🔤 OBTENER INICIAL: Sacamos la primera letra del nombre y la pasamos a Mayúscula
          const inicial = tituloItem.trim().charAt(0).toUpperCase();

          return (
            <Card
              key={item.id || index}
              className="flex flex-row items-center justify-between gap-4 p-4 shadow-xs border-slate-100"
            >
              {/* 🖼️ CONTROL DE AVATAR (Imagen real vs Inicial) */}
              {item.image ? (
                // Si el cliente en la base de datos sí tiene una foto real guardada, la muestra
                <div className="w-10 h-10 rounded-full relative overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={item.image}
                    alt={tituloItem}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                // 🎯 SI NO HAY IMAGEN: Dibuja un círculo estético con la inicial del nombre
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-semibold text-sm shrink-0 uppercase shadow-xs">
                  {inicial}
                </div>
              )}

              {/* Contenido de la tarjeta */}
              <CardContent className="flex-1 p-0">
                <CardTitle className="text-sm font-medium text-slate-800">
                  {tituloItem}
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0">
                  {badgeText}
                </Badge>
              </CardContent>

              {/* Footer con el monto */}
              <CardFooter className="p-0 font-semibold text-xs text-slate-600">
                {valorItem >= 1000
                  ? `$${(valorItem / 1000).toFixed(1)}K`
                  : `$${valorItem}`}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CardList;