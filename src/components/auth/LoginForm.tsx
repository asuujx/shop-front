import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

const validationSchema = z.object({
  email: z.string().email({ message: "Nieprawidłowy adres e-mail" }).trim(),
  password: z
    .string()
    .min(8, { message: "Hasło musi mieć minimum 8 znaków" })
    .trim(),
});

function onSubmit(values: z.infer<typeof validationSchema>) {
  axios.post("http://localhost:5000/auth/basic/signin", values);
  console.log(values);
}

function LoginForm() {
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
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

        <Button type="submit" className="w-full mt-5">
          Zaloguj
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
