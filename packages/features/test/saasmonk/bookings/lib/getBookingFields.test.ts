import type { Fields} from "../../../../saasmonk/bookings/lib/getBookingFields";
import { addWorkEmailVariant } from "../../../../saasmonk/bookings/lib/getBookingFields";
import { describe, expect, test } from "vitest";

const mockBookingFields: Fields = [
  { type: 'email', name: 'email', editable: 'system', variant: 'none' },
];

describe('addWorkEmailVariant', () => {
  test('should add work variant when workEmail is true', () => {

    const workEmail = true;
    const result = addWorkEmailVariant(mockBookingFields, workEmail);

    // Assert that the variant has been updated to "work"
    expect(result).toEqual([
      { type: 'email', name: 'email', editable: 'system', variant: 'work' },
    ]);
  });

  test('should add all variant when workEmail is false', () => {

    const workEmail = false;
    const result = addWorkEmailVariant(mockBookingFields, workEmail);

    // Assert that the variant has been updated to "all"
    expect(result).toEqual([
      { type: 'email', name: 'email', editable: 'system', variant: 'all' },
    ]);
  });
});
