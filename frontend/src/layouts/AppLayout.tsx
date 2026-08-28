import { useCallback, useState } from "react";
import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-shell/AppSidebar";
import { AppTopbar } from "@/components/app-shell/AppTopbar";
import { MobileSidebar } from "@/components/app-shell/MobileSidebar";

export const AppLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#f7f8fc] text-slate-950 transition-colors duration-300 dark:bg-[#07101f] dark:text-white">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block">
        <AppSidebar />
      </div>

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      <div className="min-h-[100dvh] lg:pl-60">
        <AppTopbar onOpenMobileSidebar={openMobileSidebar} />

        <main className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
