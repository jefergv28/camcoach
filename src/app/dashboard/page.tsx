import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";


const Homepage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      {/* Ingresos por periodo / resumen principal */}
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart />
      </div>

      {/* Últimos ingresos */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Últimos ingresos" />
      </div>

      {/* Distribución (por modelo / plataforma) */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart />
      </div>

      {/* Tareas / pendientes de la asesora */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <TodoList />
      </div>

      {/* Evolución de rendimiento */}
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart />
      </div>

      {/* Contenido o modelos destacadas */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Clientes destacados" />
      </div>
    </div>
  );
};

export default Homepage;
