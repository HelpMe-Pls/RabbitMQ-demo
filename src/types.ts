export interface EmailData {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  title: string;
  body: string;
}
