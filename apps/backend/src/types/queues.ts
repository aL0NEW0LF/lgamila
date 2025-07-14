export enum JobName {
  ScheduleStreamCheck = 'schedule-stream-check',
  StreamCheck = 'stream-check',
}

export enum QueueName {
  ScheduleStreamCheck = 'schedule-stream-check',
  StreamCheck = 'stream-check',
}

// biome-ignore lint/complexity/noBannedTypes: diha fmok
export type ScheduleStreamCheckJob = {};

export type StreamCheckJob = {
  streamerId: string;
};
