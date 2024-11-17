import { signUpBusinessSchema } from "@/lib/schemas/signUpBusinessSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";



function onSubmit(values: z.infer<typeof signUpBusinessSchema>) {
  axios.post("http://localhost:5000/auth/basic/signup/business", values);
  console.log(values);
}

export default function SignUpBusinessForm() {
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
                  <Input {...field} type="password" placeholder="Hasło" />
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
                    type="password"
                    placeholder="Powtórz hasło"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className=" flex gap-5 items-center justify-center">
          <Separator decorative className="w-1/3" />
          <h2 className="w-1/3 text-xs text-center font-semibold">Dane firmowe</h2>
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
                  <Input {...field} type="text" placeholder="Nr. lokalu (Opcjonalne)" />
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

        <Button type="submit" className="w-full mt-5">
          Utwórz konto firmowe
        </Button>
      </form>
    </Form>
  );
}
