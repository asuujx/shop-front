import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/themeProvider";
import { useUser } from "@/providers/userProvider";
import { CircleDollarSign, Laptop, LogOut, Moon, Palette, ShoppingBag, Sun, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface UserDropdownProps {
  firstName: string;
  lastName: string;
}

function UserDropdown({ firstName, lastName }: UserDropdownProps) {
  const user = `${firstName} ${lastName}`;
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
          <CircleDollarSign />
          <Link to="/user/offers">Moje oferty</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShoppingBag />
          <Link to="user/orders">Moje zamówienia</Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette />
            <span>Motyw</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun />
                <span>Tryb jasny</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon />
                <span>Tryb ciemny</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop />
                <span>Systemowy</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Wyloguj</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
