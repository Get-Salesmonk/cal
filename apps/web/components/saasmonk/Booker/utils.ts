import format from "date-fns/format";

export function dateSort(date1: string, date2: string): 1 | -1 {
  const dateA = new Date(date1).getTime();
  const dateB = new Date(date2).getTime();
  return dateA > dateB ? 1 : -1;
}

export function formatToString(date: string) {
  return format(new Date(date), "hh:mm a");
}
