import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import StickyBox from "react-sticky-box";
import { shallow } from "zustand/shallow";

import BookingPageTagManager from "@calcom/app-store/BookingPageTagManager";
import { useEmbedType, useEmbedUiConfig, useIsEmbed } from "@calcom/embed-core/embed-iframe";
import { AvailableTimeSlots } from "@calcom/features/bookings/Booker/components/AvailableTimeSlots";
import { BookerSection } from "@calcom/features/bookings/Booker/components/Section";
import { Away, NotFound } from "@calcom/features/bookings/Booker/components/Unavailable";
import {
  fadeInLeft,
  getBookerSizeClassNames,
  useBookerResizeAnimation,
  extraDaysConfig,
} from "@calcom/features/bookings/Booker/config";
import { useBookerStore, useInitializeBookerStore } from "@calcom/features/bookings/Booker/store";
import type { BookerLayout, BookerProps } from "@calcom/features/bookings/Booker/types";
import { useEvent } from "@calcom/features/bookings/Booker/utils/event";
import { validateLayout } from "@calcom/features/bookings/Booker/utils/layout";
import { useBrandColors } from "@calcom/features/bookings/Booker/utils/use-brand-colors";
import classNames from "@calcom/lib/classNames";
import useMediaQuery from "@calcom/lib/hooks/useMediaQuery";
import { BookerLayouts, defaultBookerLayoutSettings } from "@calcom/prisma/zod-utils";

import EmailSnippetShare from "./components/EmailSnippetShare";
import { Header } from "./components/Header";
import LargeCalendar from "./components/SaasmonkLargeCalendar";

const PoweredBy = dynamic(() => import("@calcom/ee/components/PoweredBy"));

const DatePicker = dynamic(
  () => import("@calcom/features/bookings/Booker/components/DatePicker").then((mod) => mod.DatePicker),
  {
    ssr: false,
  }
);

