import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  parentId?: string;
  isLeaf: boolean;
  children?: Category[];
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get("/categories/base");
  return response.data;
};

const renderCategories = (categories: Category[]) => {
  return categories.map((category) => (
    <div key={category.id}>
      <DropdownMenuLabel className="font-bold">
        {category.name}
      </DropdownMenuLabel>
      {category.children && category.children.length > 0 && (
        <ul className="ml-4">
          {category.children.map((child) => (
            <li key={child.id}>
              {child.isLeaf ? (
                <DropdownMenuItem>{child.name}</DropdownMenuItem>
              ) : (
                <div>
                  <DropdownMenuLabel className="font-bold">
                    {child.name}
                  </DropdownMenuLabel>
                  {child.children && child.children.length > 0 && (
                    <ul className="ml-4">
                      {child.children.map((grandchild) => (
                        <DropdownMenuItem key={grandchild.id}>
                          {grandchild.name}
                        </DropdownMenuItem>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  ));
};

function NavMenu() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  console.log(categories);

    const handleCategoryClick = (categoryId: string) => {
      setOpenCategory(openCategory === categoryId ? null : categoryId);
    };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Kategorie</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4">
        {categories &&
          categories.map((category) => (
            <div key={category.id}>
              <DropdownMenuLabel
                className="font-bold cursor-pointer"
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </DropdownMenuLabel>
              {openCategory === category.id && (
                <div className="ml-4">
                  {renderCategories(category.children || [])}
                </div>
              )}
            </div>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavMenu;
