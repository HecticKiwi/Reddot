import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <main className="mx-auto max-w-screen-lg px-2 py-8 text-center sm:px-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Page not found!
          </h1>
          <Button variant={"outline"} asChild className="mt-8">
            <Link href={"/"}>Go home</Link>
          </Button>
        </div>
      </main>
    </>
  );
};

export default NotFound;
