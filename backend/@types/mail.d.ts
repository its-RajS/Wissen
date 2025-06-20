export interface Email {
  email: string;
  subject: string;
  templete: string;
  data: { [key: string]: any };
}
