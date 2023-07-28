import type { AppMeta } from "@calcom/types/App";

import _package from "./package.json";

export const metadata = {
  name: "Microsoft Exchange 2013 Calendar",
  description: _package.description,
  installed: true,
  type: "exchange2013_calendar",
  title: "Microsoft Exchange 2013 Calendar",
  variant: "calendar",
  category: "calendar",
  categories: ["calendar"],
  label: "Exchange Calendar",
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "exchange2013-calendar",
  url: "https://cal.com/",
  email: process.env.NEXT_PUBLIC_SUPPORT_MAIL_ADDRESS,
  dirName: "exchange2013calendar",
} as AppMeta;

export default metadata;
