import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (token) {
      axios
        .post("http://localhost:5000/auth/basic/verify", { token })
        .then((response) => {
          setStatus(response.data.status);
        })
        .catch((error) => {
          setStatus(error.response.status);
        });
    }
  }), [token];

  console.log(status);
  console.log(token);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
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

// http://localhost:3000/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJhbG9uLnBpb3RyQGdtYWlsLmNvbSIsImlhdCI6MTczMjA0ODAyOSwiZXhwIjoxNzMyMTM0NDI5fQ.FX_WkAfcsHr7p7KlwjbtQ244ERNBC-LAcZoaDbQZr_8
