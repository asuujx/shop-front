import App from "@/pages/App";
import SignUp from "@/pages/SignUp";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
   },
   {
      path: "/signup",
      element: <SignUp />,
      
   },
]);
