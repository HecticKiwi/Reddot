"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsClient } from "@uidotdev/usehooks";
import { format, formatDistanceToNow } from "date-fns";

const TimeSinceNow = ({
  date,
  className,
}: {
  date: Date;
  className?: string;
}) => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger className={className}>
        {formatDistanceToNow(date)} ago
      </TooltipTrigger>
      <TooltipContent>
        {format(date, "EEE, MMM dd, yyyy, hh:mm:ss a OOO")}
      </TooltipContent>
    </Tooltip>
  );
};

export default TimeSinceNow;
