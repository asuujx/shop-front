import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios-instance";
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
  );
}

export default Verify;
