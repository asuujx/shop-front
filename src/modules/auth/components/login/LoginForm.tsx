import { loginSchema } from "@/modules/auth/schemas/loginSchema";
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
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useUser } from "@/modules/core/providers/userProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import VerifyMailDialog from "../VerifyMailDialog";
import EmailDialog from "./EmailDialog";

function LoginForm() {
  const { login } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [forgotPasswordDialog, setForgotPasswordDialog] = useState(false);
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
    axiosInstance
      .post("/auth/basic/signin", values, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.emailVerified) {
          login({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          });
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
        className="w-full max-w-md flex flex-col gap-5"
      >
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres E-mail</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
            </FormItem>
          )}
        />
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
              <EmailDialog
                open={forgotPasswordDialog}
                setOpen={setForgotPasswordDialog}
              />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Zaloguj
        </Button>

        <Link to="/signup" className="text-center underline font-semibold">
          Zarejestruj się
        </Link>

        {open && (
          <VerifyMailDialog open={open} setOpen={setOpen} email={email} />
        )}
      </form>
    </Form>
  );
}

export default LoginForm;
