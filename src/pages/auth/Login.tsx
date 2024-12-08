import EmailDialog from "@/components/auth/login/EmailDialog";
import LoginForm from "@/components/auth/login/LoginForm";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [open, setOpen] = useState(false);

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
          <EmailDialog open={open} setOpen={setOpen} />
        </div>
      </div>
    </div>
  );
}

export default Login