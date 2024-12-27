import AddressesCard from "../components/addresses/AddressesCard";
import ChangePasswordCard from "../components/ChangePasswordCard";
import PersonalInformationCard from "../components/PersonalInformationCard";


function User() {
  return (
    <div>
      <div className="max-w-screen-xl mx-4 lg:mx-auto flex flex-col items-center justify-center">
        <h1 className="mt-10 ml-5 text-4xl font-semibold">
          Informacje o koncie
        </h1>
        <div className="m-5 flex flex-col gap-5">
          <PersonalInformationCard />
          <AddressesCard />
          <ChangePasswordCard />
        </div>
      </div>
    </div>
  );
}

export default User;
