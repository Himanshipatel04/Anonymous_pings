import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast of 2 characters.")
  .max(20, "Username can't be more than 20 characters.")
  .regex(
    /^[a-zA-Z0-9_\s]+$/,
    "Username must not contain any special characters."
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password:z.string().min(6,{message:"Password must be atleast 6 characters."})
});
