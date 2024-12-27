import { signUpBusinessSchema } from "@/modules/auth/schemas/signUpBusinessSchema";
import { Button } from "@/modules/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/core/components/ui/form";
import { Input } from "@/modules/core/components/ui/input";
import { Separator } from "@/modules/core/components/ui/separator";
import { useToast } from "@/modules/core/hooks/use-toast";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import StrongPasswordInformation from "../password/StrongPasswordInformation";
import SignUpDialog from "./SignUpDialog";

export default function SignUpBusinessForm() {
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
    axiosInstance
      .post("/auth/basic/signup/business", values)
      .then((response) => {
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
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-lg flex flex-col gap-5"
      >
        <div className="flex justify-between gap-2">
          <FormField
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Jan" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Kowalski" />
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
              <FormLabel>Adres e-mail</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="np. jan.kowalski@poczta.pl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-between gap-2">
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
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
                <FormLabel>Powtórz hasło</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
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
              <FormLabel>Nazwa</FormLabel>
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
              <FormLabel>NIP</FormLabel>
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
              <FormLabel>Ulica</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Ulica" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-between gap-2">
          <FormField
            name="companyBuilding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr. budynku</FormLabel>
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
                <FormLabel>Nr. lokalu (opcjonalne)</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Nr. lokalu"
                    />
                  </div>
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
              <FormLabel>Kod pocztowy</FormLabel>
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
              <FormLabel>Miasto</FormLabel>
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
