import { AttributeDataType } from "@/../types";
import { Button } from "@/modules/core/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/core/components/ui/form";
import { Input } from "@/modules/core/components/ui/input";
import { MultiSelect } from "@/modules/core/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/core/components/ui/select";
import { Textarea } from "@/modules/core/components/ui/textarea";
import { toast } from "@/modules/core/hooks/use-toast";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Product } from "./ProductConfirmation";

const MAX_FILE_SIZE = 500000;
const IMAGE_TYPE = "image/";

interface ProductConfirmationDialogFormProps {
  productData: Product;
  closeDialog: () => void;
}

interface LeafCategory {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  breadcrumb: string[];
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  attributes: LeafCategoryAttribute[];
}

interface LeafCategoryAttribute {
  id: string;
  name: string;
  dataType: AttributeDataType;
  required: boolean;
  unit: string | null;
  isMultiSelect: boolean;
  options: LeafCategoryAttributeOption[];
}

interface LeafCategoryAttributeOption {
  id: string;
  value: string;
}

const getLeafCategoriesQueryFn = async () => {
  const response = await axiosInstance.get<LeafCategory[]>("/categories/leaf");
  return response.data;
};

const upsertProductMutationFn = async (data: {
  id: string;
  form: FormData;
}) => {
  const response = await axiosInstance.put(`products/${data.id}`, data.form);
  return response.data;
};

const rejectProductMutationFn = async (id: string) => {
  const response = await axiosInstance.patch(`products/${id}/reject`);
  return response.data;
};

const getImagesData = (images: File[]) => {
  return images.map((image) => ({
    file: image,
    displayUrl: URL.createObjectURL(image),
  }));
};

const Attribute = z.object({
  productCategoryAttributeId: z.string().uuid(),
  value: z.array(z.string()),
});

const images = z
  .object({
    existingImages: z.array(z.object({ id: z.string(), url: z.string() })),
    newImages: z
      .array(z.object({ file: z.instanceof(File), displayUrl: z.string() }))
      .max(5, "Maksymalnie można dodać 5 zdjęć.")
      .refine(
        (images) => images.every((image) => image.file.size <= MAX_FILE_SIZE),
        "Co najmniej jedno zdjęcie posiada zbyt duży rozmiar."
      )
      .refine(
        (images) =>
          images.every((image) => image.file.type.startsWith(IMAGE_TYPE)),
        "Co najmniej jedno zdjęcie nie jest obrazem."
      ),
  })
  .superRefine((data, ctx) => {
    const existingImages = data.existingImages;
    const newImages = data.newImages;

    if (existingImages.length + newImages.length > 5) {
      ctx.addIssue({
        message: "Maksymalnie można dodać 5 zdjęć.",
        code: "custom",
        path: ["images"],
      });
    }
  });

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  images: images,
  attributes: z.array(Attribute),
});

