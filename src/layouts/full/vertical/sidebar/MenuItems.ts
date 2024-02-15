import { uniqueId } from "lodash";

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
  protected: boolean;
}
import {
  IconPoint,
  IconUsers,
  IconCalendarEvent,
  IconMusic,
  IconReceipt,
} from "@tabler/icons-react";
import { User, useAuth } from "../../../../../context/AuthContext";

const allMenuitems: MenuitemsType[] = [
  // {
  //   navlabel: true,
  //   subheader: "Musicology",
  // },
  {
    id: uniqueId(),
    title: "Events",
    icon: IconCalendarEvent,
    href: "/events",
    protected: false,
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: IconUsers,
    href: "/users",
    protected: true,
    children: [
      {
        id: uniqueId(),
        title: "Clients",
        icon: IconPoint,
        href: "/users/clients",
        protected: true,
      },
      {
        id: uniqueId(),
        title: "Artists",
        icon: IconPoint,
        href: "/users/artists",
        protected: true,
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Playlists",
    icon: IconMusic,
    href: "/playlists",
    protected: true,
  },
  {
    id: uniqueId(),
    title: "Quotes",
    icon: IconReceipt,
    href: "/quotes",
    protected: true,
  },
];

const getMenuItems = (user: User | null): MenuitemsType[] => {
  if (user?.accountType.id === 3) {
    return allMenuitems.filter((menuItem) => !menuItem.protected);
  }

  return allMenuitems;
};

export default getMenuItems;
