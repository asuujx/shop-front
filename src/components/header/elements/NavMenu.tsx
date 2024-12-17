import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Category } from "types";

const fetchBaseCategories = async () => {
  const response = await axiosInstance.get<Category[]>("/categories/base");
  return response.data;
}

function NavMenu() {
    const { data: categories, status } = useQuery({
      queryKey: ["categories", "base"],
      queryFn: fetchBaseCategories,
    });

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedCategoriesPath, setSelectedCategoriesPath] = useState<
    string[]
  >([]);

const handleCategoryClick = (category: Category) => {
  if (!!category?.children.length) {
    setSelectedCategoriesPath([...selectedCategoriesPath, category.id]);
    setSelectedCategories(category.children);
  } else {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Kategorie</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavMenu;
