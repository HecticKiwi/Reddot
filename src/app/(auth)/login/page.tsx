"use client";
import { createClient } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";

const supabase = createClient();

export default function LoginPage() {
  return (
    // <form>
    //   <label htmlFor="email">Email:</label>
    //   <input id="email" name="email" type="email" required />
    //   <label htmlFor="password">Password:</label>
    //   <input id="password" name="password" type="password" required />
    //   <button formAction={login}>Log in</button>
    //   <button formAction={signup}>Sign up</button>
    // </form>
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      providers={["google", "facebook", "twitter", "github"]}
      redirectTo="http://example.com/auth/callback"
    />
  );
}
