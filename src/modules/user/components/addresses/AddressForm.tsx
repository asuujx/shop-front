import { Button } from "@/modules/core/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/modules/core/components/ui/form";
import { Input } from "@/modules/core/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/modules/core/components/ui/select";
import { toast } from "@/modules/core/hooks/use-toast";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { addressSchema } from "@/modules/user/schemas/addressSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectValue } from "@radix-ui/react-select";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";


interface AddressFormProps {
  setOpen: (open: boolean) => void;
}

function AddressForm({ setOpen }: AddressFormProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      companyName: "",
      postalCode: "",
      city: "",
      street: "",
      building: "",
      apartment: "",
    },
  });

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    console.log(values);
    axiosInstance
      .post("/delivery-addresses", values)
      .then((response) => {
        if (response.status === 201) {
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["addresses"] });
          toast({
            title: "Adres został dodany",
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast({
            title: "Hasło zostało zmienione",
          });
        }
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
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

        <FormField
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="text" placeholder="Numer telefonu" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Nazwa firmy (opcjonalne)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <FormField
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="text" placeholder="Miasto" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="text" placeholder="Kod pocztowy" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="voivodeship"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Województwo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dolnoslaskie">dolnośląskie</SelectItem>
                  <SelectItem value="kujawsko-pomorskie">
                    kujawsko-pomorskie
                  </SelectItem>
                  <SelectItem value="lubelskie">lubelskie</SelectItem>
                  <SelectItem value="lubuskie">lubuskie</SelectItem>
                  <SelectItem value="lodzkie">łódzkie</SelectItem>
                  <SelectItem value="malopolskie">małopolskie</SelectItem>
                  <SelectItem value="mazowieckie">mazowieckie</SelectItem>
                  <SelectItem value="opolskie">opolskie</SelectItem>
                  <SelectItem value="podkarpackie">podkarpackie</SelectItem>
                  <SelectItem value="podlaskie">podlaskie</SelectItem>
                  <SelectItem value="pomorskie">pomorskie</SelectItem>
                  <SelectItem value="slaskie">śląskie</SelectItem>
                  <SelectItem value="swietokrzyskie">świętokrzyskie</SelectItem>
                  <SelectItem value="warminsko-mazurskie">
                    warmińsko-mazurskie
                  </SelectItem>
                  <SelectItem value="wielkopolskie">wielkopolskie</SelectItem>
                  <SelectItem value="zachodniopomorskie">
                    zachodniopomorskie
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="street"
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
            name="building"
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
            name="apartment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nr. lokalu (Opcjonalne)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Dodaj adres</Button>
      </form>
    </Form>
  );
}

export default AddressForm;
