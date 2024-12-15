import SuggestedCategories from "@/components/offers/SuggestedCategories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/axios-instance";
import { createOfferSchema } from "@/lib/schemas/createOfferSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import CategoryAttributes from "./CategoryAttributes";

const fetchOfferStates = async () => {
  const response = await axiosInstance.get("/offers/product-states");
  return response.data;
};

function CreateOfferForm() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const debouncedTitle = useDebounce(title, 500);
  const [files, setFiles] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<
    {
      productCategoryAttributeId: string;
      value: string[];
    }[]
  >([]);

  const { data: offerStates } = useQuery({
    queryKey: ["offerStates"],
    queryFn: fetchOfferStates,
  });

  // console.log("files", files);

  const form = useForm<z.infer<typeof createOfferSchema>>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      productStateId: "",
      productId: "",
    },
  });

  // console.log(form.formState.errors);

  const onSubmit = async (values: z.infer<typeof createOfferSchema>) => {
    console.log(values);
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("productStateId", values.productStateId);

    for (const file of files) {
      formData.append("productImages", file);
    }

    const product = {
      name: values.title,
      description: values.description,
      categoryId: categoryId,
      attributes: attributes,
    };

    formData.append("product", JSON.stringify(product));

    const response = await axiosInstance.post("/offers/full", formData);
    console.log(response);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-lg flex flex-col gap-5"
      >
        {/* Zdjecia */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-xl flex gap-1">
                Zdjęcia <p className="text-red-500">*</p>
              </span>
            </CardTitle>
            <CardDescription>Dodaj zdjęcia do 5MB</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <Button
              variant="outline"
              className="w-full py-10 flex flex-col h-full border-dashed border-black"
            >
              <Plus />
              <p>Dodaj zdjęcia</p>
            </Button> */}
            <Input
              type="file"
              multiple
              placeholder="Wybierz zdjęcia"
              onChange={(e) => {
                setFiles([...Array.from(e.target.files ?? [])]);
              }}
            />
          </CardContent>
        </Card>

        {/* Tytul oferty */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-xl flex gap-1">
                Tytuł oferty <p className="text-red-500">*</p>
              </span>
            </CardTitle>
            <CardDescription>
              Podaj tytuł oferty, im dokładniej, tym lepiej
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Tytuł"
                      onChange={(e) => {
                        field.onChange(e);
                        setTitle(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Kategoria */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-xl flex gap-1">
                Kategoria <p className="text-red-500">*</p>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <SuggestedCategories
              query={debouncedTitle}
              form={form}
              setCategoryId={setCategoryId}
            />
            <Button variant="outline" className="w-full py-5">
              Wszystkie kategorie
            </Button>
          </CardContent>
        </Card>

        {/* Produkty */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-xl flex gap-1">
                Produkty <p className="text-red-500">*</p>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <div className="flex gap-2 items-center border px-2 py-4 rounded-lg">
                        <RadioGroupItem value="1" id="1" />
                        <Label htmlFor="1" className="text-md">
                          Żaden z powyższych
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Cechy produktu */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-xl flex gap-1">
                Cechy produktu <p className="text-red-500">*</p>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryAttributes
              categoryId={categoryId}
              setFormAttributes={setAttributes}
            />
          </CardContent>
        </Card>

        {/* Opis */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-xl flex gap-1">Opis</span>
            </CardTitle>
            <CardDescription>Podaj szczegółowy opis oferty</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Opis"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Cena */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-xl flex gap-1">
                Cena <p className="text-red-500">*</p>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Cena" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Stan */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-xl flex gap-1">
                Stan <p className="text-red-500">*</p>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="productStateId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {offerStates?.map((state: any) => (
                        <div
                          className="flex gap-2 items-center border px-2 py-4 rounded-lg"
                          key={state.id}
                        >
                          <RadioGroupItem value={state.id} id={state.id} />
                          <div>
                            <Label
                              htmlFor={state.id}
                              className="text-md font-semibold"
                            >
                              {state.name}
                            </Label>
                            <p className="text-md text-gray-600">
                              {state.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full mb-5">
          Dodaj ofertę
        </Button>
      </form>
    </Form>
  );
}

export default CreateOfferForm;
