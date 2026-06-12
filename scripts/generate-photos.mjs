#!/usr/bin/env node
/**
 * ZUKKA photo pipeline — generates model photos from product photos via Gemini API.
 *
 * Usage:
 *   node scripts/generate-photos.mjs 3              # one product (front + back)
 *   node scripts/generate-photos.mjs 3 5 6          # several products
 *   node scripts/generate-photos.mjs 3 --model=luna # persona: sofia (default) | valentina | luna
 *   node scripts/generate-photos.mjs 3 --force      # regenerate even if output exists
 *   node scripts/generate-photos.mjs 3 --front-only # skip back view
 *   node scripts/generate-photos.mjs 3 --fix-framing # re-run existing outputs through the framing fix prompt
 *   node scripts/generate-photos.mjs 3 --fix-background # re-run existing outputs through the background fix prompt
 *   node scripts/generate-photos.mjs 3 --fix="custom instruction" # re-run existing outputs through a custom fix prompt
 *   node scripts/generate-photos.mjs 3 --fix="..." --ref=/path/to/detail.jpg # attach a reference image to the fix
 *
 * Reads:  photos/photoproducts/{n}f.* and {n}t.* (or {n}b.*)
 * Writes: photos/photomodel/{n}f.png and {n}t.png
 * Requires GEMINI_API_KEY in .env.local. Cost: ~USD 0.04 per generated image.
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
// Sources are searched in order: clean product shots first, raw cellphone photos as fallback
const SOURCE_DIRS = [join(ROOT, "photos", "photoproducts"), join(ROOT, "photos", "photocelular")];
const OUTPUT_DIR = join(ROOT, "photos", "photomodel");
// Default model is cheap (~$0.04/image); --pro switches to the pro image model
// (better at rendering small text, several times the cost) for stubborn cases.
const MODEL_ID = process.argv.includes("--pro") ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`;

const SHARED_BLOCK = `
— GARMENT —
Analyze the garment in the photo and reproduce it exactly on the model: preserve the exact color, fabric texture, pattern, and every detail (straps, zippers, slits, hardware, embellishments). Do not alter or invent any detail.
Do NOT add anything that is not in the photo: no slits, no cutouts, no extra straps, no embellishments. If the garment is plain, keep it plain.
Preserve the fabric FINISH exactly: matte stays matte, satin stays satin, sequins stay sequins, glitter shimmer stays glitter shimmer.
Logos, brand text, zippers and hardware must be reproduced exactly as in the photo, with every letter sharp and correctly spelled.

— VISUAL CONSISTENCY — apply exactly every time —
Background: warm soft beige (#f0ece4), very subtle top-to-bottom gradient, no texture, perfectly clean
Lighting: soft diffused studio lighting, completely even, no harsh shadows, no overexposure, warm neutral tone
Shadow: single very subtle drop shadow directly beneath the model's feet, soft edges
Color grade: warm and neutral, slightly matte, not oversaturated — premium editorial fashion catalog
Quality: ultra-sharp, photorealistic, high resolution, ready to publish

— FRAMING — non-negotiable —
FULL BODY mandatory: entire figure visible from top of head to feet, zero cropping of any body part.
She wears elegant neutral heels; her shoes and the floor beneath them are fully inside the frame, with visible empty floor space below the shoes. This applies regardless of garment length — for short dresses the full legs, ankles and shoes must be visible.
The model must occupy roughly 75% of the frame height, with visible space above the head and below the feet.
Same proportions as a standard full-length editorial e-commerce catalog shot.
Output image ratio: 3:4 portrait (e.g. 900x1200px).
The model should fill the frame vertically with moderate side margins, not too much empty space on sides.`;

const PERSONAS = {
  sofia: `Sofia: latina woman, 25 years old, golden mediterranean skin tone, dark brown hair neatly pulled back in a low bun, brown eyes, serene and professional expression, 1.75m tall, slim-medium build.
Pose: standing straight, hands loosely clasped together at hip level, looking directly at camera, slight natural posture.`,
  valentina: `Valentina: woman, 24 years old, light rosy skin tone, dark blonde straight hair loose falling over shoulders, green eyes, fresh and natural expression with a subtle smile, 1.73m tall, slim build.
Pose: standing, one arm slightly relaxed at side, direct gaze at camera, natural and relaxed posture.`,
  luna: `Luna: latina woman, 26 years old, warm caramel skin tone, long straight black hair loose falling over shoulders, dark eyes, sophisticated and editorial expression, 1.76m tall, medium build.
Pose: standing, one hand resting on hip, intense gaze directly at camera, confident and elegant posture.`,
};

/* Prepended when the source is a raw cellphone photo instead of a clean product shot */
const CELLPHONE_SOURCE_BLOCK = `
— SOURCE PHOTO —
The input is a casual cellphone photo: the garment may be on a hanger, wrinkled, poorly lit, with color cast and a cluttered background. First infer the garment's TRUE color, fabric finish and construction from it, mentally correcting the bad lighting. Ignore the background, the hanger, and any reflections — only the garment matters. Render the garment as it would look freshly steamed, with no wrinkles from storage.`;

