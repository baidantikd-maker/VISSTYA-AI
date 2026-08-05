import { SEED_REPORTS } from "./data";
import type { VerificationReport } from "./types";

const STORAGE_KEY = "vistai.mock.reports.v1";

const cache = new Map<number, VerificationReport>();

function loadPersisted(): VerificationReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VerificationReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(reports: VerificationReport[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // storage unavailable (e.g. quota) — the in-memory cache keeps reports
    // available for the current session regardless
  }
}

function all(): VerificationReport[] {
  const seen = new Set<number>();
  const result: VerificationReport[] = [];

  Array.from(cache.values()).forEach((r) => {
    result.push(r);
    seen.add(r.id);
  });
  loadPersisted().forEach((r) => {
    if (!seen.has(r.id)) {
      result.push(r);
      seen.add(r.id);
    }
  });
  SEED_REPORTS.forEach((r) => {
    if (!seen.has(r.id)) {
      result.push(r);
      seen.add(r.id);
    }
  });

  return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const mockStore = {
  list(): VerificationReport[] {
    return all();
  },

  getById(id: number | string): VerificationReport | undefined {
    const num = Number(id);
    return all().find((r) => r.id === num);
  },

  getByShareToken(token: string): VerificationReport | undefined {
    return all().find((r) => r.shareToken === token);
  },

  create(report: VerificationReport): VerificationReport {
    cache.set(report.id, report);
    persist(Array.from(cache.values()));
    return report;
  },

  clearCreated() {
    cache.clear();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};
