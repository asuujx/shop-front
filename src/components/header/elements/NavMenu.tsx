import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "types";

const fetchBaseCategories = async () => {
  const response = await axiosInstance.get<Category[]>("/categories/base");
  return response.data;
};

function NavMenu() {
  const { data: categories, status } = useQuery({
    queryKey: ["categories", "base"],
    queryFn: fetchBaseCategories,
  });

  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedCategoriesPath, setSelectedCategoriesPath] = useState<
    string[]
  >([]);

  const handleCategoryClick = (category: Category) => {
    if (!!category?.children.length) {
      setSelectedCategoriesPath([...selectedCategoriesPath, category.id]);
      setSelectedCategories(category.children);
    } else {
      navigate(`/products?categoryId=${category.id}`);
      setDropdownOpen(false);
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

  const onOpenChange = (dropdownOpen: boolean) => {
    setDropdownOpen(dropdownOpen);

    if (!dropdownOpen) {
      setSelectedCategories(categories!);
      setSelectedCategoriesPath([]);
    }
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Kategorie</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        {selectedCategoriesPath.length > 0 && (
          <Button
            type="button"
            onClick={handleBackClick}
            className="w-full flex justify-start"
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
            className="w-full flex items-center justify-between"
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
