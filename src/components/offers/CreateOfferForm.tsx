import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios-instance";
import { createOfferSchema } from "@/lib/schemas/createOfferSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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

const createOfferMutationFn = async ({ endpoint, formData }: { endpoint: string, formData: FormData }) => {
  const response = await axiosInstance.post(endpoint, formData);
  return response.data;
};

const createImagesPreview = (images: File[]) => {
  return images.map((image, index) => ({
    id: index.toString(),
    previewUrl: URL.createObjectURL(image),
  }));
};

function CreateOfferForm() {
  const form = useForm<z.infer<typeof createOfferSchema>>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      images: [],
      title: "",
      description: "",
      price: 1,
      categoryId: "(null)",
      productId: "(null)",
      productStateId: "",
      attributes: []
    },
  });

  const watchTitle = form.watch("title");
  const watchCategoryId = form.watch("categoryId");
  const debouncedTitle = useDebounce(watchTitle, 500);

  const [images, setImages] = useState<{ id: string; previewUrl: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryAttributes, setCategoryAttributes] = useState<
    {
      dbData: Attribute;
      value: string[];
    }[]
  >([]);

  const { data: categoryAttributesData } = useQuery<Attribute[]>({
    queryKey: ["categoryAttributes", selectedCategory?.id],
    queryFn: () => fetchCategoryAttributes(selectedCategory!.id),
    enabled: !!selectedCategory?.id,
  });

  const { mutate: mutateCreateOffer } = useMutation({
    mutationKey: ["createOffer"],
    mutationFn: createOfferMutationFn,
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Twoja oferta została dodana pomyślnie.",
      });
      form.reset();
      setImages([]);
      setSelectedCategory(null);
      setSelectedProduct(null);
      setCategoryAttributes([]);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Wystąpił błąd",
        description: "Nie udało się dodać oferty.",
      });
    }
  })

  const { data: offerStates } = useQuery({
    queryKey: ["offerStates"],
    queryFn: fetchOfferStates,
  });

  const handleChangeAttributeValue = (id: string, value: string[]) => {
    const updatedAttributes = categoryAttributes.map((attribute) =>
      attribute.dbData.id === id ? { ...attribute, value } : attribute
    );

    form.setValue("attributes", updatedAttributes.map(attribute => ({ productCategoryAttributeId: attribute.dbData.id, value: attribute.value })));
    setCategoryAttributes([...updatedAttributes]);
  };

  const updateAttributeValues = (product: Product | null) => {
    if (!product) {
      const updatedAttributes = categoryAttributes.map((attribute) => ({
        ...attribute,
        value: [""],
      }));
      setCategoryAttributes(() => [...updatedAttributes]);
      form.setValue("attributes", updatedAttributes.map(attribute => ({ productCategoryAttributeId: attribute.dbData.id, value: attribute.value })));
    } else {
      const updatedAttributes = categoryAttributes.map((attribute) => {
        const productAttribute = product.attributes.find(
          (productAttribute) =>
            productAttribute.categoryAttributeId === attribute.dbData.id
        );
        const value = productAttribute
          ? (productAttribute?.value
            ? [productAttribute.value]
            : (productAttribute.options.length > 0 ? productAttribute.options.map((option) => option.id) : [""]))
          : [""];

        return { ...attribute, value };
      });
      setCategoryAttributes(() => [...updatedAttributes]);
      form.setValue("attributes", updatedAttributes.map(attribute => ({ productCategoryAttributeId: attribute.dbData.id, value: attribute.value })));
    }
  };

  const handleAutoFillClick = (product: Product) => {
    updateAttributeValues(product);
    setSelectedProduct(null);
    form.setValue("productId", "(null)");
  };

  const handleChangeSelectedProduct = (product: Product | null) => {
    updateAttributeValues(product);
    setSelectedProduct(() => product);
    form.setValue("productId", product ? product.id : "(null)");
  };

  const onSubmit = async (values: z.infer<typeof createOfferSchema>) => {
    console.log("onSubmit: ", values);

    // Attribute validation
    const missingRequiredAttributes = categoryAttributes.filter(
      (attribute) =>
        attribute.dbData.required && attribute.value[0] === ""
    );

    if (missingRequiredAttributes.length > 0 && !selectedProduct) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: `Uzupełnij wszystkie wymagane cechy produktu: ${missingRequiredAttributes.map((attribute) => attribute.dbData.name).join(", ")}.`,
      });

      return;
    }

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("productStateId", values.productStateId);

    for (const file of values.images) {
      formData.append("productImages", file);
    }

    let endpoint: string;

    if (values.productId !== "(null)") {
      formData.append("productId", values.productId);
      endpoint = "/offers";
    } else {
      const transformedAttributes = values.attributes.filter(attribute => attribute.value[0] !== "");
      const product = {
        name: values.title,
        description: values.description,
        categoryId: values.categoryId,
        attributes: transformedAttributes,
      };
      formData.append("product", JSON.stringify(product));
      endpoint = "/offers/full";
    }

    mutateCreateOffer({ endpoint, formData });

    // await axiosInstance
    //   .post(endpoint, formData)
    //   .then((response) => {
    //     if (response.status === 201) {
    //       toast({
    //         title: "Sukces",
    //         description: "Twoja oferta została dodana pomyślnie.",
    //       });
    //       form.reset();
    //       setImages([]);
    //       // setTitle("");
    //       setSelectedCategory(null);
    //       setSelectedProduct(null);
    //       setCategoryAttributes([]);
    //     }
    //   })
    //   .catch(() => {
    //     toast({
    //       variant: "destructive",
    //       title: "Wystąpił błąd",
    //       description: "Nie udało się dodać oferty.",
    //     });
    //   });
  };

  useEffect(() => {
    if (!categoryAttributesData) return;

    const transformedAttributes = categoryAttributesData.map((categoryAttribute) => ({
      dbData: categoryAttribute,
      value: [""],
    }));

    setCategoryAttributes(transformedAttributes);
    form.setValue("attributes", transformedAttributes.map(attribute => ({ productCategoryAttributeId: attribute.dbData.id, value: attribute.value })));
  }, [categoryAttributesData]);

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
              Dodaj zdjęcia, maksymalnie 5, maksymalnie 5 MB każde
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 min-[385px]:grid-cols-3 min-[530px]:grid-cols-5 gap-2 mb-5">
              {images.map((image) => (
                <img
                  key={image.id}
                  src={image.previewUrl}
                  alt="preview"
                  className="w-full object-cover object-center"
                />
              ))}
            </div>
            <FormField
              control={form.control}
              name="images"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...rest}
                      type="file"
                      multiple
                      onChange={(e) => {
                        // Clean up previous images
                        images.forEach((image) =>
                          URL.revokeObjectURL(image.previewUrl)
                        );

                        const files = Array.from(e.target.files ?? []);
                        setImages(() => createImagesPreview(files));
                        onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              Podaj tytuł oferty, im dokładniej, tym lepiej. Wymagane są co
              najmniej 5 znaków.
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
            <CardDescription>
              Wybierz kategorię produktu. Propozycje pojawią się, gdy tytuł
              posiada co najmniej 3 znaki.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <SuggestedCategories
              query={debouncedTitle}
              form={form}
              category={selectedCategory}
              setCategory={setSelectedCategory}
            />
            <CategoriesList
              form={form}
              category={selectedCategory}
              setCategory={setSelectedCategory}
            />
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
              {/* Wybierz gotowy produkt z listy, dodaj nowy lub autouzupełnij pola
              formularza na bazie wybranego produktu */}
              Wybierz produkt, skorzystaj z opcji autouzupełniania na bazie
              produktu z listy, lub utwórz zupełnie nowy wprowadzając wymagane
              cechy. Propozycje pojawią się na podstawie tytułu oraz wybranej
              kategorii.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <SuggestedProducts
              query={debouncedTitle}
              categoryId={watchCategoryId}
              form={form}
              selectedProduct={selectedProduct}
              handleChangeSelectedProduct={handleChangeSelectedProduct}
              handleAutoFillClick={handleAutoFillClick}
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
            <CardDescription>
              Wybierz cechy produktu lub uzupełnij je ręcznie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryAttributes
              data={categoryAttributes}
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
                            <Label htmlFor={state.id} className="font-semibold">
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

        <Button type="submit" className="w-full mb-5" disabled={form.formState.isSubmitting}>
          Dodaj ofertę
        </Button>
      </form>
    </Form>
  );
}

export default CreateOfferForm;
