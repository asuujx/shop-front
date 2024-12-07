import Header from "@/components/header/Header";
import AddressCard from "@/components/user/addresses/AddressesCard";
import ChangePasswordCard from "@/components/user/ChangePasswordCard";
import UserCard from "@/components/user/UserCard";


function User() {
  return (
    <div className="w-screen h-screen">
      <Header />
      <h1 className="mt-10 ml-5 text-4xl font-semibold">Informacje o koncie</h1>
      <div className="m-5 flex gap-5">
        <UserCard />
        <div className="w-1/2 flex flex-col gap-5">
          <AddressCard />
          <ChangePasswordCard />
        </div>
      </div>
    </div>
  );
}

export default User;
