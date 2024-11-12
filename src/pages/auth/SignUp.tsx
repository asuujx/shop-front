import SignUpBusinessForm from "@/components/auth/SignUpBusinessForm";
import SignUpPersonalForm from "@/components/auth/SignUpPersonalForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="w-screen h-screen">
      <div className="w-full top-0 pt-2 px-5 flex justify-between items-center">
        <Link to="/" className="font-bold">
          Placeholder
        </Link>
        <div className="flex gap-1 w-full place-content-end">
          <p>Masz już konto?</p>
          <Link to="/login" className="underline font-semibold">Zaloguj się</Link>
        </div>
      </div>

      <div className="w-full h-fit mt-20 flex flex-col items-center justify-center">
        <h1 className="mb-5 text-4xl font-semibold">Utwórz konto</h1>
        <Tabs defaultValue="personal">
          <TabsList className="w-full">
            <TabsTrigger value="personal" className="w-1/2">
              Prywatne
            </TabsTrigger>
            <TabsTrigger value="business" className="w-1/2">
              Firmowe
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <SignUpPersonalForm />
          </TabsContent>
          <TabsContent value="business">
            <SignUpBusinessForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SignUp;
