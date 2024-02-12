"use client";

import { isUsernameAvailable, updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsClient } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "Usernames can only contain letters, numbers, and underscores",
    })
    .refine(
      (username) => username.length > 3 && username.length < 20,
      "Username must be between 3 and 20 characters",
    ),
});

type formSchemaType = z.infer<typeof formSchema>;

const Setup = () => {
  const isClient = useIsClient();
  const usernameIsUncheckedRef = useRef(false);
  const router = useRouter();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: formSchemaType) {
    try {
      const usernameIsAvailable = await isUsernameAvailable(values.username);

      if (!usernameIsAvailable) {
        return form.setError("username", { message: "Username is taken." });
      }

      await updateProfile(values);

      toast({ title: `Welcome, ${values.username}!` });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
        description: error.message,
      });
    }
  }

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="grid h-full min-h-screen place-content-center">
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>
              Welcome to <span className="text-branding">Reddot</span>!
            </CardTitle>
            <CardDescription>
              Before you can enter, please set your username.
              <br />
              Think carefully; you cannot change it later!
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <CardContent className="space-y-8">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onBlur={() => {
                            usernameIsUncheckedRef.current = true;
                            field.onBlur();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="flex-grow"
                  type="submit"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="animate-spin" />
                  )}
                  {!form.formState.isSubmitting && <span>Continue</span>}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Setup;
