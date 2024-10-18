import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session?.user || !session) {
    return Response.json(
      { success: false, message: "Not authenticated!" },
      { status: 400 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const foundUser = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!foundUser || foundUser.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User Not Found!",
        },
        { status: 404 }
      );
    }
    Response.json(
      {
        success: true,
        messages: foundUser[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching messages!",error);
    Response.json(
      {
        success: false,
        message: "Error fetching messages!",
      },
      { status: 500 }
    );
  }
}
