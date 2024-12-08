import Header from "@/components/header/Header";
import AddressCard from "@/components/user/addresses/AddressesCard";
import ChangePasswordCard from "@/components/user/ChangePasswordCard";
import PersonalInformationCard from "@/components/user/PersonalInformationCard";

function User() {
  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="grid place-items-center">
        <div className="w-1/2">
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
    </div>
  );
}

export default User;
