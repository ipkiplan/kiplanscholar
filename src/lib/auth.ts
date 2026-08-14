import { supabase } from "./supabase";


// Register with email and password
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });
}


// Login with email and password
export async function loginUser(
  email: string,
  password: string
) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}


// Login with Google OAuth
export async function loginWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });
}


// Logout current user
export async function logoutUser() {
  return await supabase.auth.signOut();
}


// Get current logged-in user
export async function getCurrentUser() {
  return await supabase.auth.getUser();
}