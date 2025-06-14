import SideNav from "@/ui/sidenav";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNav />

      <div className="flex-1 p-8">
        <div className="max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
