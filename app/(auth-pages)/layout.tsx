export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <h1 className="text-5xl pb-5 italic font-black">SHESHA</h1>
      <div className="w-full">{children}</div>
    </div>
  );
}
