import { Card, CardContent, CardHeader, CardTitle } from "@/modules/core/components/ui/card";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Order } from "types";

const fetchUserOrders = async () => {
  const response = await axiosInstance.get<Order[]>("/orders/user");
  return response.data;
};

function UserOrders() {
  const { data: orders } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchUserOrders,
  });

  return (
    <div className="mt-20 max-w-screen-xl mx-auto">
      <h1 className="mb-10 text-4xl font-semibold">Moje zamówienia</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders?.map((order) => (
          <Link to={`/offers/${order.offerId}`} key={order.id}>
            <Card>
              <CardHeader>
                <CardTitle>{order.status}</CardTitle>
              </CardHeader>
              <CardContent>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default UserOrders