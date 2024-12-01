import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

const fetchUser = async () => {
  const response = await axiosInstance.get("http://localhost:5000/auth/user");
  return response.data;
}

function UserCard() {
  const { data: user, isLoading } = useQuery(
    {
      queryKey: ['user'],
      queryFn: fetchUser,
    }
  );

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Dane osobowe</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span className="font-semibold">Imię: </span>
          <span>{isLoading ? <Skeleton /> : user?.firstName}</span>
        </div>

        <div className="flex gap-2 items-center">
          <span className="font-semibold">Nazwisko: </span>
          <span>{isLoading ? <Skeleton /> : user?.lastName}</span>
        </div>

        <div className="flex gap-2 items-center">
          <span className="font-semibold">Adres e-mail: </span>
          <span>{isLoading ? <Skeleton /> : user?.email}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserCard;
