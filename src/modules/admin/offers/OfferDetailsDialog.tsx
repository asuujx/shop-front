import { ProductStatus } from "@/../types";
import { Button } from "@/modules/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/core/components/ui/dialog";
import { ScrollArea } from "@/modules/core/components/ui/scroll-area";
import { Offer } from "./OffersConfirmation";

interface OfferDetailsDialogProps {
  open: boolean;
  isPending: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  onReject: () => void;
  onCancel: () => void;
  data: Offer;
}

const productStatusToText = (value: ProductStatus) => {
  switch (value) {
    case ProductStatus.WAITING:
      return "Oczekujący";
    case ProductStatus.APPROVED:
      return "Zatwierdzony";
    case ProductStatus.REJECTED:
      return "Odrzucony";
    default:
      return "Nieznany";
  }
};

const OfferDetailsDialog = ({
  open,
  data,
  isPending,
  onOpenChange,
  onConfirm,
  onReject,
  onCancel,
}: OfferDetailsDialogProps) => {
  const productStatusText = productStatusToText(data.product.status);
  const createdAt = new Date(data.createdAt).toLocaleString();
  const updatedAt = new Date(data.updatedAt).toLocaleString();
  const isOfferAcceptable = data.product.status === ProductStatus.APPROVED;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Szczegóły oferty</DialogTitle>
          <DialogDescription>
            Dokładnie przeanalizuj ofertę, zanim ją zatwierdzisz.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>Tytuł: {data.title}</p>
          <div className="my-1">
            <p>Opis:</p>
            <ScrollArea className="h-32">
              {!!data.description?.length
                ? data.description
                : "[Oferta nie zawiera opisu.]"}
            </ScrollArea>
          </div>
          <p>Cena: {data.price} zł</p>
          <p>Data utworzenia: {createdAt}</p>
          <p>Data edycji: {updatedAt}</p>

          <div className="my-2">
            <p className="font-semibold">Produkt</p>
            <p>Nazwa: {data.product.name}</p>
            <p>Stan: {data.productState.name}</p>
            <p>Status zatwierdzenia: {productStatusText}</p>
          </div>

          <div className="my-2">
            <p className="font-semibold">Autor</p>
            <p>Email: {data.author.email}</p>
            <p>
              Imię: {data.author.firstName} {data.author.lastName}
            </p>
          </div>

          {!isOfferAcceptable && (
            <p className="text-sm my-4 text-destructive">
              Nie można zatwierdzić oferty z niezatwierdzonym produkt.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={onCancel} disabled={isPending}>
              Anuluj
            </Button>
            <Button
              variant="destructive"
              onClick={onReject}
              disabled={isPending}
            >
              Odrzuć ofertę
            </Button>
            <Button
              disabled={!isOfferAcceptable || isPending}
              onClick={onConfirm}
            >
              Zatwierdź ofertę
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default OfferDetailsDialog;
