import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation(); // ✅ Get the current route

  // ❌ Hide header/footer for these routes
  const hideLayout = location.pathname.startsWith("/doctor-dashboard");

  return (
    <>
      {!hideLayout && <Header />} {/* ✅ Show header only if not doctor dashboard */}
      <main className="min-h-screen pt-1">
        <Outlet />
      </main>
      {!hideLayout && <Footer />} {/* ✅ Show footer only if not doctor dashboard */}
    </>
  );
};

export default Layout;
