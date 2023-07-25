import type { EventTypeSetupProps } from "pages/event-types/[type]";

import type { GetBookingType } from "@calcom/features/bookings/lib/get-booking";
import { useOrgBrandingValues } from "@calcom/features/ee/organizations/hooks";
import { CAL_URL } from "@calcom/lib/constants";

import { Booker } from "../Booker/EmailBooker";

type Props = Pick<EventTypeSetupProps, "eventType" | "team">;

function EmailShareTab({ eventType, team }: Props) {
  const orgBranding = useOrgBrandingValues();
  const isOrgEvent = orgBranding?.fullDomain;
  const permalink = `${orgBranding?.fullDomain ?? CAL_URL}/${
    team ? `${!isOrgEvent ? "team/" : ""}${team.slug}` : eventType.users[0].username
  }/${eventType.slug}`;

  const booking: GetBookingType | null = null;
  return (
    <>
      <Booker
        username={eventType.users[0].username ?? ""}
        eventSlug={eventType.slug}
        bookingData={booking}
        isAway={false}
        hideBranding={true}
      />
      {/* <div className=" mt-auto px-5 py-3">
        <DatePicker />
      </div> */}
    </>
  );
}

export default EmailShareTab;
