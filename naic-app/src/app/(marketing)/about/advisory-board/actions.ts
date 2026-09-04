"use server";

import { randomUUID } from "node:crypto";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AdvisoryResult = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: "That value is too long." })
    .optional()
    .transform((v) => (v ? v : null));

const AdvisorySchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, { error: "Enter your name." })
    .max(120, { error: "That name is too long." }),
  title: optionalText(160),
  company: optionalText(160),
  email: z.email({ error: "Enter a valid email." }).max(254),
  phone: optionalText(40),
  expertise: optionalText(300),
  message: z
    .string()
    .trim()
    .min(40, { error: "Tell us a little more — at least 40 characters." })
    .max(4000, { error: "Please keep this under 4000 characters." }),
});

const BIO_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const HEADSHOT_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_BIO_BYTES = 10 * 1024 * 1024;
const MAX_HEADSHOT_BYTES = 5 * 1024 * 1024;

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop();
  return fromName && fromName.length <= 5 ? fromName.toLowerCase() : "bin";
}

export async function submitAdvisoryApplication(
  _prev: AdvisoryResult,
  formData: FormData,
): Promise<AdvisoryResult> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "Applications aren’t wired up yet. Email web@nationalaiconsortium.org instead.",
    };
  }

  // Honeypot: a field only a bot would fill in.
  if (formData.get("website")) return { ok: true };

  const parsed = AdvisorySchema.safeParse({
    full_name: formData.get("full_name"),
    title: formData.get("title"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    expertise: formData.get("expertise"),
    message: formData.get("message"),
  });

  const fileErrors: Record<string, string[]> = {};

  const bio = formData.get("bio");
  if (!(bio instanceof File) || bio.size === 0) {
    fileErrors.bio = ["Upload your bio as a PDF or Word document."];
  } else if (!BIO_TYPES.has(bio.type)) {
    fileErrors.bio = ["Bio must be a PDF or Word document (.pdf, .doc, .docx)."];
  } else if (bio.size > MAX_BIO_BYTES) {
    fileErrors.bio = ["Bio must be under 10 MB."];
  }

  const headshot = formData.get("headshot");
  if (!(headshot instanceof File) || headshot.size === 0) {
    fileErrors.headshot = ["Upload a professional headshot."];
  } else if (!HEADSHOT_TYPES.has(headshot.type)) {
    fileErrors.headshot = ["Headshot must be a JPEG or PNG image."];
  } else if (headshot.size > MAX_HEADSHOT_BYTES) {
    fileErrors.headshot = ["Headshot must be under 5 MB."];
  }

  if (!parsed.success) {
    return {
      fieldErrors: {
        ...z.flattenError(parsed.error).fieldErrors,
        ...fileErrors,
      },
    };
  }

  if (Object.keys(fileErrors).length > 0) {
    return { fieldErrors: fileErrors };
  }

  const bioFile = bio as File;
  const headshotFile = headshot as File;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stamp = randomUUID();
  const bioPath = `bios/${stamp}.${extensionFor(bioFile)}`;
  const headshotPath = `headshots/${stamp}.${extensionFor(headshotFile)}`;
  const bucket = supabase.storage.from("advisory-applications");

  const { error: bioUploadError } = await bucket.upload(bioPath, bioFile, {
    contentType: bioFile.type,
  });
  if (bioUploadError) {
    return { error: "That didn’t send. Please try again in a moment." };
  }

  const { error: headshotUploadError } = await bucket.upload(
    headshotPath,
    headshotFile,
    { contentType: headshotFile.type },
  );
  if (headshotUploadError) {
    await bucket.remove([bioPath]);
    return { error: "That didn’t send. Please try again in a moment." };
  }

  const { error } = await supabase.from("advisory_applications").insert({
    ...parsed.data,
    bio_path: bioPath,
    headshot_path: headshotPath,
    submitted_by: user?.id ?? null,
  });

  if (error) {
    await bucket.remove([bioPath, headshotPath]);
    return { error: "That didn’t send. Please try again in a moment." };
  }

  return { ok: true };
}
