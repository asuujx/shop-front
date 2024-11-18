import { useToast } from "@/hooks/use-toast";
import { signUpPersonalSchema } from "@/lib/schemas/signUpPersonalSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import SignUpDialog from "./SignUpDialog";

function SignUpPersonalForm() {
  // Change state of the dialog
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpPersonalSchema>>({
    resolver: zodResolver(signUpPersonalSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signUpPersonalSchema>) => {
    axios
      .post("http://localhost:5000/auth/basic/signup/personal", values)
      .catch((error) => {
        // console.log(error.response.status);
        if (error.response.status === 201) {
          setOpen(true);
          setEmail(values.email);
        }
        if (error.response.status === 403) {
          toast({
            variant: "destructive",
            title: "Wystąpił błąd",
            description: "Podany adres e-mail jest już zajęty.",
          });
        }
      });

    // console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex justify-between">
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
              <FormItem className="w-1/2">
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
              <FormItem className="w-1/2">
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

        <SignUpDialog open={open} setOpen={setOpen} email={email} />

        <Button type="submit" className="w-full mt-5">
          Utwórz konto prywatne
        </Button>
      </form>
    </Form>
  );
}

export default SignUpPersonalForm;
