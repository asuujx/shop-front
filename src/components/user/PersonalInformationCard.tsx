import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

const fetchUser = async () => {
  const response = await axiosInstance.get("/auth/user");
  return response.data;
}

function PersonalInformationCard() {
  const { data: user, isLoading } = useQuery(
    {
      queryKey: ['user'],
      queryFn: fetchUser,
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dane osobowe</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span className="font-bold">Imię: </span>
          <span>{isLoading ? <Skeleton /> : user?.firstName}</span>
        </div>

        <div className="flex gap-2 items-center">
          <span className="font-bold">Nazwisko: </span>
          <span>{isLoading ? <Skeleton /> : user?.lastName}</span>
        </div>

        <div className="flex gap-2 items-center">
          <span className="font-bold">Adres e-mail: </span>
          <span>{isLoading ? <Skeleton /> : user?.email}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default PersonalInformationCard;
