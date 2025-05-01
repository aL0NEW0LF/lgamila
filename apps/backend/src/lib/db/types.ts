import type { user, session, account, verification } from "./schema";

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;

// Insert types
export type NewUser = typeof user.$inferInsert;
export type NewSession = typeof session.$inferInsert;
export type NewAccount = typeof account.$inferInsert;
export type NewVerification = typeof verification.$inferInsert;

// Relation types
export type UserWithRelations = User & {
  sessions?: Session[];
  accounts?: Account[];
};

export type SessionWithRelations = Session & {
  user?: User;
};

export type AccountWithRelations = Account & {
  user?: User;
};
