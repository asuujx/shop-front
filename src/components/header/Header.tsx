import { useMediaQuery } from "@uidotdev/usehooks";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger
} from "../ui/drawer";
import AuthButtons from "./elements/AuthButtons";
import CreateOfferButton from "./elements/CreateOfferButton";
import Logo from "./elements/Logo";
import NavMenu from "./elements/NavMenu";
import SearchBar from "./elements/SearchBar";

function Header() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <div className="w-full top-0 px-5 py-2 border-b shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <Logo />

          <div className="flex gap-5 items-center">
            <NavMenu />
            <SearchBar />
          </div>

          <div className="flex gap-5 items-center">
            <AuthButtons />
            <CreateOfferButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full top-0 px-5 py-2 border-b shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <Logo />
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline">
              <Menu />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="pb-10 px-4 flex flex-col gap-5">
            <DrawerHeader className="text-2xl font-semibold">Menu</DrawerHeader>
            <NavMenu />
            <CreateOfferButton />
            <SearchBar />
            <AuthButtons />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export default Header;
