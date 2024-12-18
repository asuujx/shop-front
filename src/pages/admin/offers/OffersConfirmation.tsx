import { OfferStatus, ProductStatus } from "@/../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios-instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import OfferDetailsDialog from "./OfferDetailsDialog";

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  price: number;
  status: OfferStatus;
  images: OfferImage[];
  product: OfferProduct;
  productState: OfferProductState;
  author: OfferAuthor;
  createdAt: string;
  updatedAt: string;
}

interface OfferImage {
  id: string;
  url: string;
  order: number;
}

interface OfferProduct {
  id: string;
  name: string;
  description: string | null;
  status: ProductStatus;
}

interface OfferProductState {
  id: string;
  name: string;
}

interface OfferAuthor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface UpdateOfferStatusArgs {
  offerId: string;
  status: OfferStatus;
}

const getPendingOffers = async () => {
  const response = await axiosInstance.get<Offer[]>(
    `/offers?filter=status:eq:${OfferStatus.PENDING}&sort=createdAt:desc`
  );
  return response.data;
};

const updateOfferStatus = async ({
  offerId,
  status,
}: UpdateOfferStatusArgs) => {
  return axiosInstance.patch(`/offers/${offerId}/status`, { status });
};

const OffersConfirmation = () => {
  const { data: offersData, isSuccess: offersIsSuccess } = useQuery({
    queryKey: ["offers", "pending"],
    queryFn: getPendingOffers,
  });

  const {
    mutateAsync: mutateOfferStatusAsync,
    isPending: isOfferStatusMutationPending,
  } = useMutation({
    mutationKey: ["offers", "state"],
    mutationFn: updateOfferStatus,
  });

  const queryClient = useQueryClient();

  const [offerDetailsDialogOpen, setOfferDetailsDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const isReady = offersIsSuccess && offersData;

  const handleOnOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setOfferDetailsDialogOpen(true);
  };

  const handleOnConfirmButtonClick = async () => {
    const response = await mutateOfferStatusAsync({
      offerId: selectedOffer!.id,
      status: OfferStatus.ACTIVE,
    });

    if (response.status === 200) {
      toast({ title: "Oferta została zatwierdzona" });
      setOfferDetailsDialogOpen(false);
      setSelectedOffer(null);
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    } else {
      toast({
        title: "Nie udało się zatwierdzić oferty",
        variant: "destructive",
      });
    }
  };

  const handleOnRejectButtonClick = async () => {
    const response = await mutateOfferStatusAsync({
      offerId: selectedOffer!.id,
      status: OfferStatus.REJECTED,
    });

    if (response.status === 200) {
      toast({ title: "Oferta została odrzucona" });
      setOfferDetailsDialogOpen(false);
      setSelectedOffer(null);
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    } else {
      toast({
        title: "Nie udało się odrzucić oferty",
        variant: "destructive",
      });
    }
  };

  const handleOnCancelButtonClick = () => {
    setOfferDetailsDialogOpen(false);
    setSelectedOffer(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Oczekujące na zatwierdzenie</h2>
      {!isReady && <p>Ładowanie...</p>}
      {isReady && offersData.length === 0 && <p>Brak ofert do zatwierdzenia</p>}
      {isReady && offersData.length > 0 && (
        <>
          <Table>
            {/* <TableCaption>Lista ofert do zatwierdzenia</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nazwa</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Autor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offersData.map((offer) => {
                const createdAt = new Date(offer.createdAt).toLocaleString();

                return (
                  <TableRow key={offer.id}>
                    <TableCell
                      className="font-medium hover:underline cursor-pointer"
                      onClick={() => handleOnOfferClick(offer)}
                    >
                      {offer.title}
                    </TableCell>
                    <TableCell>{offer.price} zł</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell className="text-right">
                      {offer.author.email}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {selectedOffer && (
            <OfferDetailsDialog
              open={offerDetailsDialogOpen}
              onOpenChange={setOfferDetailsDialogOpen}
              onConfirm={handleOnConfirmButtonClick}
              onReject={handleOnRejectButtonClick}
              onCancel={handleOnCancelButtonClick}
              isPending={isOfferStatusMutationPending}
              data={selectedOffer}
            />
          )}
        </>
      )}
    </div>
  );
};
export default OffersConfirmation;
