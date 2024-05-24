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
  accessLevel: number;
}
import {
  IconPoint,
  IconUsers,
  IconCalendarEvent,
  IconMusic,
  IconReceipt,
} from "@tabler/icons-react";
import { User, useAuth } from "../../../../../context/AuthContext";

const ADMIN_ID = 1;
const ARTIST_ID = 2;
const CLIENT_ID = 3;

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
    accessLevel: CLIENT_ID,
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: IconUsers,
    href: "/users",
    accessLevel: ADMIN_ID,
    children: [
      {
        id: uniqueId(),
        title: "Clients",
        icon: IconPoint,
        href: "/users/clients",
        accessLevel: ADMIN_ID,
      },
      {
        id: uniqueId(),
        title: "Artists",
        icon: IconPoint,
        href: "/users/artists",
        accessLevel: ADMIN_ID,
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Playlists",
    icon: IconMusic,
    href: "/playlists",
    accessLevel: ARTIST_ID,
  },
  {
    id: uniqueId(),
    title: "Quotes",
    icon: IconReceipt,
    href: "/quotes",
    accessLevel: ADMIN_ID,
  },
];

const getMenuItems = (user: User | null): MenuitemsType[] => {
  const menuItems = allMenuitems.filter(
    (menuItem) => menuItem.accessLevel >= (user?.accountType.id ?? CLIENT_ID)
  );

  return menuItems;
};

export default getMenuItems;
