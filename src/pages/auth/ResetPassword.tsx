import StrongPasswordInformation from "@/components/auth/password/StrongPasswordInformation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios-instance";
import { changePasswordSchema } from "@/lib/schemas/changePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    axiosInstance
      .patch("/auth/basic/update", values)
      .then((response) => {
        if (response.status === 204) {
          toast({
            title: "Hasło zostało zresetowane",
          });
          navigate("/login");
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            variant: "destructive",
            title: "Wystąpił błąd",
            description: "Podane hasło jest za słabe.",
          });
        }
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="h-screen grid place-content-center">
      <CardHeader>
        <CardTitle className="text-5xl">Zresetuj hasło</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Nowe hasło"
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
                </FormItem>
              )}
            ></FormField>

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
                </FormItem>
              )}
            ></FormField>

            <Button type="submit">Zresetuj hasło</Button>

            <StrongPasswordInformation password={password} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ResetPassword;
