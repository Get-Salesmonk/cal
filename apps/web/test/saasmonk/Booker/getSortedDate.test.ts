import { expect, it } from "vitest";

import { dateSort } from "../../../components/saasmonk/Booker/utils";

const dummyPrevDate = new Date("2023-07-25");
const dummyPostDate = new Date("2023-07-26");

it("Get -1 if the 1st param is older date than previous one", () => {
  const result = dateSort(dummyPrevDate.toString(), dummyPostDate.toString());

  expect(result).toEqual(-1);
});

it("Get 1 if the 1st param is newer date than previous one", () => {
  const result = dateSort(dummyPostDate.toString(), dummyPrevDate.toString());

  expect(result).toEqual(1);
});

it("Get -1 if the both date are same", () => {
  const result = dateSort(dummyPostDate.toString(), dummyPostDate.toString());

  expect(result).toEqual(-1);
});
