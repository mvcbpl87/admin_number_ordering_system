import ModalProvider from "@/components/provider/modal-provider";
import NavigationBar from "@/components/shared/NavigationBar";
import TopNav from "@/components/shared/TopNav";
import { currentUser } from "@/server-actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await currentUser();
  return (
    <ModalProvider>
      <div className="min-h-svh flex flex-grow flex-1">
        <NavigationBar />
        <div className="flex flex-col flex-grow pt-[var(--header-height)] md:pt-0 relative">
          <div className="absolute h-full w-full flex flex-col flex-1">
            <TopNav />
            <div className="flex flex-col flex-1 flex-grow overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
}
