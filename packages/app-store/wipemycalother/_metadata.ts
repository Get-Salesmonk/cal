import type { AppMeta } from "@calcom/types/App";

import _package from "./package.json";

export const metadata = {
  name: _package.name,
  description: _package.description,
  installed: true,
  category: "automation",
  categories: ["automation"],
  // If using static next public folder, can then be referenced from the base URL (/).
  logo: "icon-dark.svg",
  publisher: "Cal.com",
  slug: "wipe-my-cal",
  title: "Wipe my cal",
  type: "wipemycal_other",
  url: "https://cal.com/apps/wipe-my-cal",
  variant: "other",
  email: process.env.NEXT_PUBLIC_SUPPORT_MAIL_ADDRESS,
  dirName: "wipemycalother",
} as AppMeta;

export default metadata;
