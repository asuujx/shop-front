import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { address } from "../../../../types";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

const fetchAddresses = async () => {
  const response = await axiosInstance.get(
    "http://localhost:5000/delivery-addresses"
  );
  return response.data;
};

function AddressesCard() {
  const [open, setOpen] = useState(false);

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });

  const handleAddressDelete = (id: number) => {
    axiosInstance
      .delete(`http://localhost:5000/delivery-addresses/${id}`)
      .then((response) => {
        if (response.status === 204) {
          toast({
            title: "Adres został usunięty",
          });
        }
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adres wysyłki</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 items-center">
        {addresses && addresses.length > 0 ? (
          addresses.map((address: address) => (
            <AddressCard key={address.id} address={address} handleAddressDelete={handleAddressDelete} />
          ))
        ) : <></>}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Dodaj adres</Button>
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
      </CardContent>
    </Card>
  );
}

export default AddressesCard;
