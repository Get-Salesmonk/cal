import type { RefObject } from "react";

import { CAL_URL } from "@calcom/lib/constants";
import type { RouterOutputs } from "@calcom/trpc/react";

import { useEmailBookerStore } from "@components/saasmonk/Booker/store";
import { dateSlugGenerator, formatToString } from "@components/saasmonk/Booker/utils";

type EventType = RouterOutputs["viewer"]["eventTypes"]["get"]["eventType"] | undefined;

type EmailEmbedProps = {
  eventType: EventType;
  timezone?: string;
  emailContentRef: RefObject<HTMLDivElement>;
  username?: string;
  month?: string;
  selectedDateAndTime: { [key: string]: string[] };
};

/*
  ! No need to sync as this component is our custom component
*/

export const SaasmonkEmailEmbedPreview = ({ emailContentRef, eventType, username }: EmailEmbedProps) => {
  const { slots } = useEmailBookerStore();
  if (!eventType) {
    return null;
  }
  const permalink = `${CAL_URL}/${username}/${eventType.slug}`;
  return (
    <>
      <div className="flex h-full items-center justify-center border p-5 last:font-medium">
        <div className="scrollbar-none max-h-full w-full max-w-md overflow-y-scroll rounded-lg border bg-white p-2">
          <div
            ref={emailContentRef}
            style={{
              color: "#2C3A47",
              width: "100%",
              fontWeight: 400,
              maxWidth: "500px",
            }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#2c3e50",
              }}>
              {eventType.title}
            </h2>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              {eventType?.length} {eventType?.length > 1 ? "mins" : "min"} &#x2022; {timezone}
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
            <div style={{ paddingTop: "8px", marginTop: "8px", borderTop: "1px solid #6b757e" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#414e59",
                }}>
                Powered by{" "}
                <a
                  href={permalink}
                  target="_blank"
                  style={{
                    fontWeight: 500,
                    color: "#f3681b",
                  }}>
                  saasmonk.io
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

type TimeSlotsProps = {
  times: string[];
  permalink: string;
};

function TimeSlots({ times, permalink }: TimeSlotsProps) {
  const updatedTimes: string[][] = [];

  // segrating the times in 3 col as grid will not work in email using table instead
  // constant colNumber is number of column needed in the table
  const colNumber = 3;
  times.forEach((time, index) => {
    const remainder = Math.floor(index % colNumber);
    const qoutient = Math.floor(index / colNumber);
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
