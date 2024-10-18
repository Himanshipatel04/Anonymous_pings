import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not Authenticated!" },
      { status: 401 }
    );
  }
  const userId = user._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update status of user to accept messages!",
          updatedUser,
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update status of user to accept messages!",error);
   return Response.json(
      {
        success: false,
        message: "Failed to update status of user to accept messages!",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
   return Response.json(
      { success: false, message: "Not Authenticated!" },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
     return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 404 }
      );
    }

    Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser?.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update status of user to accept messages!",error);
    Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status!",
      },
      { status: 500 }
    );
  }
}