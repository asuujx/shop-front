import { useMediaQuery } from "@uidotdev/usehooks";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import AuthButtons from "./elements/AuthButtons";
import Cart from "./elements/Cart";
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
            <Cart />
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
          <DrawerContent className="h-viewport flex flex-col gap-5 items-center">
            <DrawerHeader>Menu</DrawerHeader>
            <SearchBar />
            <NavMenu />
            <Cart />
            <DrawerFooter>
              <AuthButtons />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export default Header;
