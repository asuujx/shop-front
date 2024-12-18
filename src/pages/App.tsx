import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
