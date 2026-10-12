import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tfxvqcrzacmqzjpyrvym.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmeHZxY3J6YWNtcXpqcHlydnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Mjk0MDAsImV4cCI6MjEwNzQwNTQwMH0.rYp4yNQFLa7PA-ZUh3cZGNazkqOfThd0mdOTlPBj8Us";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
