import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";

const TimeSinceNow = ({
  date,
  className,
}: {
  date: Date;
  className?: string;
}) => {
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
