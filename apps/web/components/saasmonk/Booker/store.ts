import { create } from "zustand";

import { dateSort } from "@components/saasmonk/Booker/utils";

import type { EmailBooker } from "./types";

export const useEmailBookerStore = create<EmailBooker>((set, get) => ({
  slots: [],
  addSlot(timeSlot) {
    // deep cloning array
    const slots = [...get().slots];
    // finding the particular slot
    const index = slots.findIndex((slot) => slot.date === timeSlot.date);
    // if the date is already there add the time to that date
    if (index > -1) {
      slots[index].times.push(timeSlot.time);
    }
    // add the date and time to the slot
    else {
      slots.push({ date: timeSlot.date, times: [timeSlot.time] });
    }
    // sort the array wrt to date
    slots.sort((a, b) => {
      return dateSort(a.date, b.date);
    });
    // sort the timeslot wrt in ascending order
    slots.map((slot) => {
      slot.times.sort((a, b) => {
        return dateSort(a, b);
      });
      return slot;
    });
    // update the state
    set({
      slots,
    });
  },
}));
