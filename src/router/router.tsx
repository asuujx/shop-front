import Admin from "@/pages/admin/admin";
import App from "@/pages/App";
import Login from "@/pages/auth/Login";
import ResetPassword from "@/pages/auth/ResetPassword";
import SignUp from "@/pages/auth/SignUp";
import Verify from "@/pages/auth/Verify";
import CreateOffer from "@/pages/offers/CreateOffer";
import User from "@/pages/user/User";
import { createBrowserRouter, Outlet } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "verify",
        element: <Verify />,
      },
      {
        path: "forgot-password",
        element: <ResetPassword />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "offers/",
        element: <Outlet />,
        children: [
          {
            path: "create",
            element: <CreateOffer />,
          },
        ],
      },
      {
        path: "admin",
        element: <Admin />,
      },
    ],
  },
]);
