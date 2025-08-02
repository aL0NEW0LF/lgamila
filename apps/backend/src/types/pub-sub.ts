export enum Topics {
  STREAMER_LIVE = 'streamer-live',
}

export interface TopicMessage {
  topic: Topics;
  data: unknown;
}

export interface StreamerLiveMessage extends TopicMessage {
  topic: Topics.STREAMER_LIVE;
  data: {
    id: string;
  };
}
