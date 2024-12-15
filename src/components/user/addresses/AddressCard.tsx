import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Address } from "../../../../types";
import AddressEditForm from "./AddressEditForm";

interface AddressCardProps {
  address: Address;
  handleAddressDelete: (id: number) => void;
}

function AddressCard({ address, handleAddressDelete }: AddressCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xl">
          {address.firstName} {address.lastName}
        </CardTitle>
        <CardDescription>
          {address.companyName && <p>{address.companyName}</p>}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
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
        <Button
          variant="destructive"
          onClick={() => handleAddressDelete(address.id)}
        >
          Usuń
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