const BookerComponent = ({
  username,
  eventSlug,
  month,
  bookingData,
  hideBranding = false,
  isTeamEvent,
}: BookerProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const timeslotsRef = useRef<HTMLDivElement>(null);
  const StickyOnDesktop = isMobile ? "div" : StickyBox;
  const rescheduleUid =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("rescheduleUid") : null;
  const bookingUid =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("bookingUid") : null;
  const event = useEvent();
  const [_layout, setLayout] = useBookerStore((state) => [state.layout, state.setLayout], shallow);

  const isEmbed = useIsEmbed();
  const embedType = useEmbedType();
  // Floating Button and Element Click both are modal and thus have dark background
  const hasDarkBackground = isEmbed && embedType !== "inline";
  const embedUiConfig = useEmbedUiConfig();

  // In Embed we give preference to embed configuration for the layout.If that's not set, we use the App configuration for the event layout
  // But if it's mobile view, there is only one layout supported which is 'mobile'
  const layout = BookerLayouts.WEEK_VIEW;
  setLayout(layout);

  const [bookerState, setBookerState] = useBookerStore((state) => [state.state, state.setState], shallow);
  const selectedDate = useBookerStore((state) => state.selectedDate);
  const [selectedTimeslot, setSelectedTimeslot] = useBookerStore(
    (state) => [state.selectedTimeslot, state.setSelectedTimeslot],
    shallow
  );
  // const seatedEventData = useBookerStore((state) => state.seatedEventData);
  const [seatedEventData, setSeatedEventData] = useBookerStore(
    (state) => [state.seatedEventData, state.setSeatedEventData],
    shallow
  );

  const extraDays = isTablet ? extraDaysConfig[layout].tablet : extraDaysConfig[layout].desktop;
  const bookerLayouts = event.data?.profile?.bookerLayouts || defaultBookerLayoutSettings;
  const animationScope = useBookerResizeAnimation(layout, bookerState);

  // I would expect isEmbed to be not needed here as it's handled in derived variable layout, but somehow removing it breaks the views.
  const defaultLayout = isEmbed
    ? validateLayout(embedUiConfig.layout) || bookerLayouts.defaultLayout
    : bookerLayouts.defaultLayout;

  useBrandColors({
    brandColor: event.data?.profile.brandColor,
    darkBrandColor: event.data?.profile.darkBrandColor,
    theme: event.data?.profile.theme,
  });

  useInitializeBookerStore({
    username,
    eventSlug,
    month,
    eventId: event?.data?.id,
    rescheduleUid,
    bookingUid,
    bookingData,
    layout: defaultLayout,
    isTeamEvent,
  });

  useEffect(() => {
    if (isMobile && layout !== "mobile") {
      setLayout("mobile");
    } else if (!isMobile && layout === "mobile") {
      setLayout(defaultLayout);
    }
  }, [isMobile, setLayout, layout, defaultLayout]);

  useEffect(() => {
    if (event.isLoading) return setBookerState("loading");
    if (!selectedDate) return setBookerState("selecting_date");
    if (!selectedTimeslot) return setBookerState("selecting_time");
    return setBookerState("booking");
  }, [event, selectedDate, selectedTimeslot, setBookerState]);

  useEffect(() => {
    if (layout === "mobile") {
      timeslotsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [layout]);

  const hideEventTypeDetails = isEmbed ? embedUiConfig.hideEventTypeDetails : false;

  if (event.isSuccess && !event.data) {
    return <NotFound />;
  }

  // In Embed, a Dialog doesn't look good, we disable it intentionally for the layouts that support showing Form without Dialog(i.e. no-dialog Form)
  const shouldShowFormInDialogMap: Record<BookerLayout, boolean> = {
    // mobile supports showing the Form without Dialog
    mobile: !isEmbed,
    // We don't show Dialog in month_view currently. Can be easily toggled though as it supports no-dialog Form
    month_view: false,
    // week_view doesn't support no-dialog Form
    // When it's supported, disable it for embed
    week_view: true,
    // column_view doesn't support no-dialog Form
    // When it's supported, disable it for embed
    column_view: true,
  };

  const shouldShowFormInDialog = shouldShowFormInDialogMap[layout];
  return (
    <>
      {event.data ? <BookingPageTagManager eventType={event.data} /> : null}
      <div
        className={classNames(
          // In a popup embed, if someone clicks outside the main(having main class or main tag), it closes the embed
          "main",
          "text-default flex min-h-full w-full flex-col items-center",
          "overflow-clip"
        )}>
        <div
          ref={animationScope}
          className={classNames(
            // Sets booker size css variables for the size of all the columns.
            ...getBookerSizeClassNames(layout, bookerState, hideEventTypeDetails),
            "bg-default dark:bg-muted grid max-w-full items-start dark:[color-scheme:dark] sm:transition-[width] sm:duration-300 sm:motion-reduce:transition-none md:flex-row",
            // We remove border only when the content covers entire viewport. Because in embed, it can almost never be the case that it covers entire viewport, we show the border there
            !isEmbed && "sm:transition-[width] sm:duration-300"
          )}>
          <AnimatePresence>
            <BookerSection area="header" className={classNames("bg-default dark:bg-muted sticky top-0 z-10")}>
              <Header
                enabledLayouts={bookerLayouts.enabledLayouts}
                extraDays={extraDays}
                isMobile={isMobile}
              />
            </BookerSection>
            <StickyOnDesktop
              key="meta"
              className={classNames(
                "relative z-10 flex [grid-area:meta]",
                // Important: In Embed if we make min-height:100vh, it will cause the height to continuously keep on increasing
                layout !== BookerLayouts.MONTH_VIEW && !isEmbed && "sm:min-h-screen"
              )}>
              <BookerSection
                area="meta"
                className="max-w-screen flex w-full flex-col md:w-[var(--booker-meta-width)]">
                {layout !== BookerLayouts.MONTH_VIEW &&
                  !(layout === "mobile" && bookerState === "booking") && (
                    <div className=" mt-auto px-5 py-3">
                      <DatePicker />
                    </div>
                  )}
              </BookerSection>
            </StickyOnDesktop>


            <BookerSection
              key="large-calendar"
              area="main"
              visible={layout === BookerLayouts.WEEK_VIEW}
              className="border-subtle sticky top-0 ml-[-1px] h-full md:border-l"
              {...fadeInLeft}>
              <LargeCalendar extraDays={extraDays} />
            </BookerSection>

            <BookerSection
              key="datepicker"
              area="main"
              visible={bookerState !== "booking" && layout === BookerLayouts.MONTH_VIEW}
              {...fadeInLeft}
              initial="visible"
              className="md:border-subtle ml-[-1px] h-full flex-shrink px-5 py-3 md:border-l lg:w-[var(--booker-main-width)]">
              <DatePicker />
            </BookerSection>
            <BookerSection
              key="timeslots"
              area={{ default: "main", month_view: "timeslots" }}
              visible={layout !== BookerLayouts.WEEK_VIEW && bookerState === "selecting_time"}
              className={classNames(
                "border-subtle flex h-full w-full flex-col px-5 py-3 pb-0 md:border-l",
                layout === BookerLayouts.MONTH_VIEW &&
                  "scroll-bar h-full overflow-auto md:w-[var(--booker-timeslots-width)]",
                layout !== BookerLayouts.MONTH_VIEW && "sticky top-0"
              )}
              ref={timeslotsRef}
              {...fadeInLeft}>
              <AvailableTimeSlots
                extraDays={extraDays}
                limitHeight={layout === BookerLayouts.MONTH_VIEW}
                seatsPerTimeSlot={event.data?.seatsPerTimeSlot}
              />
            </BookerSection>
          </AnimatePresence>
        </div>
      </div>
      <EmailSnippetShare username={username} eventSlug={eventSlug} />
    </>
  );
};

export const Booker = (props: BookerProps) => {
  if (props.isAway) return <Away />;

  return (
    <LazyMotion features={domAnimation}>
      <BookerComponent {...props} />
    </LazyMotion>
  );
};
