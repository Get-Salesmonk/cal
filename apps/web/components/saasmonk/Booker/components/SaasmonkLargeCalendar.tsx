import format from "date-fns/format";
import { useMemo } from "react";

import dayjs from "@calcom/dayjs";
import { useBookerStore } from "@calcom/features/bookings/Booker/store";
import { useEvent, useScheduleForEvent } from "@calcom/features/bookings/Booker/utils/event";
import { useTimePreferences } from "@calcom/features/bookings/lib";
import { Calendar } from "@calcom/features/calendars/weeklyview";
import type { CalendarAvailableTimeslots } from "@calcom/features/calendars/weeklyview/types/state";
import type { RouterOutputs } from "@calcom/trpc/react";

import { useEmailBookerStore } from "../store";

type EventType = RouterOutputs["viewer"]["eventTypes"]["get"]["eventType"] | undefined;

function SaasmonkLargeCalendar({ extraDays, eventType }: { extraDays: number; eventType?: EventType }) {
  const { addSlot } = useEmailBookerStore();
  const selectedDate = new Date();
  const date = selectedDate || dayjs().format("YYYY-MM-DD");
  const setSelectedTimeslot = useBookerStore((state) => state.setSelectedTimeslot);
  const selectedEventDuration = useBookerStore((state) => state.selectedDuration);
  const schedule = useScheduleForEvent({
    prefetchNextMonth: !!extraDays && dayjs(date).month() !== dayjs(date).add(extraDays, "day").month(),
  });
  const { timezone } = useTimePreferences();

  const event = useEvent();
  console.log(eventType, "event");
  const eventDuration = selectedEventDuration || eventType?.length || 30;

  const availableSlots = useMemo(() => {
    const availableTimeslots: CalendarAvailableTimeslots = {};
    if (!schedule.data) return availableTimeslots;
    if (!schedule.data.slots) return availableTimeslots;

    for (const day in schedule.data.slots) {
      availableTimeslots[day] = schedule.data.slots[day].map((slot) => ({
        // First formatting to LLL and then passing it to date prevents toDate()
        // from changing the timezone to users local machine (instead of itmezone selected in UI dropdown)
        start: new Date(dayjs(slot.time).utc().tz(timezone).format("LLL")),
        end: new Date(dayjs(slot.time).utc().tz(timezone).add(eventDuration, "minutes").format("LLL")),
      }));
    }

    return availableTimeslots;
  }, [schedule, timezone, eventDuration]);

  return (
    <div className="scrollbar-none max-h-[70vh] max-w-full overflow-x-hidden [--calendar-dates-sticky-offset:66px]">
      <Calendar
        isLoading={schedule.isLoading}
        availableTimeslots={availableSlots}
        startHour={0}
        endHour={23}
        events={[]}
        startDate={selectedDate ? new Date(selectedDate) : new Date()}
        endDate={dayjs(selectedDate ? new Date(selectedDate) : new Date())
          .add(extraDays, "day")
          .toDate()}
        onEmptyCellClick={(date) => {
          const dateString = format(date, "EEEE,dd LLL");
          addSlot({ date: dateString, time: date.toString() });
        }}
        gridCellsPerHour={60 / eventDuration}
        hoverEventDuration={eventDuration}
      />
    </div>
  );
}

export default SaasmonkLargeCalendar;
