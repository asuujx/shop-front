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
          <div className="flex gap-2">
            <p className="text-muted-foreground">Tytuł: </p>
            <span>{data.title}</span>
          </div>

          <div className="my-1">
            <p className="text-muted-foreground">Opis:</p>
            <ScrollArea className="h-32">
              {!!data.description?.length
                ? data.description
                : "[Oferta nie zawiera opisu.]"}
            </ScrollArea>
          </div>

          <div className="flex gap-2">
            <p className="text-muted-foreground">Cena: </p>
            <p>{data.price} zł</p>
          </div>

          <div className="flex gap-2">
            <p className="text-muted-foreground">Data utworzenia: </p>
            <p>{createdAt}</p>
          </div>

          <div className="flex gap-2">
            <p className="text-muted-foreground">Data edycji: </p>
            <p>{updatedAt}</p>
          </div>

          <div className="my-2">
            <p className="font-semibold">Produkt</p>

            <div className="flex gap-2">
              <p className="text-muted-foreground">Nazwa: </p>
              <p>{data.product.name}</p>
            </div>

            <div className="flex gap-2">
              <p className="text-muted-foreground">Stan: </p>
              <p>{data.productState.name}</p>
            </div>

            <div className="flex gap-2">
              <p className="text-muted-foreground">Status zatwierdzenia: </p>
              <p>{productStatusText}</p>
            </div>
          </div>

          <div className="my-2">
            <p className="font-semibold">Autor</p>

            <div className="flex gap-2">
              <p className="text-muted-foreground">Email: </p>
              <p>{data.author.email}</p>
            </div>

            <div className="flex gap-2">
              <p className="text-muted-foreground">Imię:</p>
              <p>
                {data.author.firstName} {data.author.lastName}
              </p>
            </div>
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