function frontPrompt(persona, { cellphoneSource = false } = {}) {
  return `Take this clothing photo and generate a professional e-commerce fashion photo of the garment worn by a model.
${cellphoneSource ? CELLPHONE_SOURCE_BLOCK : ""}
— MODEL —
${PERSONAS[persona]}
${SHARED_BLOCK}`;
}

const BACK_PROMPT = `The first image is the front view of a model wearing a garment. The second image is a real photo of the back of the same garment.

Generate the exact same photo as the first image but showing the back view of the garment and model, using the second image as the only reference for all back details.

Keep identical: same model, same shoes, same background (#f0ece4 warm beige), same lighting, same quality, same color grade.

Only change: the model turns around completely. The camera sees her full back — the back of her head and hair are visible and her face is NOT visible at all.
Copy the back of the garment EXACTLY from the second image: zipper (including its color and tape), open back depth, straps, buttons, back label, or any back design. Do NOT invent straps, lace-up details, cutouts or any element that is not in the second image; if its back is plain, render it plain. Remove any price tag or hang tag visible in the reference — the garment is worn, not for sale display.

— FRAMING — non-negotiable —
FULL BODY mandatory: entire figure visible from top of head to feet, zero cropping.
Her shoes and the floor beneath them are fully inside the frame, regardless of garment length.
The model must occupy roughly 75% of the frame height, with visible space above and below.
Output image ratio: 3:4 portrait (e.g. 900x1200px).
The model should fill the frame vertically with moderate side margins.
Do NOT generate a ghost mannequin — the model must be wearing the garment, showing her back.`;

const FIX_FRAMING_PROMPT = `Regenerate the same photo but fix the framing: show the complete full body from head to feet with no cropping. Output ratio must be 3:4 portrait. The model must be entirely visible with space above the head and below the feet. Keep everything else identical: same model, same garment with every detail, same beige background (#f0ece4), same lighting, same color grade.`;

const FIX_BACKGROUND_PROMPT = `Regenerate but fix the background: it must be warm soft beige (#f0ece4), very subtle gradient, completely clean with no texture, objects or elements. Keep model, garment, lighting, framing and 3:4 ratio identical.`;

function loadApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envPath = join(ROOT, ".env.local");
  if (existsSync(envPath)) {
    const match = readFileSync(envPath, "utf8").match(/^GEMINI_API_KEY=["']?([^"'\n]+)/m);
    if (match) return match[1].trim();
  }
  console.error("Missing GEMINI_API_KEY (env var or .env.local).");
  process.exit(1);
}

const MIME_BY_EXT = { ".png": "image/png", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".webp": "image/webp" };

function imagePart(filePath) {
  const mime = MIME_BY_EXT[extname(filePath).toLowerCase()];
  if (!mime) throw new Error(`Unsupported image type: ${filePath}`);
  const data = readFileSync(filePath);
  // Guard against truncated outputs from an interrupted previous run
  if (!data.length) throw new Error(`Empty image file: ${filePath}`);
  return { inline_data: { mime_type: mime, data: data.toString("base64") } };
}

/** Finds {n}{suffix}.* in source dirs, case-insensitive; back accepts t or b */
function findProductPhoto(num, kind) {
  const suffixes = kind === "front" ? ["f"] : ["t", "b"];
  for (const dir of SOURCE_DIRS) {
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir);
    for (const suffix of suffixes) {
      const re = new RegExp(`^${num}${suffix}\\.(png|jpe?g|webp)$`, "i");
      const hit = files.find((f) => re.test(f));
      if (hit) return join(dir, hit);
    }
  }
  return null;
}

async function generateImage(apiKey, parts, label) {
  const body = JSON.stringify({
    contents: [{ parts }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "3:4" } },
  });

  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body,
    });

    if (res.status === 429 || res.status >= 500) {
      await res.body?.cancel();
      const wait = attempt * 15_000;
      console.warn(`  [${label}] HTTP ${res.status}, retrying in ${wait / 1000}s (attempt ${attempt}/3)...`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(`[${label}] API error ${res.status}: ${JSON.stringify(data.error ?? data)}`);

    const responseParts = data.candidates?.[0]?.content?.parts ?? [];
    const image = responseParts.find((p) => p.inlineData?.data ?? p.inline_data?.data);
    if (!image) {
      const text = responseParts.find((p) => p.text)?.text ?? JSON.stringify(data).slice(0, 500);
      throw new Error(`[${label}] No image in response. Model said: ${text}`);
    }
    return Buffer.from(image.inlineData?.data ?? image.inline_data.data, "base64");
  }
  throw new Error(`[${label}] Failed after 3 attempts (rate limit or server errors).`);
}

async function processProduct(apiKey, num, persona, { force, frontOnly }) {
  const frontSrc = findProductPhoto(num, "front");
  if (!frontSrc) {
    console.error(`[${num}] No front photo (${num}f.*) found in photoproducts — skipping.`);
    return { generated: 0, failed: 1 };
  }

  let generated = 0;
  let failed = 0;
  const frontOut = join(OUTPUT_DIR, `${num}f.png`);

  if (existsSync(frontOut) && !force) {
    console.log(`[${num}] front already exists — skipping (use --force to regenerate).`);
  } else {
    const cellphoneSource = frontSrc.includes("photocelular");
    console.log(`[${num}] generating front (persona: ${persona}${cellphoneSource ? ", cellphone source" : ""})...`);
    try {
      const img = await generateImage(apiKey, [imagePart(frontSrc), { text: frontPrompt(persona, { cellphoneSource }) }], `${num}f`);
      writeFileSync(frontOut, img);
      console.log(`[${num}] front saved -> photos/photomodel/${num}f.png`);
      generated++;
    } catch (err) {
      console.error(`[${num}] front FAILED: ${err.message}`);
      return { generated, failed: failed + 1 };
    }
  }

  if (frontOnly) return { generated, failed };

  const backSrc = findProductPhoto(num, "back");
  if (!backSrc) {
    console.warn(`[${num}] No back photo (${num}t.* / ${num}b.*) — front only.`);
    return { generated, failed };
  }

  const backOut = join(OUTPUT_DIR, `${num}t.png`);
  if (existsSync(backOut) && !force) {
    console.log(`[${num}] back already exists — skipping.`);
    return { generated, failed };
  }

  console.log(`[${num}] generating back (front result + real back photo)...`);
  try {
    const backPrompt = backSrc.includes("photocelular")
      ? `${BACK_PROMPT}\n\nNote: the second image is a casual cellphone photo (hanger, wrinkles, bad lighting). Use it only to read the back construction and details; render the garment clean and steamed under the studio conditions of the first image.`
      : BACK_PROMPT;
    const img = await generateImage(apiKey, [imagePart(frontOut), imagePart(backSrc), { text: backPrompt }], `${num}t`);
    writeFileSync(backOut, img);
    console.log(`[${num}] back saved -> photos/photomodel/${num}t.png`);
    generated++;
  } catch (err) {
    console.error(`[${num}] back FAILED: ${err.message}`);
    failed++;
  }

  return { generated, failed };
}

