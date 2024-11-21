import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import SubmitButton from "@/components/submit-button";
import { use } from "react";

type PageProps = {
  searchParams: Promise<Message>;
};

export default function Login({ searchParams }: PageProps) {
  const message = use(searchParams);

  return (
    <form
      action={signInAction}
      className="flex flex-col items-center justify-center w-full"
    >
      <h1 className="text-2xl font-medium">Sign in</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4 border p-5">
        <div className="flex flex-col">
          <label>Name</label>
          <input
            className="p-1.5 bg-transparent text-champagne border border-champagne w-full placeholder-champagne"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="flex flex-col">
          <label>Password</label>
          <input
            className="p-1.5 bg-transparent text-champagne border border-champagne w-full placeholder-champagne"
            name="password"
            type="password"
            placeholder="12345"
            required
          />
        </div>

        <SubmitButton className="">Sign in</SubmitButton>
        <FormMessage message={message} />
      </div>
    </form>
  );
}
