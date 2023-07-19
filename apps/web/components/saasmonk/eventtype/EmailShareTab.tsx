import type { EventTypeSetupProps } from "pages/event-types/[type]";

import { Booker } from "@calcom/atoms";
import type { GetBookingType } from "@calcom/features/bookings/lib/get-booking";
import { useOrgBrandingValues } from "@calcom/features/ee/organizations/hooks";
import { CAL_URL } from "@calcom/lib/constants";

type Props = Pick<EventTypeSetupProps, "eventType" | "team">;

function EmailShareTab({ eventType, team }: Props) {
  const orgBranding = useOrgBrandingValues();
  const isOrgEvent = orgBranding?.fullDomain;
  const permalink = `${orgBranding?.fullDomain ?? CAL_URL}/${
    team ? `${!isOrgEvent ? "team/" : ""}${team.slug}` : eventType.users[0].username
  }/${eventType.slug}`;

  const booking: GetBookingType | null = null;
  return (
    <Booker
      username={eventType.users[0].username ?? ""}
      eventSlug={eventType.slug}
      bookingData={booking}
      isAway={false}
      hideBranding={true}
    />
  );
}

export default EmailShareTab;
