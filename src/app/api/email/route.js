import { Resend } from 'resend';

export async function POST(request) {
    const resend = new Resend('re_FvbHwJeA_MrEQLuzkfsv7wWgvWpJJWdtt');
    const body = await request.json();

    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: body.to,
            subject: body.subject,
            html: body.html,
        });
        return Response.json({ success: true, data });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}