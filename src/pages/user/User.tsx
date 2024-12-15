import AddressCard from "@/components/user/addresses/AddressesCard";
import ChangePasswordCard from "@/components/user/ChangePasswordCard";
import PersonalInformationCard from "@/components/user/PersonalInformationCard";

function User() {
  return (
    <div className="w-screen h-screen">
      <div className="max-w-screen-xl mx-4 lg:mx-auto flex flex-col items-center justify-center">
        <h1 className="mt-10 ml-5 text-4xl font-semibold">
          Informacje o koncie
        </h1>
        <div className="m-5 flex flex-col gap-5">
          <PersonalInformationCard />
          <AddressCard />
          <ChangePasswordCard />
        </div>
      </div>
    </div>
  );
}

export default User;
