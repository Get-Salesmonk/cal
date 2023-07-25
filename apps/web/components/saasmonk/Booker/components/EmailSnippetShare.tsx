import { useEvent } from "@calcom/features/bookings/Booker/utils/event";

import { formatToString } from "@components/saasmonk/Booker/utils";

import { useEmailBookerStore } from "../store";

type Props = {
  eventSlug: string;
  username: string;
};
function EmailSnippetShare({ eventSlug, username }: Props) {
  const { slots } = useEmailBookerStore();

  const { data: event, isLoading } = useEvent();

  console.log(event);

  return (
    <div className="mt-5 w-full max-w-lg space-y-4 rounded-md bg-white p-2 text-black">
      <h2>{`${event?.title}${
        event?.owner?.name?.split(" ")[0] ? `-${event?.owner?.name?.split(" ")[0]}` : ""
      }`}</h2>
      <p className="">
        {event?.length} min duration &#x2022; {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </p>
      <div className="flex flex-col gap-2">
        {slots.map((slot, index) => {
          return (
            <div key={index} className="flex flex-col gap-2">
              <span>{slot.date}</span>
              <div>
                {slot.times.map((time, index) => {
                  return <span key={index}>{formatToString(time)}</span>;
                })}
              </div>
            </div>
          );
        })}
      </div>
      {/* <a href={permalink}>find more times</a> */}
    </div>
  );
}

export default EmailSnippetShare;
