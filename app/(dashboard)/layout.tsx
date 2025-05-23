import Navbar from "./_components/Navbar";
import Sidebar from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="md:flex hidden h-full w-56 flex-col fixed inset-y-0 z-50 ">
        <Sidebar />
      </div>
      <main className="md:pl-56 h-full md:pt-[80px]">{children}</main>
    </div>
  );
};

export default DashboardLayout;
