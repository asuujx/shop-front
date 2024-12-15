import LoginForm from "@/components/auth/login/LoginForm";

function Login() {
  return (
    <div className="w-screen h-screen">
      <div className="max-w-screen-xl mx-4 lg:mx-auto flex flex-col items-center justify-center">
        <h1 className="mt-20 mb-10 text-5xl font-semibold">Zaloguj się</h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
