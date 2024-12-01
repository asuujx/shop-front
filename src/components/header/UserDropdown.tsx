import { useUser } from "@/providers/userProvider";
import { LogOut, Moon, ShoppingBag, Sun, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface UserDropdownProps {
  firstName: string;
  lastName: string;
}

function UserDropdown({ firstName, lastName }: UserDropdownProps) {
  const user = `${firstName} ${lastName}`;
  const [toggleTheme, setToggleTheme] = useState("light");
  const { logout } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <p>{user}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <User />
          <Link to="/user">Konto</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShoppingBag />
          <span>Zamówienia</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {toggleTheme === "light" ? (
            <div className="flex gap-2">
              <Moon />
              <span>Tryb ciemny</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <Sun />
              <span>Tryb jasny</span>
            </div>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          <span>Wyloguj</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
