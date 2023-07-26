import type { z } from "zod";

import type { eventTypeBookingFields } from "@calcom/prisma/zod-utils";

type Fields = z.infer<typeof eventTypeBookingFields>;

export const addWorkEmailVariant = (bookingFields: Fields, workEmail: boolean) => {
  // Find the bookingField with type email and editabe as system and add variant depending on workEmail
  const emailFieldIndex = bookingFields.findIndex((f) => f.type === "email" && f.editable === "system");
  if (emailFieldIndex !== -1) {
    bookingFields[emailFieldIndex] = {
      ...bookingFields[emailFieldIndex],
      variant: workEmail ? "work" : "all",
    };
  }
  return bookingFields;
};
