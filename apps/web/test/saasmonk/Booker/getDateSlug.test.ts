import { expect, it } from "vitest";

import { dateSlugGenerator } from "../../../components/saasmonk/Booker/utils";

const dummyDate = new Date("2023-07-26").toString();

it("Get correct date ,slot and month", () => {
  const result = dateSlugGenerator(dummyDate);

  const expectedResult =`date=2023-07-26&month=2023-07&slot=${dummyDate}`

  expect(result).toEqual(expectedResult);
});
