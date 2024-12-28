import { Button } from "@/modules/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import AddressEditForm from "@/modules/user/components/addresses/AddressEditForm";
import { useState } from "react";
import { Address } from "types";

interface AddressCardProps {
  address: Address;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address) => void;
}

function OrderAddressCard({ address, selectedAddress, setSelectedAddress }: AddressCardProps) {
  const [open, setOpen] = useState(false);

  const handleSelectButtonOnClick = () => {
    setSelectedAddress(address);
  };

  return (
    <Card
      className={
        selectedAddress?.id === address.id ? "border-2 border-primary" : ""
      }
    >
      <CardHeader>
        <CardTitle className="text-xl">
          {address.firstName} {address.lastName}
        </CardTitle>
        <CardDescription>
          {address.companyName && <p>{address.companyName}</p>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="flex">
          {address.street} {address.building}
          {address.apartment ? `/${address.apartment}` : null}
        </p>
        <p>
          {address.postalCode} {address.city}
        </p>
        <p>{address.phoneNumber}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button onClick={handleSelectButtonOnClick}>Wybierz</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Edytuj</Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>Edytuj adres</DialogTitle>
            </DialogHeader>
            <AddressEditForm setOpen={setOpen} id={address.id} data={address} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default OrderAddressCard;
