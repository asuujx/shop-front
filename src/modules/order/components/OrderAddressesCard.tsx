import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/modules/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/core/components/ui/dialog";
import AddressForm from "@/modules/user/components/addresses/AddressForm";
import { Address } from "types";
import OrderAddressCard from "./OrderAddressCard";

const fetchAddresses = async () => {
  const response = await axiosInstance.get("/delivery-addresses");
  return response.data;
};

interface OrderAddressesCardProps {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address) => void;
}

function OrderAddressesCard({ selectedAddress, setSelectedAddress }: OrderAddressesCardProps) {
  const [open, setOpen] = useState(false);

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresy wysyłki</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex flex-col h-full">
              <Plus />
              <p>Dodaj adres</p>
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>Dodaj nowy adres wysyłki</DialogTitle>
            </DialogHeader>
            <AddressForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>

        {addresses && addresses.length > 0 ? (
          addresses.map((address: Address) => (
            <OrderAddressCard
              key={address.id}
              address={address}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          ))
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}

export default OrderAddressesCard;
