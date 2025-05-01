import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { typeId } from "./extensions";
import { typeid as generateId } from "typeid-js";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const user = pgTable("user", {
  id: typeId("id", "user")
    .primaryKey()
    .$defaultFn(() => generateId("user")),
  name: text("name").notNull().unique(),
  alias: text("alias"),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  ...timestamps,
});

export const session = pgTable("session", {
  id: typeId("id", "session")
    .primaryKey()
    .$defaultFn(() => generateId("session")),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ...timestamps,
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: typeId("user_id", "user")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: typeId("id", "account")
    .primaryKey()
    .$defaultFn(() => generateId("account")),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: typeId("user_id", "user")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  ...timestamps,
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const verification = pgTable("verification", {
  id: typeId("id", "verification")
    .primaryKey()
    .$defaultFn(() => generateId("verification")),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});

export const apikey = pgTable("apikey", {
  id: typeId("id", "apikey")
    .primaryKey()
    .$defaultFn(() => generateId("apikey")),
  name: text("name"),
  start: text("start"),
  prefix: text("prefix"),
  key: text("key").notNull(),
  userId: typeId("user_id", "user")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  refillInterval: integer("refill_interval"),
  refillAmount: integer("refill_amount"),
  lastRefillAt: timestamp("last_refill_at"),
  enabled: boolean("enabled"),
  rateLimitEnabled: boolean("rate_limit_enabled"),
  rateLimitTimeWindow: integer("rate_limit_time_window"),
  rateLimitMax: integer("rate_limit_max"),
  requestCount: integer("request_count"),
  remaining: integer("remaining"),
  lastRequest: timestamp("last_request"),
  expiresAt: timestamp("expires_at"),
  ...timestamps,
  permissions: text("permissions"),
  metadata: text("metadata"),
});

export const apikeyRelations = relations(apikey, ({ one }) => ({
  user: one(user, {
    fields: [apikey.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const config = pgTable("config", {
  id: typeId("id", "config")
    .primaryKey()
    .$defaultFn(() => generateId("config")),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  ...timestamps,
});
