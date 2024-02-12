import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default async function Page() {
  return (
    <>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Choose an OAuth provider to sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button variant="outline" asChild>
              <a href="/login/github">
                <FaGithub className="mr-2 h-4 w-4" />
                Github
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/login/google">
                <FaGoogle className="mr-2 h-4 w-4" />
                Google
              </a>
            </Button>
          </div>
          {/* Maybe I'll add in email & password auth one day... */}
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div> */}
        </CardContent>
        {/* <CardFooter>
          <Button className="w-full">Create account</Button>
        </CardFooter> */}
      </Card>
    </>
  );
}
