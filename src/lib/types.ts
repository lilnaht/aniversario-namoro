export type Settings = {
  id: number;
  relationship_start_date: string | null;
  wedding_date: string | null;
  spotify_track_url: string | null;
  updated_at: string;
};

export type CarouselImage = {
  id: string;
  image_path: string;
  caption: string | null;
  position: number;
  created_at: string;
};

export type Quote = {
  id: string;
  text: string;
  created_at: string;
};

export type TimelinePost = {
  id: string;
  date: string;
  title: string | null;
  content: string;
  image_path: string | null;
  created_at: string;
};

export type Letter = {
  id: string;
  date: string;
  title: string | null;
  content: string;
  image_path: string | null;
  slug: string | null;
  created_at: string;
};

export type Reason = {
  id: string;
  text: string;
  position: number;
  created_at: string;
};
