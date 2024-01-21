import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Heart, User } from "lucide-react";
import { ReactNode } from "react";

const CircleImage = ({
  className,
  src,
  alt,
  fallback,
}: {
  className?: string;
  src?: string | null;
  alt: string;
  fallback?: ReactNode;
}) => {
  return (
    <>
      <Avatar className={cn(className)}>
        <AvatarImage src={src || ""} alt={alt} className="object-cover" />
        <AvatarFallback className="">{fallback}</AvatarFallback>
      </Avatar>
    </>
  );
};

export default CircleImage;
