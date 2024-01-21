"use client";

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { AspectRatio } from "./ui/aspect-ratio";
import { cn } from "@/lib/utils";

export { ReactPlayer };

const MediaPlayer = ({
  url,
  className,
}: {
  url: string;
  className?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !ReactPlayer.canPlay(url)) {
    return null;
  }

  return (
    <>
      <AspectRatio ratio={16 / 9} className={cn("bg-green-50", className)}>
        <ReactPlayer
          url={url}
          controls={true}
          width={"100%"}
          height={"100%"}
          config={{}}
        />
      </AspectRatio>
    </>
  );
};

export default MediaPlayer;
