import LoginForm from "../components/login/LoginForm";

function Login() {
  return (
    <div className="max-w-screen-xl mt-20 mx-4 lg:mx-auto flex flex-col items-center">
      <h1 className="mb-10 text-5xl font-semibold">Zaloguj się</h1>
      <LoginForm />
    </div>
  );
}

export default Login;
