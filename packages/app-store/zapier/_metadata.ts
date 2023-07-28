import type { AppMeta } from "@calcom/types/App";

import _package from "./package.json";

export const metadata = {
  name: "Zapier",
  description: _package.description,
  installed: true,
  category: "automation",
  categories: ["automation"],
  logo: "icon.svg",
  publisher: "Cal.com",
  slug: "zapier",
  title: "Zapier",
  type: "zapier_automation",
  url: "https://cal.com/apps/zapier",
  variant: "automation",
  email: process.env.NEXT_PUBLIC_SUPPORT_MAIL_ADDRESS,
  dirName: "zapier",
} as AppMeta;

export default metadata;
