import { Button } from "@/modules/core/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/modules/core/components/ui/card";
import { toast } from "@/modules/core/hooks/use-toast";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      axiosInstance.post("/auth/basic/verify", { token }).catch(() => {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: "Niewłaściwy token weryfikacyjny.",
        });
      });
    }
  }),
    [token];

  return (
    <div className="max-w-screen-xl mt-20 mx-4 lg:mx-auto flex flex-col items-center">
      <div className="flex items-center justify-center">
        <Card className="p-5">
          <CardHeader className="text-center text-4xl font-bold">
            Dziękujemy!
          </CardHeader>
          <CardContent>
            <p>Twój adres e-mail został pozytywnie zweryfikowany.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Link to="/login">Zaloguj się</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Verify;
