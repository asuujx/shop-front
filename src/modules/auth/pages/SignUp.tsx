import { Link } from "react-router-dom";
import SignUpForm from "../components/signup/SignUpForm";

function SignUp() {
  return (
    <div className="max-w-screen-xl mt-20 mx-4 lg:mx-auto flex flex-col items-center">
      <h1 className="mb-10 text-5xl font-semibold">Utwórz konto</h1>
      <SignUpForm />
      <div className="flex gap-1 w-full justify-center items-center mt-5">
        <p>Masz już konto?</p>
        <Link to="/login" className="underline font-semibold">
          Zaloguj się
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
