import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-3 lg:grid-cols-2">
        <aside className="relative border-r border-red-900 bg-red-950 bg-[url(/autumn.svg)] bg-center lg:grid lg:place-content-center">
          <div className="absolute inset-0 bg-gradient-to-t from-red-950 to-red-950/75"></div>
          <div className="relative hidden text-center lg:block">
            <div className="flex items-center gap-2 text-center lg:gap-4">
              <span className="bg-branding block h-8 w-8 rounded-full lg:h-16 lg:w-16"></span>
              <h1 className="text-4xl font-semibold text-white">Reddot</h1>
            </div>
            <div className="mt-4 border-t border-white pt-2 text-xl font-semibold text-muted-foreground">
              Another Reddit Clone
            </div>
          </div>
        </aside>

        <main className="absolute flex flex-col items-center place-self-center md:static md:col-span-2 lg:col-span-1">
          <div className="mb-8 30em:mx-[1.75rem]">
            <div className="mx-auto flex items-center gap-2 text-center lg:hidden lg:gap-4">
              <span className="bg-branding block h-8 w-8 rounded-full lg:h-16 lg:w-16"></span>
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
