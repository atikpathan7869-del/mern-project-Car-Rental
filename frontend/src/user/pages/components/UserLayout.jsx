import Header from "../../../components/__Header";
import { Outlet } from "react-router-dom";
import Footer from "../../../components/__Footer";


export default function UserLayout() {
  return (
    <>
      <Header />  
    {/* Top */}
      <main>
        <Outlet />       {/* Page content */}
      </main>
      <Footer />         {/* Bottom */}
    </>
  );
}
