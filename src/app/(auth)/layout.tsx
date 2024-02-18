import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-3 lg:grid-cols-2">
        <aside className="relative border-r bg-[url(/autumn.svg)] bg-center dark:bg-[url(/autumn-dark.svg)] lg:grid lg:place-content-center">
          <div className="relative hidden text-center lg:block">
            <div className="flex items-center gap-2 text-center lg:gap-4">
              <span className="block h-8 w-8 rounded-full bg-branding lg:h-16 lg:w-16"></span>
              <h1 className="text-4xl font-semibold">Reddot</h1>
            </div>
            <div className="mt-4 border-t border-primary pt-2 text-xl font-semibold text-muted-foreground">
              Another Reddit Clone
            </div>
          </div>
        </aside>

        <main className="absolute w-full max-w-[30rem] place-self-center p-8 md:static md:col-span-2 lg:col-span-1">
          <div className="mb-8 30em:mx-[1.75rem]">
            <div className="mx-auto flex items-center gap-2 text-center lg:hidden lg:gap-4">
              <span className="block h-8 w-8 rounded-full bg-branding lg:h-16 lg:w-16"></span>
              <h1 className="text-4xl font-semibold">Reddot</h1>
            </div>
            <div className="text-xl font-semibold text-muted-foreground lg:hidden">
              Another Reddit Clone
            </div>
          </div>

          {children}
        </main>
      </div>
    </>
  );
};

export default AuthLayout;
