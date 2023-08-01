import { checkWorkEmail } from "../../../../saasmonk/bookings/lib/getBookingResponsesSchema";
import { describe, expect, test, vi, afterEach } from "vitest";

describe("checkWorkEmail", () => {
  const mockAddIssue = vi.fn();
  const mockCtx: any = {
    addIssue: mockAddIssue,
  };

  const mockMessageFn = vi.fn((message: string) => message);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should not add an issue if the domain is not in the nonWorkDomains list", () => {
    const email = "test@saasmonk.io";
    checkWorkEmail(email, mockCtx, mockMessageFn);

    expect(mockAddIssue).not.toHaveBeenCalled();
  });

  test("should add an issue if the domain is in the nonWorkDomains list", () => {
    const email = "test@gmail.com";
    checkWorkEmail(email, mockCtx, mockMessageFn);

    expect(mockAddIssue).toHaveBeenCalledWith({
      code: "custom",
      message: "work_email_validation_error",
    });
  });
});


