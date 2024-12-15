import CreateOfferForm from "@/components/offers/CreateOfferForm";

function CreateOffer() {
  return (
    <div className="w-screen h-screen">
      <div className="max-w-screen-xl mx-4 lg:mx-auto flex flex-col items-center justify-center">
        <h1 className="my-10 text-5xl font-semibold">Dodaj ofertę</h1>
        <CreateOfferForm />
      </div>
    </div>
  );
}

export default CreateOffer;
