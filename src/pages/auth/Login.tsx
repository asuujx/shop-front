import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="w-screen h-screen">
      <div className="w-full top-0 pt-2 px-5 flex justify-between items-center">
        <Link to="/" className="font-bold">
          Placeholder
        </Link>
        <Link to="/signup" className="underline font-semibold">
          Zarejestruj się
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="mb-10 text-5xl font-semibold">Zaloguj się</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login