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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Attribute, Category, Product } from "types";
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
import CategoriesList from "./elements/CategoriesList";
import CategoryAttributes from "./elements/CategoryAttributes";
import SuggestedCategories from "./elements/SuggestedCategories";
import SuggestedProducts from "./elements/SuggestedProducts";

const fetchCategoryAttributes = async (categoryId: string) => {
  const response = await axiosInstance.get(
    `/categories/${categoryId}/attributes`
  );
  return response.data;
};

const fetchOfferStates = async () => {
  const response = await axiosInstance.get("/offers/product-states");
  return response.data;
};

function CreateOfferForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const debouncedTitle = useDebounce(title, 500);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [attributes, setAttributes] = useState<
    {
      dbData: Attribute;
      value: string[];
    }[]
  >([]);

  const form = useForm<z.infer<typeof createOfferSchema>>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      productStateId: "",
    },
  });

  const { data: categoryAttributes } = useQuery<Attribute[]>({
    queryKey: ["categoryAttributes", category?.id],
    queryFn: () => fetchCategoryAttributes(category!.id),
    enabled: !!category?.id,
  });

  const { data: offerStates } = useQuery({
    queryKey: ["offerStates"],
    queryFn: fetchOfferStates,
  });

  const handleChangeAttributeValue = (id: string, value: string[]) => {
    const updatedAttributes = attributes.map((attribute) =>
      attribute.dbData.id === id ? { ...attribute, value } : attribute
    );
    setAttributes([...updatedAttributes]);
  };

  const updateAttributes = (product: Product | null) => {
    if (!product) {
      const updatedAttributes = attributes.map((attribute) => ({
        ...attribute,
        value: [""],
      }));
      setAttributes(() => [...updatedAttributes]);
    } else {
      const updatedAttributes = attributes.map((attribute) => {
        const productAttribute = product.attributes.find(
          (productAttribute) =>
            productAttribute.categoryAttributeId === attribute.dbData.id
        );
        const value = productAttribute
          ? productAttribute?.value
            ? [productAttribute.value]
            : productAttribute.options.map((option) => option.id)
          : [""];

        return { ...attribute, value };
      });
      setAttributes(() => [...updatedAttributes]);
    }
  };

  const handleAutoFillClick = (product: Product) => {
    updateAttributes(product);
    setSelectedProduct(null);
  };

  const handleChangeSelectedProduct = (product: Product | null) => {
    updateAttributes(product);
    setSelectedProduct(() => product);
  };

  const onSubmit = async (values: z.infer<typeof createOfferSchema>) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("productStateId", values.productStateId);

    for (const file of files) {
      formData.append("productImages", file);
    }

    let endpoint: string;

    if (selectedProduct) {
      formData.append("productId", selectedProduct.id);
      endpoint = "/offers";
    } else {
      const product = {
        name: values.title,
        description: values.description,
        categoryId: category!.id,
        attributes: attributes,
      };
      formData.append("product", JSON.stringify(product));
      endpoint = "/offers/full";
    }

    await axiosInstance.post(endpoint, formData);
  };

  useEffect(() => {
    if (!categoryAttributes) return;

    const mapAttributes = categoryAttributes.map((categoryAttribute) => ({
      dbData: categoryAttribute,
      value: [""],
    }));

    setAttributes(mapAttributes);
  }, [categoryAttributes]);

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
            <CardDescription>
              Dodaj zdjęcia, maksymalnie 5, maksymalnie 5 MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="file"
              multiple
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
            <CardDescription>Wybierz kategorię produktu</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <SuggestedCategories
              query={debouncedTitle}
              form={form}
              category={category}
              setCategory={setCategory}
            />
            <CategoriesList setCategory={setCategory} />
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
            <CardDescription>
              Wybierz gotowy produkt z listy, dodaj nowy lub autouzupełnij pola
              formularza na bazie wybranego produktu
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <SuggestedProducts
              query={debouncedTitle}
              categoryId={category?.id ?? null}
              selectedProduct={selectedProduct}
              handleChangeSelectedProduct={handleChangeSelectedProduct}
              handleAutoFillClick={handleAutoFillClick}
            />
            <RadioGroup
              onValueChange={() => handleChangeSelectedProduct(null)}
            ></RadioGroup>
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
            <CardDescription>
              Wybierz cechy produktu lub uzupełnij je ręcznie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryAttributes
              data={attributes}
              handleChangeAttributeValue={handleChangeAttributeValue}
              isSuggestedProductSelected={!!selectedProduct}
            />
          </CardContent>
        </Card>

        {/* Opis */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="text-xl flex gap-1">
                Opis <p className="text-red-500">*</p>
              </span>
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
            <CardDescription>Podaj cenę oferty, w złotówkach</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Cena"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
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
            <CardDescription>Wybierz stan produktu</CardDescription>
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
                              className="font-semibold"
                            >
                              {state.name}
                            </Label>
                            <p className="text-xs text-gray-600">
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
