import Header from "@/components/shared/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header />
      <div className=" p-8">
        <div className="">{children}</div>
      </div>
    </div>
  );
}
