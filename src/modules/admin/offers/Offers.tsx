import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/core/components/ui/card";
import OffersConfirmation from "./OffersConfirmation";

const Offers = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Oferty</CardTitle>
        <CardDescription>
          Formularze umożliwiające wykonywanie operacji na ofertach.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OffersConfirmation />
      </CardContent>
    </Card>
  );
};
export default Offers;
