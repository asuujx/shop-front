import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios-instance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
  const queryClient = useQueryClient();
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
          queryClient.invalidateQueries({ queryKey: ["addresses"] });
          toast({
            title: "Adres został usunięty",
          });
        }
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresy wysyłki</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2">
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
          addresses.map((address: address) => (
            <AddressCard
              key={address.id}
              address={address}
              handleAddressDelete={handleAddressDelete}
            />
          ))
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}

export default AddressesCard;
