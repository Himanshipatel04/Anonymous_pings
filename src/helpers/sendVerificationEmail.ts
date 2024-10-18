import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Anonymous Pings | Verification Code",
      react: VerificationEmail({ username, verifyCode }),
    });

    if (error) {
      console.error("Error response from Resend:", error);
      return { success: false, message: "Failed to send verification email!" };
    }

    return { success: true, message: "Verification email sent successfully!" };
  } catch (err) {
    console.error("Error sending verification email:", err);
    return { success: false, message: "Failed to send verification email!" };
  }
}
