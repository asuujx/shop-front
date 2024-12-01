import { useUser } from "@/providers/userProvider";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import UserDropdown from "./UserDropdown";

function Header() {
  const { user } = useUser();

  return (
    <div className="w-full top-0 pt-2 px-5 flex justify-between">
      <Link to="/" className="font-bold">
        Placeholder
      </Link>
      {user ? (
        <UserDropdown firstName={user.firstName} lastName={user.lastName} />
      ) : (
        <div className="flex gap-2">
          <Button variant="outline">
            <Link to="/login">Zaloguj</Link>
          </Button>
          <Button>
            <Link to="/signup">Zarejestruj się</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default Header;
