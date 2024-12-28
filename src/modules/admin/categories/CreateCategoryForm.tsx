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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Category } from "./Categories";
import CreateCategoryFormAttributes from "./CreateCategoryFormAttributes";

interface CreateCategoryFormProps {
  data: Category[];
}

export interface Attribute {
  name: string;
  dataType: string;
  required: string;
  unit: string;
  isMultiSelect: string;
  options: string;
}

export const attributeSchema = z
  .object({
    name: z.string().min(3),
    dataType: z.enum(["integer", "float", "string", "dictionary"]),
    required: z.enum(["true", "false"]).transform((val) => val === "true"),
    unit: z.string(),
    isMultiSelect: z.enum(["true", "false"]).transform((val) => val === "true"),
    options: z
      .string()
      .transform((val) => val?.split(",").map((val) => val.trim())),
  })
  .superRefine((data, ctx) => {
    if (data.dataType === "integer" || data.dataType === "float") {
      if (!data.unit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["unit"],
          message: "unit is required for integer and float attributes",
        });
      }
    }
  });

const createCategory = async (data: any) => {
  const response = await axiosInstance.post<Category>("/categories", data);
  return response.data;
};

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  // .transform((val) => (val === "" ? null : val)),
  iconUrl: z.string().optional(),
  // .transform((val) => (val === "" ? null : val)),
  parentId: z.string().uuid().optional().or(z.literal("(null)")),
  // .transform((val) => (val === "" ? null : val)),
});
//   .superRefine((data, ctx) => {});

const CreateCategoryForm = ({ data }: CreateCategoryFormProps) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      iconUrl: "",
      parentId: "(null)",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-category"],
    mutationFn: (data: any) => createCategory(data),
    onSuccess: () => {
      form.reset();
      setAttributes([]);
      toast({ title: "Kategoria została utworzona", variant: "default" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const parsedAttributes = attributeSchema.array().safeParse(attributes);

    if (!parsedAttributes.success) {
      return;
    }

    const transformedAttributes = parsedAttributes.data.map((attribute) => {
      const isDictionary = attribute.dataType === "dictionary";
      return {
        ...attribute,
        options: isDictionary ? attribute.options : [],
        isMultiSelect: isDictionary ? attribute.isMultiSelect : null,
        unit: isDictionary ? null : attribute.unit,
      };
    });

    const body = {
      ...values,
      parentId: values.parentId === "(null)" ? null : values.parentId,
      attributes: transformedAttributes,
    };
    // console.log(body);

    await mutateAsync(body);
  };

  const categoriesWithoutAttributes = data.filter(
    (category) => category.attributes.length === 0
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa*</FormLabel>
              <FormControl>
                <Input placeholder="Elektronika" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Elektronika"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="iconUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ścieżka do ikony</FormLabel>
              <FormControl>
                <Input placeholder="images/icons/example.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria nadrzędna</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="(null)">Brak</SelectItem>
                  {categoriesWithoutAttributes.map((category) => (
                    <SelectItem value={category.id} key={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <CreateCategoryFormAttributes
          attributes={attributes}
          setAttributes={setAttributes}
        />
        <Button type="submit" disabled={isPending}>
          Zapisz kategorię
        </Button>
      </form>
    </Form>
  );
};
export default CreateCategoryForm;
