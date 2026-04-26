import { clsx } from "clsx";
import { iconMap } from "@/lib/icon-map";
import { IconName } from "@/lib/types";

interface AppIconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function AppIcon({ name, className, size = 18 }: AppIconProps) {
  const Icon = iconMap[name];

  if (!Icon) {
    return null;
  }

  return <Icon className={clsx("icon", className)} size={size} aria-hidden="true" />;
}
