import { InboxIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const navigation = [
  { name: "Incoming", href: "/", icon: InboxIcon },
  {
    name: "Processed",
    href: "/processed",
    icon: CheckCircleIcon,
  },
];
