import { Dayjs } from "dayjs";
import { TrackInfo } from "../playlist/TrackInfo";

export type TimelineData = {
  id?: number | null;
  name: string;
  time: Dayjs | string;
  track: TrackInfo;
  instructions?: string | null;
};
