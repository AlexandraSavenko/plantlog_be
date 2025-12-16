export interface SendEmailProps {
    to: string,
    subject: string,
    html: string
}

export interface EmailTokenPayload {
    email: string;
}