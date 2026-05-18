"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import Cookies from "js-cookie"; // 🎯 IMPORTACIÓN CLAVE PARA EL TOKEN

interface Mensaje {
  remitente: "usuario" | "ia";
  texto: string;
}

// 🎯 CORRECCIÓN 1: Variable de entorno dinámica
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_CHAT = `${BASE_URL}/chat`;

export default function ChatBot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      remitente: "ia",
      texto:
        "¡Hola! Bienvenid@ a CamCoach. ¿En qué te puedo colaborar hoy con tu entrenamiento o gestión? 🏋️‍♂️📊",
    },
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || cargando) return;

    const mensajeUsuario = input.trim();
    setInput("");
    setMensajes((prev) => [
      ...prev,
      { remitente: "usuario", texto: mensajeUsuario },
    ]);
    setCargando(true);

    try {
      const token = Cookies.get("token"); // 🎯 CORRECCIÓN 2: Obtenemos el token seguro

      // 🎯 CORRECCIÓN 3: Uso de la ruta dinámica y envío del Bearer Token
      const response = await fetch(`${API_CHAT}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({ mensaje: mensajeUsuario }),
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const data = await response.json();
      setMensajes((prev) => [
        ...prev,
        { remitente: "ia", texto: data.respuesta },
      ]);
    } catch (error) {
      console.error(error);
      setMensajes((prev) => [
        ...prev,
        {
          remitente: "ia",
          texto: "🔴 Hubo un error de conexión. Por favor intenta de nuevo.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 🏙️ VENTANA DEL CHAT */}
      {abierto && (
        <div className="mb-4 flex flex-col h-112.5 w-90 sm:w-100 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Encabezado del Chat */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <h3 className="font-semibold text-sm">
                Soporte Inteligente CamCoach
              </h3>
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cuerpo de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
            {mensajes.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.remitente === "usuario" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs whitespace-pre-line shadow-xs leading-relaxed ${
                    msg.remitente === "usuario"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.texto}
                </div>
              </div>
            ))}

            {/* Animación de Pensando */}
            {cargando && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-400 border border-gray-100 px-3 py-2 rounded-2xl rounded-bl-none text-xs flex gap-1 items-center shadow-xs">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={mensajesEndRef} />
          </div>

          {/* Formulario Inferior */}
          <form
            onSubmit={enviarMensaje}
            className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hazle una pregunta a la IA..."
              className="flex-1 px-3 py-2 bg-slate-100 text-slate-800 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              disabled={cargando}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
              disabled={cargando || !input.trim()}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* 🔘 BOTÓN FLOTANTE CIRCULAR */}
      <button
        onClick={() => setAbierto(!abierto)}
        className={`p-4 rounded-full shadow-lg text-white transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
          abierto ? "bg-slate-800 rotate-90" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {abierto ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}