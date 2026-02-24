Aplicación web diseñada para asesores y coaches de creadores de contenido (influencers, youtubers, tiktokers, streamers, etc.). Permite planificar estrategias de contenido y monitorear ingresos de manera sencilla y organizada.
Desarrollada especialmente para ayudar a profesionales como coaches a gestionar múltiples clientes, con un enfoque en la productividad y el análisis financiero. El proyecto está en desarrollo activo, con énfasis en autenticación segura y dashboards personalizados.
Funcionalidades Principales
Basado en el código actual y commits recientes, la app incluye las siguientes features implementadas o en progreso:
1. Autenticación y Seguridad

Login y Registro: Formulario de inicio de sesión con validación de credenciales (email y password). Usa cookies para mantener sesiones activas.
Middleware de Protección: Rutas protegidas que redirigen a login si no hay sesión activa (ej: dashboard).
Gestión de Cookies: Configuración segura de cookies para autenticación persistente.
Roles de Usuario: Soporte implícito para diferenciar entre "asesor" (acceso total) y "creador" (acceso limitado a sus datos). (En desarrollo a partir de commits como "login terminado" y "cookies").

2. Dashboard Principal

Vista centralizada para usuarios logueados.
Resumen rápido de planes, ingresos y metas.
Componentes personalizados como diálogos modales para acciones rápidas (ej: agregar ingreso o tarea).

3. Planificación de Contenido

Calendario y Tareas: Herramientas para programar publicaciones, ediciones y sesiones de coaching.
Metas y Estrategias: Definir objetivos mensuales (ej: número de seguidores, publicaciones por semana).
Recordatorios: Notificaciones o vistas de pendientes (integración futura con calendarios como Google Calendar).

4. Monitoreo de Ingresos

Registro de Ganancias: Formularios para ingresar ingresos por plataforma (YouTube, TikTok, Twitch, patrocinios, etc.).
Tablas y Gráficos: Visualización de datos en tablas (plataforma, mes, monto) y gráficos (usando librerías como Chart.js o Recharts).
Análisis: Totales acumulados, comparaciones mensuales y proyecciones básicas.
Importación/Exportación: Soporte para CSV o integración con APIs de plataformas (en planes futuros).

5. Gestión Multi-Cliente

Vista exclusiva para asesores: Lista de creadores asesorados, con acceso a sus planes e ingresos.
Perfiles individuales: Cada creador tiene su espacio privado para ver y editar sus datos.

6. Otras Features

Diálogos y Modales: Componentes reutilizables para confirmaciones, formularios y alertas (basado en commits como "dialogos").
Corrección de Errores: Manejo de errores TypeScript para una experiencia robusta.
Internacionalización: Soporte básico para español (dado el contexto del desarrollador).
Responsive Design: Adaptable a móviles y desktops (gracias a Next.js).

Nota: Algunas features como gráficos avanzados o integraciones externas están en fase de planificación, basadas en la estructura actual del código. El repositorio muestra commits recientes enfocados en login y middleware, lo que indica un enfoque inicial en la base de usuarios.
Tecnologías Utilizadas

Framework Principal: Next.js 14+ (con App Router para enrutamiento dinámico).
Lenguaje: TypeScript (98% del código, para tipado fuerte y prevención de errores).
Estilos: CSS modules o Tailwind CSS (inferido de la estructura estándar).
Fuentes: Geist (optimizada por Vercel para rendimiento).
Otras Librerías:
Cookies: Posible uso de js-cookie o similar para manejo de sesiones.
UI Components: Diálogos modales (quizás con Radix UI o Headless UI).
Base de Datos: No especificada aún (recomendado: Supabase, Firebase o Prisma con PostgreSQL para almacenar usuarios, planes e ingresos).

Porcentajes de Código (aprox. del repositorio):
TypeScript: 98.2%
CSS: 1.1%
JavaScript: 0.7%


Requisitos Previos

Node.js v18+ (recomendado LTS).
npm o yarn como gestor de paquetes.
Cuenta en Vercel para deploy (opcional pero recomendado).


Instalación

Clona el repositorio:

git clone https://github.com/jefergv28/camcoach.git
cd camcoach

Instala dependencias:
npm install
# o yarn install

Configura variables de entorno (crea un .env.local):
NEXT_PUBLIC_API_URL=tu-api-url (si usas backend externo)
COOKIE_SECRET=tu-secreto-para-cookies


Ejecuta en modo desarrollo:npm run dev
npm run dev
# Abre http://localhost:3000 en tu navegador

Para build y producción:text
npm run build
npm run start

Uso

Registro/Login: Accede a / o /login para crear cuenta o ingresar.
Dashboard: Una vez logueado, ve resúmenes y accede a planificación/ingresos.
Agregar Datos: Usa formularios para registrar tareas o ingresos.
Para Asesores: En la vista de clientes, selecciona un creador para editar sus datos.

Ejemplo de flujo:

Inicia sesión como asesor.
Agrega un nuevo cliente (creador).
Crea un plan semanal de contenido.
Registra ingresos mensuales y ve gráficos.

Contribución
¡Bienvenido a contribuir! Sigue estos pasos:

Forkea el repositorio.
Crea una branch: git checkout -b feature/nueva-feature.
Commitea cambios: git commit -m "Agrega nueva feature".
Push: git push origin feature/nueva-feature.
Abre un Pull Request.

Roadmap (Planes Futuros)

Integración con APIs de plataformas (YouTube Analytics, Stripe).
Notificaciones push/email.
Exportación de reportes en PDF.
Soporte multi-idioma (inglés/español).
Mejoras en UI/UX con componentes como Shadcn/UI.

Licencia
MIT License. Ver LICENSE para detalles.
Contacto
Desarrollado por jefergv28. Para preguntas o sugerencias, abre un issue en GitHub.

