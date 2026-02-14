import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

// Clientes destacados (ejemplo) - CAMBIADO
const featuredClientes = [  // ← Cambió de featuredModels
  {
    id: 1,
    name: "Luna Star",
    badge: "Top ingresos",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    total: 4_300,
  },
  {
    id: 2,
    name: "Mia Rose",
    badge: "Mayor crecimiento",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    total: 3_200,
  },
  {
    id: 3,
    name: "Valeria Sky",
    badge: "Mejor constancia",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    total: 2_400,
  },
  {
    id: 4,
    name: "Amy Blue",
    badge: "Nueva promesa",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    total: 1_500,
  },
  {
    id: 5,
    name: "Nora Flame",
    badge: "Top tips",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    total: 1_200,
  },
];

// Últimos ingresos (ejemplo) - CAMBIADO (badges ahora son nombres de clientes)
const latestEarnings = [
  {
    id: 1,
    title: "Ingreso Plataforma A",  // ← Cambió Chaturbate → genérico
    badge: "Luna Star",  // ← Se queda (nombre cliente)
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    amount: 1_400,
  },
  {
    id: 2,
    title: "Ingreso Plataforma B",  // ← Cambió Stripchat → genérico
    badge: "Mia Rose",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    amount: 2_100,
  },
  {
    id: 3,
    title: "Ingreso Plataforma C",  // ← Cambió OnlyFans → genérico
    badge: "Valeria Sky",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    amount: 1_300,
  },
  {
    id: 4,
    title: "Ingreso Plataforma D",  // ← Cambió Streamate → genérico
    badge: "Amy Blue",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    amount: 2_500,
  },
  {
    id: 5,
    title: "Ingreso extras",  // ← Cambió Propinas privadas → genérico
    badge: "Nora Flame",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    amount: 1_400,
  },
];

type FeaturedCliente = {  // ← Cambió de FeaturedModel
  id: number;
  name: string;
  badge: string;
  image: string;
  total: number;
};

type LatestEarning = {
  id: number;
  title: string;
  badge: string;
  image: string;
  amount: number;
};

type CardItem = FeaturedCliente | LatestEarning;  // ← Actualizado

const CardList = ({ title }: { title: string }) => {
  // Si el título es "Clientes destacados" mostramos featuredClientes, si no latestEarnings
  const list = title === "Clientes destacados" ? featuredClientes : latestEarnings;  // ← Cambió

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {(list as CardItem[]).map((item) => (
          <Card
            key={item.id}
            className="flex-row items-center justify-between gap-4 p-4"
          >
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={item.image}
                alt={"name" in item ? item.name : item.title}
                fill
                className="object-cover"
              />
            </div>

            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">
                {"name" in item ? item.name : item.title}
              </CardTitle>
              <Badge variant="secondary">{item.badge}</Badge>
            </CardContent>

            <CardFooter className="p-0">
              {"total" in item
                ? `${item.total / 1000}K`
                : `${item.amount / 1000}K`}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;
