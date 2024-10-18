import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; // Import User type

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email",
          type: "text",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        // Handle case where credentials are undefined
       
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        await dbConnect();
        try {
         
          const user = await UserModel.findOne({
            $or: [
              { email:credentials.identifier },
              { username :credentials.identifier}, // Ensure you have 'username' defined in your model
            ],
          });
          
          if (!user) {
            throw new Error("No user found for this email!");
          }
          if (!user.isVerified) {
            throw new Error("Verify your account first!");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user as User; // Return user object if successful
          } else {
            throw new Error("Invalid Credentials!");
          }
        } catch (error) {
          // Handle any other errors
          throw new Error((error as Error)?.message || "Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token?._id;
        session.user.isVerified = token?.isVerified;
        session.user.username = token?.username;
        session.user.isAcceptingMessage = token?.isAcceptingMessage;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
