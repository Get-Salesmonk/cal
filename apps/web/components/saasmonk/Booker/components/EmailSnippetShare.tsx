import { useRef } from "react";

import { useEvent } from "@calcom/features/bookings/Booker/utils/event";
import { Button, showToast } from "@calcom/ui";
import { Link as LinkIcon } from "@calcom/ui/components/icon";

import { dateSlugGenerator, formatToString } from "@components/saasmonk/Booker/utils";

import { useEmailBookerStore } from "../store";

type Props = {
  permalink: string;
};
function EmailSnippetShare({ permalink }: Props) {
  const { slots } = useEmailBookerStore();

  const { data: event, isLoading } = useEvent();

  // email body ref
  //  we will get the email snippet from the this ref div
  const emailBodyRef = useRef<HTMLDivElement>(null);

  const handleCopyEmailSnippet = () => {
    if (!emailBodyRef.current) return;
    const emailSnippet = emailBodyRef.current.outerHTML;
    const blobInput = new Blob([emailSnippet], { type: "text/html" });

    navigator.clipboard.write([new ClipboardItem({ "text/html": blobInput })]);
    showToast("Link copied!", "success");
  };

  if (isLoading) return <div />;

  return (
    <div className="relative my-5 max-w-lg overflow-hidden rounded-lg bg-white p-2">
      <div className="bg-darkgray-50 absolute right-0 top-0 flex cursor-none select-none items-center justify-center rounded-l-lg p-2">
        <p className="text-sm font-semibold text-white">Preview</p>
      </div>
      <div
        style={{
          color: "#2C3A47",
          width: "100%",
          fontWeight: 400,
        }}
        ref={emailBodyRef}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#2c3e50",
          }}>{`${event?.title}${
          event?.owner?.name?.split(" ")[0] ? `-${event?.owner?.name?.split(" ")[0]}` : ""
        }`}</h2>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>
          {event?.length} min duration &#x2022; {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </p>
        <div>
          {slots.map((slot, index) => {
            return (
              <div
                key={index}
                style={{
                  marginTop: "16px",
                }}>
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: "16px",
                  }}>
                  {slot.date}
                </div>
                <table
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                  }}>
                  <TimeSlots times={slot.times} permalink={permalink} />
                </table>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "16px" }}>
          <a
            href={permalink}
            target="_blank"
            style={{
              textTransform: "capitalize",
              fontSize: "16px",
              fontWeight: 500,
              textDecoration: "underline dotted",
              color: "#2C3A47",
            }}>
            find more times &#8599;
          </a>
        </div>
      </div>
      <Button
        color="secondary"
        data-testid="copy-email-button"
        variant="button"
        StartIcon={LinkIcon}
        className="mt-5"
        onClick={handleCopyEmailSnippet}>
        Copy Snippet
      </Button>
    </div>
  );
}

type TimeSlotsProps = {
  times: string[];
  permalink: string;
};

function TimeSlots({ times, permalink }: TimeSlotsProps) {
  const updatedTimes: string[][] = [];

  times.forEach((time, index) => {
    const remainder = Math.floor(index % 3);
    const qoutient = Math.floor(index / 3);
    if (updatedTimes[qoutient]) {
      updatedTimes[qoutient][remainder] = time;
    } else {
      updatedTimes[qoutient] = [time];
    }
  });

  return (
    <tbody>
      {updatedTimes.map((row, index) => {
        return (
          <tr
            key={index}
            style={{
              paddingBottom: "16px",
            }}>
            {row.map((time, index) => {
              return (
                <td key={index}>
                  <a
                    target="_blank"
                    href={`${permalink}?${dateSlugGenerator(time)}`}
                    key={index}
                    style={{
                      backgroundColor: "#fbd2bb",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      color: "#180a03",
                      textAlign: "center",
                      display: "block",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}>
                    {formatToString(time)}
                  </a>
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}

export default EmailSnippetShare;
