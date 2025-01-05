import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/modules/core/components/ui/form";
import { Label } from "@/modules/core/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/modules/core/components/ui/radio-group";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { createOfferSchema } from "@/modules/offers/schemas/createOfferSchema";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { Category } from "types";
import { z } from "zod";

interface SuggestedCategoriesProps {
  query: string;
  form: UseFormReturn<z.infer<typeof createOfferSchema>>;
  category: Category | null;
  // setCategory: (category: Category) => void;
  handleChangeSelectedCategory: (category: Category | null) => void;
}

const fetchCategories = async (query: string) => {
  const response = await axiosInstance.get<Category[]>(
    `/categories/suggestions?query=${query}`
  );
  return response.data;
};

function SuggestedCategories({
  query,
  form,
  category,
  handleChangeSelectedCategory
}: SuggestedCategoriesProps) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", "suggested", query],
    queryFn: () => fetchCategories(query),
    enabled: query.length >= 3,
  });

  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              defaultValue={category?.id ?? "(null)"}
              value={category?.id ?? "(null)"}
              onValueChange={(value) => {
                if (categoriesQuery.data === undefined) return;
                handleChangeSelectedCategory(value !== "(null)" ? categoriesQuery.data.find((category) => category.id === value)! : null);
                field.onChange(value);
              }}
              className="flex flex-col gap-2"
            >
              {category && (
                <div
                  className="bg-background flex items-center gap-2 border rounded-lg px-2 py-4"
                  key={category.id}
                >
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label htmlFor={category.id}>{category.name}</Label>
                </div>
              )}
              {categoriesQuery.data
                ?.filter(
                  (_category) => _category.id !== (category?.id ?? false)
                )
                .map((category: any) => (
                  <div
                    className="bg-background flex items-center gap-2 border rounded-lg px-2 py-4"
                    key={category.id}
                  >
                    <RadioGroupItem value={category.id} id={category.id} />
                    <Label htmlFor={category.id}>{category.name}</Label>
                  </div>
                ))}
              {categoriesQuery.isLoading && (
                <div>
                  <p>Wczytywanie sugestii..</p>
                </div>
              )}
              {categoriesQuery.isError && (
                <div>
                  <p className="text-destructive">
                    Wystąpił błąd podczas pobierania sugestii
                  </p>
                </div>
              )}
              <div
                className="bg-background flex items-center gap-2 border rounded-lg px-2 py-4"
                key={"(null)"}
              >
                <RadioGroupItem value={"(null)"} id={"(null)"} />
                <Label>Nie wybrano kategorii</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SuggestedCategories;
