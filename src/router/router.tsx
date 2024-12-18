import Admin from "@/pages/admin/admin";
import App from "@/pages/App";
import Login from "@/pages/auth/Login";
import ResetPassword from "@/pages/auth/ResetPassword";
import SignUp from "@/pages/auth/SignUp";
import Verify from "@/pages/auth/Verify";
import CreateOffer from "@/pages/offers/CreateOffer";
import Offer from "@/pages/offers/Offer";
import OffersList from "@/pages/offers/OffersList";
import User from "@/pages/user/User";
import { createBrowserRouter } from "react-router-dom";

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
        element: <OffersList />,
        children: [
          {
            path: "create",
            element: <CreateOffer />,
          },
          {
            path: ":id",
            element: <Offer />
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