/** Re-runs already generated outputs through a fix prompt (overwrites in place) */
async function applyFix(apiKey, num, fixPrompt, { frontOnly, backOnly, refImage }) {
  let generated = 0;
  let failed = 0;
  const targets = [];
  if (!backOnly) targets.push(join(OUTPUT_DIR, `${num}f.png`));
  if (!frontOnly) targets.push(join(OUTPUT_DIR, `${num}t.png`));

  for (const target of targets) {
    if (!existsSync(target)) {
      console.warn(`[${num}] ${target.split("/").pop()} does not exist — nothing to fix.`);
      continue;
    }
    const label = target.split("/").pop();
    console.log(`[${num}] applying fix to ${label}...`);
    try {
      const parts = [imagePart(target)];
      if (refImage) parts.push(imagePart(refImage));
      parts.push({ text: fixPrompt });
      const img = await generateImage(apiKey, parts, label);
      writeFileSync(target, img);
      console.log(`[${num}] ${label} fixed.`);
      generated++;
    } catch (err) {
      console.error(`[${num}] ${label} fix FAILED: ${err.message}`);
      failed++;
    }
  }
  return { generated, failed };
}

// --- main ---
const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const numbers = args.filter((a) => /^\d+$/.test(a)).map(Number);
const persona = (flags.find((f) => f.startsWith("--model="))?.split("=")[1] ?? "sofia").toLowerCase();
const force = flags.includes("--force");
const frontOnly = flags.includes("--front-only");
const backOnly = flags.includes("--back-only");
const refImage = flags.find((f) => f.startsWith("--ref="))?.slice("--ref=".length) ?? null;
const customFix = flags.find((f) => f.startsWith("--fix="))?.slice("--fix=".length);
const fixFlagsUsed = [flags.includes("--fix-framing"), flags.includes("--fix-background"), Boolean(customFix)].filter(Boolean).length;
if (fixFlagsUsed > 1) {
  console.error("Use only one fix flag at a time: --fix-framing, --fix-background, or --fix=...");
  process.exit(1);
}
const fixPrompt = flags.includes("--fix-framing")
  ? FIX_FRAMING_PROMPT
  : flags.includes("--fix-background")
    ? FIX_BACKGROUND_PROMPT
    : customFix
      ? `Regenerate the same photo with this fix: ${customFix}. Keep everything else identical: same model, same garment with every detail, same beige background (#f0ece4), same lighting, same framing, same 3:4 ratio.`
      : null;

if (!numbers.length) {
  console.error("Usage: node scripts/generate-photos.mjs <product numbers...> [--model=sofia|valentina|luna] [--force] [--front-only]");
  process.exit(1);
}
if (!PERSONAS[persona]) {
  console.error(`Unknown persona "${persona}". Options: ${Object.keys(PERSONAS).join(", ")}`);
  process.exit(1);
}

const apiKey = loadApiKey();
mkdirSync(OUTPUT_DIR, { recursive: true });

let totalGenerated = 0;
let totalFailed = 0;
for (const num of numbers) {
  const { generated, failed } = fixPrompt
    ? await applyFix(apiKey, num, fixPrompt, { frontOnly, backOnly, refImage })
    : await processProduct(apiKey, num, persona, { force, frontOnly });
  totalGenerated += generated;
  totalFailed += failed;
}

console.log(`\nDone. ${totalGenerated} image(s) generated (~USD ${(totalGenerated * 0.04).toFixed(2)}), ${totalFailed} failure(s).`);
