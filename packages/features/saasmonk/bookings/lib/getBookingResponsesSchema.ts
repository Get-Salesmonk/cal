import type { RefinementCtx } from "zod";
import { z } from "zod";

import { nonWorkDomains } from "@calcom/lib/saasmonk/constants";

export const checkWorkEmail = (email: string, ctx: RefinementCtx, m: (message: string) => string) => {
  // Extract the domain from the email address
  const emailDomain = email.split("@")[1];

  // Check if the domain is present in the array of non-work domains
  if (nonWorkDomains.includes(emailDomain)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: m("work_email_validation_error"),
    });
  }
};
