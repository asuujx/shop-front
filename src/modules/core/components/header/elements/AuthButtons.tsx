import { useUser } from "@/modules/core/providers/userProvider";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import UserDropdown from "./UserDropdown";

function AuthButtons() {
  const { user } = useUser();
  
  return (
    <div>
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

export default AuthButtons