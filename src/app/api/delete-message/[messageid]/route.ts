import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request,{params}:{params:{messageid:string}}) {
  const messageId = params.messageid
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session?.user || !session) {
    return Response.json(
      { success: false, message: "Not authenticated!" },
      { status: 400 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne({_id:user?._id},{$pull:{messages:{_id:messageId}}})
    if (updatedResult.modifiedCount === 0){
      return Response.json({success:false,message:"Message not found or already deleted!"},{status:404})
    }
    return Response.json({success:true,message:"Message deleted!"},{status:200})
  } catch (error) {
    console.log("Error deleting message!",error);
    return Response.json({success:false,message:"Error deleting message!"},{status:500})
  }
 

}
