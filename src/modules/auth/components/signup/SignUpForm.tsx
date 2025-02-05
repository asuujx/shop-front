import { signUpSchema } from "@/modules/auth/schemas/signUpSchema";
import { useToast } from "@/modules/core/hooks/use-toast";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import StrongPasswordInformation from "../password/StrongPasswordInformation";
import SignUpDialog from "./SignUpDialog";

function SignUpForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    axiosInstance
      .post("/auth/basic/signup/personal", values)
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
            description: "Podany adres e-mail jest już zajęty.",
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
        className="w-full flex flex-col gap-5"
      >
        <div className="flex justify-between gap-2">
          <FormField
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="flex">
                    Imię <p className="text-destructive">*</p>
                  </span>
                </FormLabel>
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
                <FormLabel>
                  <span className="flex">
                    Nazwisko<p className="text-destructive">*</p>
                  </span>
                </FormLabel>
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
              <FormLabel>
                <span className="flex">
                  Adres e-mail<p className="text-destructive">*</p>
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="np. jan.kowalski@poczta.pl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-between gap-2">
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>
                  <span className="flex">
                    Hasło<p className="text-destructive">*</p>
                  </span>
                </FormLabel>
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
              <FormItem className="w-1/2">
                <FormLabel>
                  <span className="flex">
                    Powtórz hasło<p className="text-destructive">*</p>
                  </span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type={showPassword ? "text" : "password"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <StrongPasswordInformation password={password} />

        <SignUpDialog open={open} setOpen={setOpen} email={email} />

        <Button type="submit" className="w-full">
          Utwórz konto prywatne
        </Button>
      </form>
    </Form>
  );
}

export default SignUpForm;
