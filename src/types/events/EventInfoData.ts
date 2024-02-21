import { Dayjs } from "dayjs";

export type EventInfoData = {
  id: number | null;
  eventName: string;
  eventType: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    fullName: string;
  };
  eventDate: Dayjs | string;
  guestCount: number | null;
  artist: {
    id: number;
    fullName: string;
  };
  location: string | null;
  venueName: string | null;
  venueContact: string | null;
  additionalInfo: string | null;
  contract?: {
    id: string;
    url: string;
    signed: boolean;
  };
};
