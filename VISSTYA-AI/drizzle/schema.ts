import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Verification reports table storing trust analysis results
 */
export const verificationReports = mysqlTable("verification_reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  mediaUrl: text("mediaUrl").notNull(),
  mediaType: mysqlEnum("mediaType", ["image", "video"]).notNull(),
  claimEvent: text("claimEvent"),
  claimLocation: text("claimLocation"),
  claimDate: timestamp("claimDate"),
  // Trust scores (out of max points)
  metadataScore: decimal("metadataScore", { precision: 5, scale: 2 }).default("0"),
  visionScore: decimal("visionScore", { precision: 5, scale: 2 }).default("0"),
  weatherScore: decimal("weatherScore", { precision: 5, scale: 2 }).default("0"),
  evidenceScore: decimal("evidenceScore", { precision: 5, scale: 2 }).default("0"),
  totalScore: decimal("totalScore", { precision: 5, scale: 2 }).default("0"),
  // Status band: FALSE (< 40), AVERAGE (40-80), TRUSTABLE (80-100)
  statusBand: mysqlEnum("statusBand", ["FALSE", "AVERAGE", "TRUSTABLE"]).notNull(),
  // Detailed findings stored as JSON
  metadataFindings: json("metadataFindings"),
  visionFindings: json("visionFindings"),
  weatherFindings: json("weatherFindings"),
  evidenceFindings: json("evidenceFindings"),
  // Summary narrative
  summary: text("summary"),
  // Share token for public access
  shareToken: varchar("shareToken", { length: 64 }).unique(),
  isPublic: mysqlEnum("isPublic", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VerificationReport = typeof verificationReports.$inferSelect;
export type InsertVerificationReport = typeof verificationReports.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reports: many(verificationReports),
}));

export const verificationReportsRelations = relations(verificationReports, ({ one }) => ({
  user: one(users, {
    fields: [verificationReports.userId],
    references: [users.id],
  }),
}));