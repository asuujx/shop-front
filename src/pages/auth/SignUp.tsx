import SignUpBusinessForm from "@/components/auth/signup/SignUpBusinessForm";
import SignUpPersonalForm from "@/components/auth/signup/SignUpPersonalForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="w-screen h-screen">
      <div className="max-w-screen-xl mx-4 mb-5 lg:mx-auto flex flex-col items-center justify-center">
        <h1 className="mt-20 mb-10 text-5xl font-semibold">Utwórz konto</h1>
        <Tabs defaultValue="personal">
          <TabsList className="w-full max-w-lg mb-5">
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
        <div className="flex gap-1 w-full justify-center items-center mt-5">
          <p>Masz już konto?</p>
          <Link to="/login" className="underline font-semibold">
            Zaloguj się
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
