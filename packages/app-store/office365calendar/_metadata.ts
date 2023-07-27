import type { AppMeta } from "@calcom/types/App";

import _package from "./package.json";

export const metadata = {
  name: "Outlook Calendar",
  description: _package.description,
  type: "office365_calendar",
  title: "Outlook Calendar",
  variant: "calendar",
  category: "calendar",
  categories: ["calendar"],
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "office365-calendar",
  dirName: "office365calendar",
  url: "https://cal.com/",
  email: process.env.NEXT_PUBLIC_SUPPORT_MAIL_ADDRESS,
} as AppMeta;

export default metadata;
