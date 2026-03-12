import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { config } from '../../../config';
import { sanityClient } from '../../../sanityClient';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  blockKey: string;
  honeypot?: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();

    // Honeypot spam protection - reject if filled
    if (body.honeypot) {
      return NextResponse.json(
        { success: false, message: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate blockKey is present
    if (!body.blockKey || typeof body.blockKey !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid form configuration' },
        { status: 400 }
      );
    }

    // Fetch recipient email server-side from Sanity using the block key.
    // The client never controls who receives the email.
    const recipientEmail = await sanityClient.fetch<string | null>(
      `*[defined(blocks[_key == $blockKey])][0].blocks[_key == $blockKey][0].recipientEmail`,
      { blockKey: body.blockKey }
    );

    if (!recipientEmail || !emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid recipient email configuration' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!config.resend?.apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!config.resend?.fromEmail) {
      console.error('RESEND_FROM_EMAIL is not configured');
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Instantiate Resend client now that we know API key is configured
    const resend = new Resend(config.resend.apiKey!);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: config.resend.fromEmail,
      to: recipientEmail,
      subject: `Contact Form: Message from ${body.name}`,
      text: `
Name: ${body.name}
Email: ${body.email}

Message:
${body.message}
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Email sent successfully', emailId: data?.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
