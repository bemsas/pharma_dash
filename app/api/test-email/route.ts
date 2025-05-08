import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  try {
    // Get the test email from query params or use a default
    const { searchParams } = new URL(req.url)
    const testEmail = searchParams.get("email") || "test@example.com"

    // Send a test email
    const { data, error } = await resend.emails.send({
      from: "Pharma Dashboard <notifications@neurointel.io>", // Updated with your domain
      to: [testEmail],
      subject: "Test Email from Pharma Dashboard",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Test Email</h1>
          <p>This is a test email from your Pharma Dashboard application.</p>
          <p>If you're receiving this, your email configuration is working correctly!</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        </div>
      `,
    })

    if (error) {
      console.error("Test email sending failed:", error)
      return NextResponse.json({ error: "Failed to send test email", details: error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Test email sent successfully", data }, { status: 200 })
  } catch (error) {
    console.error("Error in test email endpoint:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
