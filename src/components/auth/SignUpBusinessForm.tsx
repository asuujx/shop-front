import { useToast } from "@/hooks/use-toast";
import { signUpBusinessSchema } from "@/lib/schemas/signUpBusinessSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import SignUpDialog from "./SignUpDialog";
import StrongPasswordInformation from "./StrongPasswordInformation";

export default function SignUpBusinessForm() {
  // Change state of the dialog
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpBusinessSchema>>({
    resolver: zodResolver(signUpBusinessSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      companyName: "",
      companyNip: "",
      companyStreet: "",
      companyBuilding: "",
      companyApartment: "",
      companyPostalCode: "",
      companyCity: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signUpBusinessSchema>) => {
    axios
      .post("http://localhost:5000/auth/basic/signup/business", values)
      .then((response) => {
        // console.log(response);
        if (response.status === 201) {
          setOpen(true);
          setEmail(values.email);
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          toast({
            variant: "destructive",
            title: "Wystąpił błąd",
            description: "Adres e-mail lub NIP jest już zajęty.",
          });
        }
      });
    // console.log(values);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 w-full"
      >
        <div className="flex justify-between gap-5">
          <FormField
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="text" placeholder="Imię" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="text" placeholder="Nazwisko" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="email" placeholder="Adres e-mail" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-between gap-5">
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Hasło"
                      onChange={(e) => {
                        field.onChange(e);
                        setPassword(e.target.value);
                      }}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Powtórz hasło"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <StrongPasswordInformation password={password} />

        <div className=" flex gap-5 items-center justify-center">
          <Separator decorative className="w-1/3" />
          <h2 className="w-1/3 text-xs text-center font-semibold">
            Dane firmowe
          </h2>
          <Separator decorative className="w-1/3" />
        </div>

        <FormField
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="text" placeholder="Nazwa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="companyNip"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="text" placeholder="Numer NIP" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="companyStreet"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="text" placeholder="Ulica" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-between gap-5">
          <FormField
            name="companyBuilding"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="text" placeholder="Nr. budynku" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="companyApartment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nr. lokalu (Opcjonalne)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="companyPostalCode"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="text" placeholder="Kod pocztowy" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="companyCity"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="text" placeholder="Miasto" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SignUpDialog open={open} setOpen={setOpen} email={email} />

        <Button type="submit" className="w-full mt-5">
          Utwórz konto firmowe
        </Button>
      </form>
    </Form>
  );
}
