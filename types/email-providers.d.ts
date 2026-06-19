/**
 * Type declarations for optional email provider packages
 */

declare module "resend" {
  export interface ResendOptions {
    from: string;
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    reply_to?: string;
    cc?: string | string[];
    bcc?: string | string[];
  }

  export interface ResendResponse {
    id: string;
  }

  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(options: ResendOptions): Promise<ResendResponse>;
    };
  }

  export default Resend;
}

declare module "@sendgrid/mail" {
  export interface MailDataRequired {
    from: string | { email: string; name?: string };
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
  }

  const sgMail: {
    setApiKey(apiKey: string): void;
    send(data: MailDataRequired): Promise<any>;
  };

  export default sgMail;
}
