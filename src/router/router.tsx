import Admin from "@/pages/admin/admin";
import App from "@/pages/App";
import Login from "@/pages/auth/Login";
import ResetPassword from "@/pages/auth/ResetPassword";
import SignUp from "@/pages/auth/SignUp";
import Verify from "@/pages/auth/Verify";
import Home from "@/pages/home/Home";
import CreateOffer from "@/pages/offers/CreateOffer";
import Offer from "@/pages/offers/OfferPage";
import OffersList from "@/pages/offers/OffersList";
import Product from "@/pages/products/ProductPage";
import ProductsList from "@/pages/products/ProductsList";
import User from "@/pages/user/User";
import UserOffers from "@/pages/user/UserOffers";
import UserOrders from "@/pages/user/UserOrders";
import { createBrowserRouter, Outlet } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
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
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <User />,
          },
          {
            path: "offers",
            element: <UserOffers />,
          },
          {
            path: "orders",
            element: <UserOrders />,
          }
        ]
      },
      {
        path: "offers",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <OffersList />,
          },
          {
            path: "create",
            element: <CreateOffer />,
          },
          {
            path: ":id",
            element: <Offer />,
          },
        ],
      },
      {
        path: "products",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <ProductsList />,
          },
          {
            path: ":id",
            element: <Product />,
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
