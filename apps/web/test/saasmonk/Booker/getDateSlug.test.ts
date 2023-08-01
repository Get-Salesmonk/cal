import { expect, it } from "vitest";

import { dateSlugGenerator } from "../../../components/saasmonk/Booker/utils";

const dummyDate = new Date("2023-07-26");
const dummyDateString = dummyDate.toString();

it("Get correct date ,slot and month", () => {
  const result = dateSlugGenerator(dummyDateString);

  const expectedResult =`date=2023-07-26&month=2023-07&slot=${dummyDate.toUTCString()}`

  expect(result).toEqual(expectedResult);
});
