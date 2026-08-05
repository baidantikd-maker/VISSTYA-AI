import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, verificationReports, VerificationReport, InsertVerificationReport } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// In-memory fallback store (demo mode)
// Used when no DATABASE_URL is configured so the app still works locally.
// Data is lost on server restart.
// ============================================================================

const memoryReports = new Map<number, VerificationReport>();
let memoryReportId = 0;

const memoryReport = (id: number, report: InsertVerificationReport): VerificationReport => {
  const now = new Date();
  return {
    id,
    mediaUrl: report.mediaUrl,
    mediaType: report.mediaType,
    claimEvent: report.claimEvent ?? null,
    claimLocation: report.claimLocation ?? null,
    claimDate: report.claimDate ?? null,
    metadataScore: report.metadataScore ?? null,
    visionScore: report.visionScore ?? null,
    weatherScore: report.weatherScore ?? null,
    evidenceScore: report.evidenceScore ?? null,
    totalScore: report.totalScore ?? null,
    statusBand: report.statusBand,
    metadataFindings: report.metadataFindings ?? null,
    visionFindings: report.visionFindings ?? null,
    weatherFindings: report.weatherFindings ?? null,
    evidenceFindings: report.evidenceFindings ?? null,
    summary: report.summary ?? null,
    shareToken: report.shareToken ?? null,
    isPublic: report.isPublic ?? "false",
    userId: report.userId,
    createdAt: now,
    updatedAt: now,
  };
};

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Verification Reports queries

export async function createVerificationReport(report: InsertVerificationReport): Promise<VerificationReport> {
  const db = await getDb();
  if (!db) {
    const id = ++memoryReportId;
    const created = memoryReport(id, report);
    memoryReports.set(id, created);
    return created;
  }

  const result = await db.insert(verificationReports).values(report);
  const reportId = result[0]?.insertId;
  
  if (!reportId) throw new Error("Failed to create verification report");

  const created = await db.select().from(verificationReports).where(eq(verificationReports.id, reportId as number)).limit(1);
  if (!created[0]) throw new Error("Failed to retrieve created report");
  
  return created[0];
}

export async function getVerificationReportById(id: number): Promise<VerificationReport | undefined> {
  const db = await getDb();
  if (!db) return memoryReports.get(id);

  const result = await db.select().from(verificationReports).where(eq(verificationReports.id, id)).limit(1);
  return result[0];
}

export async function getVerificationReportByShareToken(shareToken: string): Promise<VerificationReport | undefined> {
  const db = await getDb();
  if (!db) {
    return Array.from(memoryReports.values()).find(
      report => report.shareToken === shareToken
    );
  }

  const result = await db.select().from(verificationReports).where(eq(verificationReports.shareToken, shareToken)).limit(1);
  return result[0];
}

export async function getUserVerificationReports(userId: number, limit = 50): Promise<VerificationReport[]> {
  const db = await getDb();
  if (!db) {
    return Array.from(memoryReports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  return await db.select().from(verificationReports)
    .where(eq(verificationReports.userId, userId))
    .orderBy(desc(verificationReports.createdAt))
    .limit(limit);
}

export async function updateVerificationReport(id: number, updates: Partial<VerificationReport>): Promise<VerificationReport | undefined> {
  const db = await getDb();
  if (!db) {
    const existing = memoryReports.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    memoryReports.set(id, updated);
    return updated;
  }

  await db.update(verificationReports).set(updates).where(eq(verificationReports.id, id));
  return await getVerificationReportById(id);
}
