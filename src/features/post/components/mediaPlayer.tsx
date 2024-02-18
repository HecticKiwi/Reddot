"use client";

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { AspectRatio } from "../../../components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { useIsClient } from "@uidotdev/usehooks";

export { ReactPlayer };

const MediaPlayer = ({
  url,
  className,
}: {
  url: string;
  className?: string;
}) => {
  const isClient = useIsClient();

  if (!isClient || !ReactPlayer.canPlay(url)) {
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
