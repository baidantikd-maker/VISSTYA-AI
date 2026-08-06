import { fetchMediaBytes } from "./mediaBytes.js";
import { MetadataResult, MediaType } from "./types.js";
import { parse } from "exifr";
import { fileTypeFromBuffer } from "file-type";
import { Buffer } from "buffer";

const normalizeMimeType = (mimeType: string | null | undefined): string | null => {
  if (!mimeType) return null;
  return mimeType.split(";")[0].trim().toLowerCase() || null;
};

const parseExifDate = (value: unknown): string | null => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const parseGpsCoordinates = (
  exif: Record<string, unknown>
): { latitude: number; longitude: number } | null => {
  const latValue = (exif as any).latitude ?? (exif as any).GPSLatitude;
  const lonValue = (exif as any).longitude ?? (exif as any).GPSLongitude;

  const convertDms = (value: unknown): number | null => {
    if (typeof value === "number") return value;
    if (Array.isArray(value) && value.length === 3) {
      const [degrees, minutes, seconds] = value.map(Number);
      if ([degrees, minutes, seconds].every(Number.isFinite)) {
        return degrees + minutes / 60 + seconds / 3600;
      }
    }
    return null;
  };

  const latitude = convertDms(latValue);
  const longitude = convertDms(lonValue);

  if (latitude == null || longitude == null) return null;
  return { latitude, longitude };
};

const detectMimeFromBytes = async (bytes: Buffer): Promise<string | null> => {
  try {
    const type = await fileTypeFromBuffer(bytes);
    if (type?.mime) return type.mime.toLowerCase();
  } catch {
    // fallback to header sniffing below
  }

  if (bytes.length >= 12) {
    const header = bytes.slice(0, 12).toString("hex").toLowerCase();
    if (header.startsWith("ffd8")) return "image/jpeg";
    if (header.startsWith("89504e470d0a1a0a")) return "image/png";
    if (header.startsWith("47494638")) return "image/gif";
    if (header.startsWith("424d")) return "image/bmp";
    if (header.includes("66747970")) return "video/mp4";
    if (header.startsWith("1a45dfa3")) return "video/webm";
    if (header.startsWith("000001ba") || header.startsWith("000001b3")) return "video/mpeg";
  }

  return null;
};

const parseImageDimensions = (
  bytes: Buffer,
  mimeType: string | null
): { width: number; height: number } | null => {
  if (!mimeType) return null;
  const buffer = Buffer.from(bytes);

  if (mimeType === "image/png" && buffer.length >= 24) {
    const signature = buffer.slice(0, 8);
    if (signature.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
  }

  if (mimeType === "image/gif" && buffer.length >= 10) {
    const signature = buffer.slice(0, 6).toString("ascii");
    if (signature === "GIF87a" || signature === "GIF89a") {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height };
    }
  }

  if (mimeType === "image/jpeg" && buffer.length >= 4) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3 && offset + 7 < buffer.length) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height };
      }
      offset += 2 + length;
    }
  }

  return null;
};

const parseExif = async (bytes: Buffer): Promise<Record<string, unknown>> => {
  try {
    const type = await fileTypeFromBuffer(bytes);
    if (!type || !type.mime.startsWith("image/")) return {};
    const exif = await parse(bytes);
    return exif ?? {};
  } catch {
    return {};
  }
};

