/* eslint-disable react/prop-types */
import { useHeading } from "@/hooks/use-heading";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MoveLeft, MoveRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SideBar({ children }) {
  const { heading } = useHeading();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-full">
          <header className="sticky top-0 z-[10] flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 bg-gray-50">
            <div className="flex justify-between items-center gap-2 w-full">
              <SidebarTrigger className="ml-1 scale-125" />
              <>{heading}</>
              {!useIsMobile() && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      window.history.back();
                    }}
                    className="bg-blue-500 text-white font-bold py-1 px-2.5 rounded-md align-middle transition-all duration-300"
                  >
                    <MoveLeft className="w-5" />
                  </button>
                  <button
                    onClick={() => {
                      window.history.forward();
                    }}
                    className="bg-blue-500 text-white font-bold py-1 px-2.5 rounded-md align-middle transition-all duration-300"
                  >
                    <MoveRight className="w-5" />
                  </button>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 relative overflow-auto">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
