import { Button } from "@/modules/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/core/components/ui/dialog";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { createOfferSchema } from "@/modules/offers/schemas/createOfferSchema";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon, List } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Category } from "types";
import { z } from "zod";

interface CategoriesListProps {
  form: UseFormReturn<z.infer<typeof createOfferSchema>>;
  category: Category | null;
  // setCategory: (category: Category) => void;
  handleChangeSelectedCategory: (category: Category | null) => void
}

const fetchBaseCategories = async () => {
  const response = await axiosInstance.get<Category[]>("/categories/base");
  return response.data;
};

function CategoriesList({ form, category, handleChangeSelectedCategory }: CategoriesListProps) {
  const { data: categories, status } = useQuery({
    queryKey: ["categories", "base"],
    queryFn: fetchBaseCategories,
  });

  console.log(categories);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedCategoriesPath, setSelectedCategoriesPath] = useState<
    string[]
  >([]);

  const handleCategoryClick = (category: Category) => {
    if (!!category?.children.length) {
      setSelectedCategoriesPath([...selectedCategoriesPath, category.id]);
      setSelectedCategories(category.children);
    } else {
      form.setValue("categoryId", category.id);
      handleChangeSelectedCategory(category);
      setDialogOpen(false);
      setSelectedCategories(categories!);
      setSelectedCategoriesPath([]);
    }
  };

  const handleBackClick = () => {
    const path = [...selectedCategoriesPath];
    path.pop();

    if (!path.length) {
      setSelectedCategories(categories ?? []);
      setSelectedCategoriesPath([]);
      return;
    }

    if (categories) {
      let category: Category | null = null;

      for (const id of path) {
        const foundCategory = categories.find((category) => category.id === id);

        if (!foundCategory) {
          return;
        }

        category = foundCategory
      }

      if (category) {
        setSelectedCategories(category.children);
        setSelectedCategoriesPath(path);
      }
    };
  }

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setSelectedCategories(categories ?? []);
      setSelectedCategoriesPath([]);
    }
  };

  useEffect(() => {
    if (categories && !!categories.length) {
      setSelectedCategories(categories);
    }
  }, [categories]);

  return (
    <div>
      <Dialog open={dialogOpen}
        onOpenChange={onOpenChange}
      >
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center"
            disabled={!categories?.length}
          >
            <List />
            <p>Wszystkie kategorie</p>
          </Button>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Wybierz kategorię</DialogTitle>
          </DialogHeader>
          {selectedCategoriesPath.length > 0 && (
            <Button
              type="button"
              onClick={handleBackClick}
              className="w-fit flex justify-start"
            >
              <ChevronLeftIcon />
              <p>Wróć</p>
            </Button>
          )}

          {selectedCategories.map((_category: Category) => (
            <Button
              key={_category.id}
              type="button"
              variant="ghost"
              onClick={() => handleCategoryClick(_category)}
              className={clsx(
                category &&
                _category.id === category.id &&
                "bg-primary text-primary-foreground",
                "flex items-center justify-between"
              )}
            >
              {_category.name}
              {!!_category?.children.length && <ChevronRightIcon />}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CategoriesList;