const ProductConfirmationDialogForm = ({
  productData,
  closeDialog,
}: ProductConfirmationDialogFormProps) => {
  const [joinedAttributes, setJoinedAttributes] = useState<
    {
      dbData: LeafCategoryAttribute;
      value: string[];
    }[]
  >([]);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: productData.name,
      description: productData?.description ?? "",
      categoryId: productData.categoryId,
      images: {
        existingImages: productData.images.map((image) => ({
          id: image.id,
          url: image.url,
        })),
        newImages: [],
      },
      attributes: productData.attributes.map((attribute) => ({
        productCategoryAttributeId: attribute.categoryAttributeId,
        value: attribute.options.map((option) => option.id),
      })),
    },
  });

  const watchExistingImages = form.watch("images.existingImages");
  const watchNewImages = form.watch("images.newImages");
  const watchCategoryId = form.watch("categoryId");

  const leafCategoriesQuery = useQuery({
    queryKey: ["categories", "leaf"],
    queryFn: getLeafCategoriesQueryFn,
  });

  const upsertProductMutation = useMutation({
    mutationKey: ["products", "upsert"],
    mutationFn: upsertProductMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Produkt został pomyślnie potwierdzony" });
      closeDialog();
    },
    onError: () => {
      toast({
        title: "Wystąpił błąd podczas potwierdzania produktu",
        variant: "destructive",
      });
    },
  });

  const rejectProductMutation = useMutation({
    mutationKey: ["products", "reject"],
    mutationFn: rejectProductMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Produkt został pomyślnie odrzucony" });
      closeDialog();
    },
    onError: () => {
      toast({
        title: "Wystąpił błąd podczas odrzucania produktu",
        variant: "destructive",
      });
    },
  });

  const onUploadNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const newImages = getImagesData(Array.from(files));
    form.setValue("images.newImages", newImages);
  };

  const onRemoveExistingImage = (index: number) => {
    const existingImages = form.getValues("images.existingImages");

    form.setValue(
      "images.existingImages",
      existingImages.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);

    const newImages = values.images.newImages.map((image) => image.file);
    const existingImages = values.images.existingImages.map(
      (image) => image.id
    );

    const form = new FormData();
    form.append("name", values.name);
    form.append("categoryId", values.categoryId);
    form.append("attributes", JSON.stringify(values.attributes));
    form.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((image) => form.append("newImages", image));
    if (values.description) form.append("description", values.description);

    await upsertProductMutation.mutateAsync({ id: productData.id, form });
  };

  const onRejectProduct = async () => {
    rejectProductMutation.mutate(productData.id);
  };

  useEffect(() => {
    if (!leafCategoriesQuery.isLoading && leafCategoriesQuery.data) {
      const category = leafCategoriesQuery.data.find(
        (category) => category.id === watchCategoryId
      )!;

      const updatedAttributes: {
        dbData: LeafCategoryAttribute;
        value: string[];
      }[] = category.attributes.map((attribute) => {
        const productAttribute = productData.attributes.find(
          (attr) => attr.categoryAttributeId === attribute.id
        );

        if (productAttribute) {
          return {
            dbData: attribute,
            value: productAttribute?.value
              ? [productAttribute.value]
              : productAttribute.options.map((option) => option.id),
          };
        } else {
          return {
            dbData: attribute,
            value: [""],
          };
        }
      });

      setJoinedAttributes(updatedAttributes);
      form.setValue(
        "attributes",
        updatedAttributes.map((attr) => ({
          productCategoryAttributeId: attr.dbData.id,
          value: attr.value,
        }))
      );
    }
  }, [leafCategoriesQuery.data, watchCategoryId]);

  const isReady = !leafCategoriesQuery.isLoading && leafCategoriesQuery.data;
  if (!isReady) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Nazwa */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Nazwa produktu widoczna dla klientów.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Opis */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  Opcjonalny opis produktu widoczny dla klientów.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Kategoria */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz kategorię..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {leafCategoriesQuery.data.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Wybierz kategorię, do której należy produkt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Zdjęcia */}
          <FormField
            control={form.control}
            name="images"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Zdjęcia</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {watchExistingImages.map((image, index) => (
                    <div className="relative" key={image.id}>
                      <img
                        crossOrigin="anonymous"
                        src={`${import.meta.env.VITE_API_BASE_URL}/${image.url}`}
                        alt=""
                        className="w-full h-24 object-cover"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 w-8 h-8"
                        onClick={() => onRemoveExistingImage(index)}
                      >
                        <X />
                      </Button>
                    </div>
                  ))}
                  {watchNewImages.map((image, index) => (
                    <img
                      key={index}
                      src={image.displayUrl}
                      alt=""
                      className="w-full h-24 object-cover"
                    />
                  ))}
                </div>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    {...rest}
                    onChange={onUploadNewImages}
                  />
                </FormControl>
                <FormDescription>
                  Dodaj zdjęcia produktu. Maksymalny rozmiar pliku to 5MB.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Attributes */}
          {joinedAttributes.map(
            ({ dbData: attributeDbData, value: attributeValue }) => (
              <FormField
                key={attributeDbData.id}
                control={form.control}
                name="attributes"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>
                      {attributeDbData.name}
                      {attributeDbData?.unit
                        ? ` (${attributeDbData.unit})`
                        : ""}
                    </FormLabel>
                    <FormControl>
                      <>
                        {attributeDbData.dataType !==
                          AttributeDataType.DICTIONARY && (
                          <Input
                            type="text"
                            value={attributeValue[0] ?? ""}
                            onChange={(e) => {
                              setJoinedAttributes((prev) =>
                                prev.map((item) =>
                                  item.dbData.id === attributeDbData.id
                                    ? { ...item, value: [e.target.value] }
                                    : item
                                )
                              );
                              onChange(
                                value.map((item) =>
                                  item.productCategoryAttributeId ===
                                  attributeDbData.id
                                    ? { ...item, value: [e.target.value] }
                                    : item
                                )
                              );
                            }}
                          />
                        )}
                        {attributeDbData.dataType ===
                          AttributeDataType.DICTIONARY &&
                          (attributeDbData.isMultiSelect ? (
                            <MultiSelect
                              modalPopover
                              options={attributeDbData.options}
                              value={
                                attributeValue[0] === "" ? [] : attributeValue
                              }
                              onValueChange={(selectedValues) => {
                                setJoinedAttributes((prev) =>
                                  prev.map((item) =>
                                    item.dbData.id === attributeDbData.id
                                      ? { ...item, value: selectedValues }
                                      : item
                                  )
                                );

                                onChange(
                                  value.map((item) =>
                                    item.productCategoryAttributeId ===
                                    attributeDbData.id
                                      ? { ...item, value: selectedValues }
                                      : item
                                  )
                                );
                              }}
                            />
                          ) : (
                            <Select
                              value={attributeValue[0] ?? ""}
                              onValueChange={(selectedValue) => {
                                setJoinedAttributes((prev) =>
                                  prev.map((item) =>
                                    item.dbData.id === attributeDbData.id
                                      ? { ...item, value: [selectedValue] }
                                      : item
                                  )
                                );

                                onChange(
                                  value.map((item) =>
                                    item.productCategoryAttributeId ===
                                    attributeDbData.id
                                      ? { ...item, value: [selectedValue] }
                                      : item
                                  )
                                );
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Wybierz..." />
                              </SelectTrigger>
                              <SelectContent>
                                {attributeDbData.options.map((option) => (
                                  <SelectItem key={option.id} value={option.id}>
                                    {option.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ))}
                      </>
                    </FormControl>
                    <FormDescription>
                      {attributeDbData.required
                        ? "To pole jest wymagane."
                        : "To pole jest opcjonalne."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          )}

          <Button
            type="button"
            variant="destructive"
            disabled={
              form.formState.isSubmitting ||
              upsertProductMutation.isPending ||
              rejectProductMutation.isPending
            }
            className="mr-2"
            onClick={onRejectProduct}
          >
            Odrzuć produkt
          </Button>
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              upsertProductMutation.isPending ||
              rejectProductMutation.isPending
            }
          >
            Zatwierdź produkt
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default ProductConfirmationDialogForm;
