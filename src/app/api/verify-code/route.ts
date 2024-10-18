import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
 
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    
    const user = await UserModel.findOne({ username: decodedUsername });
    console.log("dfahoda ");

    if (!user) {
      return Response.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.codeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "User verified successfully!" },
        { status: 200 }
      );
    } else {
      if (!isCodeNotExpired) {
        return Response.json(
          {
            success: false,
            message:
              "Verification code has expired,please signup again to get new code!",
          },
          { status: 400 }
        );
      } else {
        return Response.json(
          {
            success: false,
            message: "Incorrect Verification Code!",
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.log("Error verifying code!", error);
    return Response.json(
      { success: false, message: "Error verifying code!" },
      { status: 500 }
    );
  }
}
