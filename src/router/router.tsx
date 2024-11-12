import App from "@/pages/App";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App />
   },
   {
      path: "/signup",
      element: <SignUp />
   },
   {
      path: "/login",
      element: <Login />
   }
]);
