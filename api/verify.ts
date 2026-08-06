import { runVerification } from "../services/verification.js";
import type { VerificationInput, VerificationResponse } from "../services/types.js";

export async function verifyMedia(
  input: VerificationInput
): Promise<VerificationResponse> {
  if (!input.mediaType) {
    throw new Error("mediaType is required for verification");
  }

  if (!input.mediaUrl && !input.mediaBytes) {
    throw new Error("Either mediaUrl or mediaBytes must be provided for verification");
  }

  return runVerification(input);
}

