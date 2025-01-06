import { Button } from "@/modules/core/components/ui/button";
import { useStripeContext } from "@/modules/core/providers/stripeProvider";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentIntent, StripePaymentElementOptions } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);


  const { clientSecret } = useStripeContext();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${import.meta.env.VITE_BASE_URL}/checkout/complete`,
      },
      redirect: "if_required"
    });

    if (error && (error.type === "card_error" || error.type === "validation_error")) {
      setMessage(error.message ?? null);
    } else {
      navigate(`/checkout/complete?payment_intent_client_secret=${paymentIntent?.client_secret}`)
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (stripe && clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(res => {
        if (res?.paymentIntent) {
          setPaymentIntent(res.paymentIntent);
        } else {
          setMessage("Error: Payment intent not found.");
        }
      });
    }
  }, [stripe, clientSecret]);

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "accordion",
  };

  return (
    <div className="mt-20 max-w-screen-xl mx-3 sm:mx-auto">
      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="mb-1 text-center text-xl md:text-2xl font-semibold">
          <p>Do zapłaty: {paymentIntent ? paymentIntent.amount / 100 : ""} zł</p>
        </div>
        {message && <div id="payment-message" className="mb-2">{message}</div>}
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <Button disabled={isLoading || !stripe || !elements} id="submit" className="mt-4 w-full">
          {isLoading ? "Przetwarzanie..." : "Zapłać"}
        </Button>
      </form>
    </div>
  );
}

export default Checkout;
