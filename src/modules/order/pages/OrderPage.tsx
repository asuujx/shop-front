import { Button } from "@/modules/core/components/ui/button";
import { toast } from "@/modules/core/hooks/use-toast";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useStripeContext } from "@/modules/core/providers/stripeProvider";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Address } from "types";
import OrderAddressesCard from "../components/OrderAddressesCard";
import OrderOfferCard from "../components/OrderOfferCard";

const createOrderMutationFn = async (data: {
  offerId: string;
  deliveryAddressId: string;
}) => {
  const response = await axiosInstance.post("/orders", data);
  return response.data;
};

function OrderPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { changeClientSecret } = useStripeContext();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const { mutate: createOrderMutate, isPending: createOrderIsPending } =
    useMutation({
      mutationKey: ["order", "create"],
      mutationFn: createOrderMutationFn,
      onSuccess: (data: { clientSecret: string; orderId: string }) => {
        console.log("Secret: ", data.clientSecret);
          changeClientSecret(data.clientSecret);
          navigate("/checkout", { state: { clientSecret: data.clientSecret } });
      },
      onError: () => {
        toast({ title: "Nie udało się przetworzyć zamówienia" });
      },
    });

  const handleBuyNowClick = () => {
    createOrderMutate({
      offerId: state.offerId,
      deliveryAddressId: selectedAddress!.id!,
    });
  };

  useEffect(() => {
    if (!state?.offerId) {
      navigate("/");
    }
  }, [state]);

  if (!state?.offerId) return <></>;

  return (
    <div className="max-w-screen-xl mx-4 lg:mx-auto flex flex-col items-center justify-center">
      <h1 className="mt-20 mb-10 text-5xl font-semibold text-center">
        Zamówienie
      </h1>
      <div className="flex flex-col gap-5">
        <OrderOfferCard offerId={state.offerId} />
        <OrderAddressesCard
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <Button
          disabled={!selectedAddress || createOrderIsPending}
          onClick={handleBuyNowClick}
        >
          Kup teraz
        </Button>
      </div>
    </div>
  );
}

export default OrderPage;