const fileFormatFromMime = (mimeType: string | null): string | null => {
  if (!mimeType) return null;
  if (mimeType === "image/jpeg") return "JPEG";
  if (mimeType === "image/png") return "PNG";
  if (mimeType === "image/gif") return "GIF";
  if (mimeType === "image/bmp") return "BMP";
  if (mimeType === "video/mp4") return "MP4";
  if (mimeType === "video/webm") return "WebM";
  if (mimeType === "video/mpeg") return "MPEG";
  return mimeType.split("/")[1]?.toUpperCase() ?? null;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export async function analyzeMetadata(
  mediaUrl: string | null,
  mediaType: MediaType,
  mediaBytes?: Uint8Array | Buffer,
  mediaFilename?: string
): Promise<MetadataResult> {
  const findings: string[] = [];
  const warnings: string[] = [];
  const issues: string[] = [];
  let quality = 0.2;
  let mimeType: string | null = null;
  let mimeMatch: boolean | null = null;
  let hasExif = false;
  let exifDate: string | null = null;
  let gpsCoordinates: { latitude: number; longitude: number } | null = null;
  let camera: string | null = null;
  let resolution: string | null = null;
  let fileFormat: string | null = null;

  const urlValid = typeof mediaUrl === "string" && /^https?:\/\//i.test(mediaUrl);
  if (urlValid) {
    findings.push("Media URL is valid");
    quality += 0.05;
  } else if (mediaUrl) {
    warnings.push("Media URL appears invalid");
  } else {
    findings.push("Processing local upload media bytes");
  }

  try {
    let bytes: Buffer | undefined;
    if (mediaBytes) {
      bytes = Buffer.from(mediaBytes);
      findings.push("Media bytes were provided directly for analysis");
    } else if (mediaUrl) {
      const downloaded = await fetchMediaBytes(mediaUrl);
      bytes = downloaded.bytes;
      const downloadedMimeType = normalizeMimeType(downloaded.mimeType);
      mimeType = downloadedMimeType;
      if (downloadedMimeType) {
        findings.push(`Downloaded MIME type: ${downloadedMimeType}`);
        quality += 0.05;
      }
    }

    if (!bytes) {
      throw new Error("No media bytes available for metadata analysis");
    }

    if (!mimeType) {
      mimeType = await detectMimeFromBytes(bytes);
    }
    if (mimeType) {
      findings.push(`Detected MIME type: ${mimeType}`);
      quality += 0.05;
      fileFormat = fileFormatFromMime(mimeType);
      if (fileFormat) {
        findings.push(`Inferred file format: ${fileFormat}`);
        quality += 0.05;
      }
    } else {
      warnings.push("Unable to detect MIME type from media bytes");
      issues.push("unknown file format");
    }

    const expectedMimePrefix = mediaType === "image" ? "image/" : "video/";
    if (mimeType && !mimeType.startsWith(expectedMimePrefix)) {
      warnings.push(`Declared media type ${mediaType} does not match detected MIME type ${mimeType}`);
      issues.push("media type mismatch");
    }

    if (mediaUrl && urlValid && mimeType) {
      const downloadedHeaderMime = normalizeMimeType(mimeType);
      if (downloadedHeaderMime && mimeType === downloadedHeaderMime) {
        mimeMatch = true;
        quality += 0.05;
      }
    }

    if (mediaType === "image") {
      const exif = await parseExif(bytes);
      hasExif = Object.keys(exif).length > 0;
      if (hasExif) {
        findings.push("EXIF metadata is present");
        quality += 0.15;

        exifDate =
          parseExifDate((exif as any).DateTimeOriginal) ||
          parseExifDate((exif as any).CreateDate) ||
          parseExifDate((exif as any).ModifyDate) ||
          parseExifDate((exif as any).DateTime);
        if (exifDate) {
          findings.push(`EXIF date/time extracted: ${exifDate}`);
          quality += 0.1;
        } else {
          warnings.push("EXIF metadata contains no usable date/time field");
          issues.push("missing EXIF timestamp");
        }

        gpsCoordinates = parseGpsCoordinates(exif);
        if (gpsCoordinates) {
          findings.push("GPS coordinates found in EXIF metadata");
          quality += 0.15;
        } else {
          warnings.push("No GPS coordinates found in EXIF metadata");
          issues.push("missing GPS coordinates");
        }

        const make = (exif as any).Make ?? (exif as any).make;
        const model = (exif as any).Model ?? (exif as any).model;
        camera = [make, model].filter(Boolean).map(String).join(" ").trim() || null;
        if (camera) {
          findings.push(`Camera information extracted: ${camera}`);
          quality += 0.1;
        } else {
          warnings.push("No camera make/model found in EXIF metadata");
          issues.push("missing camera make/model");
        }
      } else {
        warnings.push("No EXIF metadata detected for image");
        issues.push("no EXIF metadata");
      }

      const dimensions = parseImageDimensions(bytes, mimeType);
      if (dimensions) {
        resolution = `${dimensions.width}x${dimensions.height}`;
        findings.push(`Detected image resolution: ${resolution}`);
        quality += 0.1;
      } else {
        warnings.push("Could not detect image resolution from bytes");
        issues.push("missing resolution");
      }
    } else {
      findings.push("Video metadata analysis is limited; EXIF is often unavailable.");
      if (!mimeType) {
        issues.push("missing video format");
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    warnings.push(`Metadata analysis failed: ${message}`);
    issues.push("analysis failure");
  }

  return {
    mediaUrl,
    mediaType,
    urlValid,
    mimeType,
    mimeMatch,
    hasExif,
    exifDate,
    camera,
    resolution,
    fileFormat,
    gpsCoordinates,
    issues,
    warnings,
    findings,
    quality: clamp(quality, 0, 1),
    details: {
      mediaType,
      filename: mediaFilename,
    },
  };
}
