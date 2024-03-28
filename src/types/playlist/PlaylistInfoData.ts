import { TrackInfo } from "./TrackInfo";

export type PlaylistInfoData = {
  id?: number | null;
  spotifyPlaylistId?: number | null;
  eventId?: number | null;
  playlistUrl?: string | null;
  eventType?: {
    id: number;
    name: string;
  };
  name?: string;
  tracks?: TrackInfo[];
};
