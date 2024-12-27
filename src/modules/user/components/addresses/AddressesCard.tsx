import { toast } from "@/modules/core/hooks/use-toast";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/modules/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/core/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/modules/core/components/ui/dialog";
import { Address } from "types";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

const fetchAddresses = async () => {
  const response = await axiosInstance.get("/delivery-addresses");
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
    axiosInstance.delete(`/delivery-addresses/${id}`).then((response) => {
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
