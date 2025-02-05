import Admin from "@/modules/admin/admin";
import Login from "@/modules/auth/pages/Login";
import ResetPassword from "@/modules/auth/pages/ResetPassword";
import SignUp from "@/modules/auth/pages/SignUp";
import Verify from "@/modules/auth/pages/Verify";
import Checkout from "@/modules/checkout/pages/Checkout";
import Complete from "@/modules/checkout/pages/Complete";
import StripeElements from "@/modules/core/components/StripeElements";
import App from "@/modules/core/pages/App";
import Home from "@/modules/home/pages/Home";
import CreateOffer from "@/modules/offers/pages/CreateOffer";
import Offer from "@/modules/offers/pages/OfferPage";
import OffersList from "@/modules/offers/pages/OffersList";
import OrderPage from "@/modules/order/pages/OrderPage";
import Product from "@/modules/products/pages/ProductPage";
import ProductsList from "@/modules/products/pages/ProductsList";
import User from "@/modules/user/pages/User";
import UserOffers from "@/modules/user/pages/UserOffers";
import UserOrders from "@/modules/user/pages/UserOrders";
import { createBrowserRouter, Outlet } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
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
          },
        ],
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
        path: "order",
        element: <OrderPage />
      },
      {
        path: "checkout",
        element: <StripeElements />,
        children: [
          {
            index: true,
            element: <Checkout />,
          },
          {
            path: "complete",
            element: <Complete />,
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
