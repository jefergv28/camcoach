"use client";

import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatBot from "@/components/ChatBot"; // 👈 Importamos el chatbot flotante

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full relative">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <div className="flex-1 overflow-auto p-6 relative">
            {children}

            {/* 🤖 CHATBOT FLOTANTE GLOBAL */}
            <ChatBot />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
