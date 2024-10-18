import { Message } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { successResponse } from "@/utils/response";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 404 }
      );
    }

    const isUserAcceptingMessages = user?.isAcceptingMessage;
    if (!isUserAcceptingMessages) {
      Response.json(
        {
          success: false,
          message: "User is not accepting the messages!",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user?.messages.push(newMessage as Message);
    await user?.save();

    return Response.json(
      successResponse("Message sent successfully!"),
      { status: 200 }
    );
    
  } catch (error) {
    console.log("Error sending message!",error);
    Response.json(
      {
        success: false,
        message: "Error sending message!",
      },
      { status: 500 }
    );
  }
}
