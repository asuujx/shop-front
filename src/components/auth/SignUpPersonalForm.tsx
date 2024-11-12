import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

// minLength: 8,
// minLowercase: 1,
// minUppercase: 1,
// minNumbers: 1,
// minSymbols: 1,

const validationSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Nazwa użytkownika musi mieć minimum 3 znaki" })
      .max(20, {
        message: "Nazwa użytkownika może mieć maksymalnie 20 znaków",
      }), // DO USTALENIA
    email: z.string().email({ message: "Nieprawidłowy adres e-mail" }).trim(),
    password: z
      .string()
      .min(8, { message: "Hasło musi mieć minimum 8 znaków" })
      .trim(),
    confirmPassword: z
      .string()
      .min(8, { message: "Hasło musi mieć minimum 8 znaków" })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła się nie zgadzają",
    path: ["confirmPassword"],
  });

function onSubmit(values: z.infer<typeof validationSchema>) {
  axios.post("http://localhost:5000/auth/basic/signup/business", values);
  console.log(values);
}

function SignUpPersonalForm() {
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Nazwa użytkownika" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres e-mail</FormLabel>
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
              <FormItem className="w-1/2">
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Hasło" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Powtórz hasło</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Powtórz hasło"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-5">
          Utwórz konto prywatne
        </Button>
      </form>
    </Form>
  );
}

export default SignUpPersonalForm;
