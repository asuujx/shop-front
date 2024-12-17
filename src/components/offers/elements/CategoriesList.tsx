import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon, List } from "lucide-react";
import { useState } from "react";
import { Category } from "types";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

interface CategoriesListProps {
  setCategory: (category: Category) => void;
}

const fetchBaseCategories = async () => {
  const response = await axiosInstance.get<Category[]>("/categories/base");
  return response.data;
};

function CategoriesList({ setCategory }: CategoriesListProps) {
  const {
    data: categories,
    isLoading,
    status,
  } = useQuery({
    queryKey: ["categories", "base"],
    queryFn: fetchBaseCategories,
  });

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
      setCategory(category);
      setDialogOpen(false);
      setSelectedCategories(categories!);
      setSelectedCategoriesPath([]);
    }
  };

  const handleBackClick = () => {
    const path = [...selectedCategoriesPath];
    path.pop();

    if (!path.length) {
      setSelectedCategories(categories!);
      setSelectedCategoriesPath(path);
      return;
    }

    let category: Category | null = null;

    for (const id of path) {
      category = categories!.find((category) => category.id === id)!;
    }

    setSelectedCategories(category!.children);
    setSelectedCategoriesPath(path);
  };

  if (status === "success" && !selectedCategories.length) {
    setSelectedCategories(categories);
  }

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setSelectedCategories(categories!);
      setSelectedCategoriesPath([]);
    }
  };

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center"
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

          {selectedCategories.map((category: Category) => (
            <Button
              key={category.id}
              type="button"
              variant="ghost"
              onClick={() => handleCategoryClick(category)}
              className="flex items-center justify-between"
            >
              {category.name}
              {!!category?.children.length && <ChevronRightIcon />}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CategoriesList;