import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({ username: usernameValidation });

export async function GET(request: Request) {
    // if(request.method !== "GET"){
    //     return Response.json({success:false,messgae:"Method not allowed!"},{status:405})
    // }
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams);
    const queryParams = { username: searchParams.get("username") };
    const result = usernameQuerySchema.safeParse(queryParams);
    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameter!",
        },
        { status: 400 }
      );
    }
    const {username} = result.data
    const usernameExists = await UserModel.findOne({username,isVerified:true})
     console.log(usernameExists,"...");
    if(usernameExists){
        return Response.json({success:false,message:"Username is already taken!"},{status:401})
    }
    return Response.json({success:true,message:"Username is available!"},{status:200})
  } catch (error) {
    console.log("Error from checking username!", error);
    return Response.json(
      { success: false, message: "Error checking username!" },
      { status: 500 }
    );
  }
}
