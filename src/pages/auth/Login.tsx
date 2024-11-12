import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="w-screen h-screen">
      <div className="w-full top-0 pt-2 px-5">
        <Link to="/" className="font-bold">
          Placeholder
        </Link>
      </div>

      <div className="w-full h-fit mt-20 flex flex-col items-center justify-center">
        <h1 className="mb-5 text-4xl font-semibold">Zaloguj się</h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login