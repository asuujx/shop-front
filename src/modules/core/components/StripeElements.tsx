import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { Outlet } from "react-router-dom";
import { useStripeContext } from "../providers/stripeProvider";

function StripeElements() {
  const { clientSecret } = useStripeContext();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

  console.log(clientSecret);

  const appearance: Appearance = {
    theme: "stripe",
  };

  const loader = "auto";

  return (
    <>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance, loader }}
        >
          <Outlet />
        </Elements>
      )} 
    </>
  );
}

export default StripeElements;
