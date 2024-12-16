import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <ScrollArea className="h-96">
          {attributes.map((attribute: any) => (
            <div key={attribute.id}>
              <p className="font-bold">{attribute.name}</p>
              <div className="pl-3">
                <p>Typ: {attribute.dataType}</p>
                <p>Wymagany: {attribute.required ? "Tak" : "Nie"}</p>
                {attribute.unit !== null && <p>Jednostka: {attribute.unit}</p>}
                {attribute.isMultiSelect !== null && (
                  <p>
                    Wielokrotnego wyboru:{" "}
                    {attribute.isMultiSelect ? "Tak" : "Nie"}
                  </p>
                )}
                {!!attribute?.options?.length && (
                  <p>
                    Dostępne opcje:
                    <br />
                    {attribute.options
                      ?.map((option: any) => option.value)
                      .join(", ")}
                  </p>
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
