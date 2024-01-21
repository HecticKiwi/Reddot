"use client";

import { updateProfile } from "@/actions/profile";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  about: z.string().max(200).optional(),
});

const AboutForm = ({ about }: { about: string | null }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about: about || undefined,
    },
    mode: "all",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    form.reset({ about: about || undefined });
  }, [about, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateProfile(values);

    toast({
      title: "About updated.",
    });

    router.refresh();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none"
                    disabled={form.formState.isSubmitting}
                    onBlur={() => {
                      if (form.formState.isDirty) {
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of yourself shown on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default AboutForm;
