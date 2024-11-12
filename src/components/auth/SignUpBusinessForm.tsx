import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

const validationSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Nazwa użytkownika musi mieć minimum 3 znaki" }),
    email: z.string().email({ message: "Nieprawidłowy adres e-mail" }).trim(),
    password: z
      .string()
      .min(8, { message: "Hasło musi mieć minimum 8 znaków" })
      .trim(),
    confirmPassword: z
      .string()
      .min(8, { message: "Hasło musi mieć minimum 8 znaków" })
      .trim(),
    companyName: z.string(),
    companyNip: z
      .string()
      .min(10, { message: "NIP musi mieć 10 cyfr" })
      .max(10, { message: "NIP musi mieć 10 cyfr" }),
    companyAddress: z.string(),
    companyPostalCode: z.string(),
    companyCity: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła się nie zgadzają",
    path: ["confirmPassword"],
  });

function onSubmit(values: z.infer<typeof validationSchema>) {
  axios.post("http://localhost:5000/auth/basic/signup/personal", values);
  console.log(values);
}

export default function SignUpBusinessForm() {
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companyNip: "",
      companyAddress: "",
      companyPostalCode: "",
      companyCity: "",
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
              </FormItem>
            )}
          />
        </div>

        <h2 className="my-2 font-medium">Dane firmowe</h2>

        <FormField
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Nazwa" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="companyNip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numer NIP</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Numer NIP" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="companyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ulica</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Ulica" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="companyPostalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kod pocztowy</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Kod pocztowy" />
              </FormControl>
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
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-5">
          Utwórz konto firmowe
        </Button>
      </form>
    </Form>
  );
}
