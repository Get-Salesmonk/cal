export interface Slot {
  date: string;
  times: string[];
}

export interface TimeSlot {
  date: string;
  time: string;
}

export type EmailBooker = {
  slots: Slot[];
  addSlot: (timeSlot: TimeSlot) => void;
};
