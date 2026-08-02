import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { ENV } from "./env";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/**
 * Fixed identity used in demo mode, where no OAuth server or database is
 * available. Every request is authenticated as this user.
 */
export const DEMO_USER: User = {
  id: 1,
  openId: "demo-user",
  name: "Demo User",
  email: null,
  loginMethod: "demo",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    if (ENV.isDemoMode) {
      // Authentication is optional for public procedures; in demo mode we
      // sign every request in as the demo user instead.
      user = DEMO_USER;
    } else {
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
