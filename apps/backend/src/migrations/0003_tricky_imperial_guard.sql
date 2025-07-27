ALTER TABLE "streamer" DROP CONSTRAINT "streamer_twitch_username_unique";--> statement-breakpoint
ALTER TABLE "streamer" DROP CONSTRAINT "streamer_kick_username_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_twitch_username_non_empty" ON "streamer" USING btree ("twitch_username") WHERE "streamer"."twitch_username" IS NOT NULL AND "streamer"."twitch_username" != '';--> statement-breakpoint
CREATE UNIQUE INDEX "unique_kick_username_non_empty" ON "streamer" USING btree ("kick_username") WHERE "streamer"."kick_username" IS NOT NULL AND "streamer"."kick_username" != '';