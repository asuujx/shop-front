import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { useUser } from "@/providers/userProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import VerifyMailDialog from "./VerifyMailDialog";

function LoginForm() {
  const { login } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    axios
      .post("http://localhost:5000/auth/basic/signin", values, { withCredentials: true })
      .then((response) => {
        if (response.data.emailVerified) {
          login({ firstName: response.data.firstName, lastName: response.data.lastName });
          localStorage.setItem("accessToken", response.data.accessToken);
          navigate("/");
        } else {
          setEmail(values.email);
          setOpen(true);
        }
      })
      .catch(() => {
        form.setError("password", {
          type: "manual",
          message: "Nieprawidłowy adres e-mail lub hasło",
        });
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
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="text" placeholder="Adres e-mail" />
              </FormControl>
            </FormItem>
          )}
        />
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

        <Button type="submit" className="w-full mt-5">
          Zaloguj
        </Button>

        {open && (
          <VerifyMailDialog open={open} setOpen={setOpen} email={email} />
        )}
      </form>
    </Form>
  );
}

export default LoginForm;
