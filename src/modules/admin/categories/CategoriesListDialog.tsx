import { Badge } from "@/modules/core/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/core/components/ui/dialog";
import { ScrollArea } from "@/modules/core/components/ui/scroll-area";

interface CategoriesListDialogProps {
  attributes: object[];
  children: React.ReactNode;
}

const CategoriesListDialog = ({
  attributes,
  children,
}: CategoriesListDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lista atrybutów kategorii</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96 pl-4">
          {attributes.map((attribute: any) => (
            <div key={attribute.id} className="mb-4">
              <p className="font-bold mb-2">{attribute.name}</p>
              <div className="pl-3">
                <div className="flex gap-2">
                  <span className="text-muted-foreground">Typ:</span>
                  <p>{attribute.dataType}</p>
                </div>

                <div className="flex gap-2">
                  <span className="text-muted-foreground">Wymagany: </span>
                  <p>{attribute.required ? "Tak" : "Nie"}</p>
                </div>

                {attribute.unit !== null && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Jednostka: </span>
                    <p>{attribute.unit}</p>
                  </div>
                )}

                {attribute.isMultiSelect !== null && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">
                      Wielokrotnego wyboru:
                    </span>
                    <p>{attribute.isMultiSelect ? "Tak" : "Nie"}</p>
                  </div>
                )}

                {!!attribute?.options?.length && (
                  <div className="">
                    <p className="text-muted-foreground">Dostępne opcje:</p>
                    <div className="">
                      {attribute.options?.map((option: any) => (
                        <Badge key={option.id} className="mr-2">{option.value}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default CategoriesListDialog;
