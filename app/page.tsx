
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Index() {
  return (
    <>
      <main className="flex flex-col h-screen items-center justify-center">
        <h1 className="text-2xl my-5 text-center">Welcome to the SHESHA admin portal.</h1>
        <Link
          className="flex px-2.5 py-1 items-center space-x-2.5 bg-coralPink rounded-xl"
          href="/dashboard"
        >
          <span>Continue</span>
          <span>
            <ArrowRight />
          </span>
        </Link>
      </main>
    </>
  );
}
