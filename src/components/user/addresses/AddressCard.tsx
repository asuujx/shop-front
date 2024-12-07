import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { address } from "../../../../types";
import AddressEditForm from "./AddressEditForm";

interface AddressCardProps {
  address: address;
  handleAddressDelete: (id: number) => void;
}

function AddressCard({
  address,
  handleAddressDelete,
}: AddressCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardContent className="flex flex-col">
        <p>
          {address.firstName} {address.lastName}
        </p>

        {address.companyName && <p>{address.companyName}</p>}

        <p>
          {address.street} {address.building} {address.apartment}
        </p>

        <p>
          {address.postalCode} {address.city}
        </p>

        <p>{address.phoneNumber}</p>
      </CardContent>
      <CardFooter className="flex gap-5">
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
        <Button variant="destructive" onClick={() => handleAddressDelete(address.id)}>Usuń</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
