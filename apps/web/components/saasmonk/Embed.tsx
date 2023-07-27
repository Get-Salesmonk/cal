import { Tailwind, Heading, Text, Container, Row, Link, Hr, Section } from "@react-email/components";
import type { RefObject } from "react";
import { useState } from "react";
import { shallow } from "zustand/shallow";

import dayjs from "@calcom/dayjs";
import { useBookerStore, useInitializeBookerStore } from "@calcom/features/bookings/Booker/store";
import { useEvent, useScheduleForEvent } from "@calcom/features/bookings/Booker/utils/event";
import { useTimePreferences } from "@calcom/features/bookings/lib";
import { useNonEmptyScheduleDays, useSlotsForDate } from "@calcom/features/schedules";
import { CAL_URL } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { BookerLayouts } from "@calcom/prisma/zod-utils";
import type { RouterOutputs } from "@calcom/trpc/react";

type EventType = RouterOutputs["viewer"]["eventTypes"]["get"]["eventType"] | undefined;

type EmailEmbedProps = {
  eventType: EventType;
  timezone?: string;
  emailContentRef: RefObject<HTMLDivElement>;
  username?: string;
  month?: string;
  selectedDateAndTime: { [key: string]: string[] };
};

type EmbedType = "inline" | "floating-popup" | "element-click" | "email";

export const SaasmonkEmailEmbed = ({ eventType, username }: { eventType?: EventType; username: string }) => {
  const { t, i18n } = useLocale();

  const [timezone] = useTimePreferences((state) => [state.timezone]);

  const [selectTime, setSelectTime] = useState(false);

  useInitializeBookerStore({
    username,
    eventSlug: eventType?.slug ?? "",
    eventId: eventType?.id,
    layout: BookerLayouts.MONTH_VIEW,
  });

  const [month, selectedDate, selectedDatesAndTimes] = useBookerStore(
    (state) => [state.month, state.selectedDate, state.selectedDatesAndTimes],
    shallow
  );
  const [setSelectedDate, setMonth, setSelectedDatesAndTimes, setSelectedTimeslot] = useBookerStore(
    (state) => [
      state.setSelectedDate,
      state.setMonth,
      state.setSelectedDatesAndTimes,
      state.setSelectedTimeslot,
    ],
    shallow
  );
  const event = useEvent();
  const schedule = useScheduleForEvent();
  const nonEmptyScheduleDays = useNonEmptyScheduleDays(schedule?.data?.slots);

  const onTimeSelect = (time: string) => {
    if (!eventType) {
      return null;
    }
    if (selectedDatesAndTimes && selectedDatesAndTimes[eventType.slug]) {
      const selectedDatesAndTimesForEvent = selectedDatesAndTimes[eventType.slug];
      const selectedSlots = selectedDatesAndTimesForEvent[selectedDate as string] ?? [];
      if (selectedSlots?.includes(time)) {
        // Checks whether a user has removed all their timeSlots and thus removes it from the selectedDatesAndTimesForEvent state
        if (selectedSlots?.length > 1) {
          const updatedDatesAndTimes = {
            ...selectedDatesAndTimes,
            [eventType.slug]: {
              ...selectedDatesAndTimesForEvent,
              [selectedDate as string]: selectedSlots?.filter((slot: string) => slot !== time),
            },
          };

          setSelectedDatesAndTimes(updatedDatesAndTimes);
        } else {
          const updatedDatesAndTimesForEvent = { ...selectedDatesAndTimesForEvent };
          delete updatedDatesAndTimesForEvent[selectedDate as string];
          setSelectedTimeslot(null);
          setSelectedDatesAndTimes({
            ...selectedDatesAndTimes,
            [eventType.slug]: updatedDatesAndTimesForEvent,
          });
        }
        return;
      }

      const updatedDatesAndTimes = {
        ...selectedDatesAndTimes,
        [eventType.slug]: {
          ...selectedDatesAndTimesForEvent,
          [selectedDate as string]: [...selectedSlots, time],
        },
      };

      setSelectedDatesAndTimes(updatedDatesAndTimes);
    } else if (!selectedDatesAndTimes) {
      setSelectedDatesAndTimes({ [eventType.slug]: { [selectedDate as string]: [time] } });
    } else {
      setSelectedDatesAndTimes({
        ...selectedDatesAndTimes,
        [eventType.slug]: { [selectedDate as string]: [time] },
      });
    }

    setSelectedTimeslot(time);
  };

  const slots = useSlotsForDate(selectedDate, schedule?.data?.slots);

  if (!eventType) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="mb-[9px] font-medium" />
    </div>
  );
};

export const SaasmonkEmailEmbedPreview = ({
  emailContentRef,
  eventType,
  selectedDateAndTime,
  month,
  username,
}: EmailEmbedProps) => {
  const { t } = useLocale();
  const [timeFormat, timezone] = useTimePreferences((state) => [state.timeFormat, state.timezone]);
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
              maxWidth: "500px",
            }}>
            <Tailwind>
              <div className="text-base text-[#2c3e50]">
                <Heading as="h2" className="text-xl">
                  {eventType.title}
                </Heading>
                <Text>
                  {eventType?.length} {eventType?.length > 1 ? "mins" : "min"} &#x2022; {timezone}
                </Text>
              </div>
              <div>
                {selectedDateAndTime &&
                  Object.keys(selectedDateAndTime)
                    .sort()
                    .map((key) => {
                      const date = new Date(key);
                      return (
                        <Container key={key}>
                          <Row>
                            <Heading as="h2" className="font-semi-bold">
                              {date.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </Heading>
                          </Row>
                          <Row>
                            <Container>
                              {selectedDateAndTime[key]?.length > 0 &&
                                selectedDateAndTime[key].map((time) => {
                                  const bookingURL = `${permalink}?duration=${eventType.length}&date=${key}&month=${month}&slot=${time}`;

                                  return (
                                    <Row key={time}>
                                      <Container>
                                        <Link href={bookingURL}>
                                          {dayjs.utc(time).tz(timezone).format(timeFormat)}
                                          &nbsp;
                                        </Link>
                                      </Container>
                                    </Row>
                                  );
                                })}
                            </Container>
                          </Row>
                        </Container>
                      );
                    })}
              </div>
              <Row>
                <Section>
                  <Link href={permalink} className="text-sm font-medium capitalize text-gray-700">
                    find more times &#8599;
                  </Link>
                </Section>
              </Row>
              <Hr className="mt-1 w-full border-gray-600" />
              <Section className="max-w-sm">
                <Text className="text-left text-xs text-[#2c3e50]">
                  Powered by{" "}
                  <Link className="font-medium text-[#f3681b]" href="https://saasmonk.io">
                    Saasmonk.io
                  </Link>
                </Text>
              </Section>
              <Container />
            </Tailwind>
          </div>
        </div>
      </div>
    </>
  );
};
