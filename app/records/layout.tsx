import Header from "@/ui/header";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header />

      <div className="flex-1 p-8">
        <div className="max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
