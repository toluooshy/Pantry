export type Credentials = {
  [key: string]: ArchiveObject | TopicsObject | AuthorsObject | InstancesObject;
  archive: ArchiveObject;
  topics: TopicsObject;
  authors: AuthorsObject;
  instances: InstancesObject;
};

export type PostObject = {
  [key: string]: number | string | Object | boolean | string[];
  id: string;
  originalAuthor: Object;
  authorId: string;
  timestamp: string;
  source: string;
  server: string;
  platform: string;
  body: string;
  images: string[];
  tags: string[];
  replies: number;
  reposts: number;
  likes: number;
  url: string;
  heatindex: number;
};

export type ArchiveObject = {
  [key: string]: PostObject;
};

export type TopicsObject = {
  [key: string]: number;
};

export type AuthorsObject = {
  [key: string]: number;
};
export type InstancesObject = {
  [key: string]: number;
};
