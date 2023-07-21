import type { EventTypeSetup, FormValues } from "pages/event-types/[type]";
import type { Dispatch, SetStateAction } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useLocale } from "@calcom/lib/hooks/useLocale";

import { SettingsToggle } from "@calcom/ui";

type WorkEmailControllerProps = {
  eventType: EventTypeSetup;
  workEmail: boolean;
  onWorkEmail: Dispatch<SetStateAction<boolean>>;
};

export default function WorkEmailController({ workEmail, onWorkEmail, eventType }: WorkEmailControllerProps) {
  const formMethods = useFormContext<FormValues>();
  const { t } = useLocale();

  return (
    <div className="block items-start sm:flex">
      <div className="w-full">
        <Controller
          name="workEmail"
          control={formMethods.control}
          render={() => (
            <SettingsToggle
              title={t("work_email")}
              description={t("work_email_description")}
              checked={workEmail}
              onCheckedChange={(val) => {
                formMethods.setValue("workEmail", val);
                onWorkEmail(val);
              }}
            />
          )}
        />
      </div>
    </div>
  );
}
