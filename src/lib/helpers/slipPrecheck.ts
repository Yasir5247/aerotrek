import { AEROTREK_BANK_ACCOUNT_NUMBER, isPlaceholderAccount } from "@/lib/constants/bankAccount";

/**
 * Tier B preliminary slip verification via OCR (Tesseract.js).
 * Scores PASS / WARN / FAIL — never auto-confirms payment.
 */

const AMOUNT_TOLERANCE = 1; // MVR
const MIN_TEXT_LENGTH = 12;
const MIN_CONFIDENCE = 35;

function normalizeOcrText(text?: any) {
  return String(text || "")
    .replace(/\u00a0/g, " ")
    .replace(/[|,;]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDigitRuns(text?: any) {
  return (String(text).match(/\d[\d\s.-]{3,}\d/g) || []).map((run) =>
    run.replace(/\D/g, "")
  );
}

/**
 * Pull plausible money amounts from OCR text.
 * Handles: 2426.50, 2,426.50, MVR 2426, Rf 2426.5, 2426/50 (OCR typo)
 */
export function extractAmounts(text?: any) {
  const normalized = normalizeOcrText(text)
    .replace(/(\d)[/|](\d{2})\b/g, "$1.$2")
    .replace(/,/g, "");

  const matches = normalized.match(
    /(?:mvr|rf|ރ\.?|maldivian\s*rufiyaa)?\s*(\d{2,7}(?:\.\d{1,2})?)/gi
  );

  if (!matches) return [];

  const amounts: any[] = [];
  for (const raw of matches) {
    const numMatch = raw.match(/(\d{2,7}(?:\.\d{1,2})?)/);
    if (!numMatch) continue;
    const value = Number(numMatch[1]);
    if (!Number.isFinite(value) || value < 10 || value > 9999999) continue;
    amounts.push(value);
  }
  return [...new Set(amounts)];
}

export function findMatchingAmount(amounts?: any, expectedTotal?: any, tolerance: any = AMOUNT_TOLERANCE) {
  const expected = Number(expectedTotal);
  if (!Number.isFinite(expected)) return null;
  let best: any = null;
  for (const amount of amounts) {
    const diff = Math.abs(amount - expected);
    if (diff <= tolerance && (!best || diff < best.diff)) {
      best = { amount, diff };
    }
  }
  return best;
}

export function accountDigitsPresent(text?: any, accountNumber: any = AEROTREK_BANK_ACCOUNT_NUMBER) {
  if (isPlaceholderAccount(accountNumber)) {
    return { skipped: true, matched: false, needle: null };
  }

  const fullDigits = String(accountNumber).replace(/\D/g, "");
  const ocrDigits = String(text).replace(/\D/g, "");
  const needles: any[] = [];

  if (fullDigits.length >= 6) needles.push(fullDigits);
  if (fullDigits.length >= 4) needles.push(fullDigits.slice(-4));
  if (fullDigits.length >= 6) needles.push(fullDigits.slice(-6));

  const matchedNeedle = needles.find((n) => n && ocrDigits.includes(n)) || null;
  return {
    skipped: false,
    matched: Boolean(matchedNeedle),
    needle: matchedNeedle,
  };
}

function looksLikeRecentDate(text?: any) {
  const now = new Date();
  const year = now.getFullYear();
  const patterns = [
    new RegExp(`\\b${year}\\b`),
    new RegExp(`\\b${year - 1}\\b`),
    /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/,
    /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}/i,
  ];
  return patterns.some((re) => re.test(text));
}

function scorePrecheck({ text,
  confidence,
  expectedTotal,
  accountNumber = AEROTREK_BANK_ACCOUNT_NUMBER,
  isPdf = false, }: { text?: any; confidence?: any; expectedTotal?: any; accountNumber?: any; isPdf?: any }) {
  const reasons: any[] = [];
  const normalized = normalizeOcrText(text);
  const amounts = extractAmounts(normalized);
  const amountMatch = findMatchingAmount(amounts, expectedTotal);
  const account = accountDigitsPresent(normalized, accountNumber);
  const hasDateHint = looksLikeRecentDate(normalized);
  const digitRuns = extractDigitRuns(normalized);

  if (isPdf) {
    reasons.push("PDF slips skip OCR — queued for manual admin review.");
    return {
      result: "WARN",
      notes: {
        reason: "pdf_skip_ocr",
        reasons,
        expected_total: Number(expectedTotal),
        confidence: null,
        amounts_found: [],
        matched_amount: null,
        account_matched: false,
        account_check_skipped: isPlaceholderAccount(accountNumber),
        has_date_hint: false,
      },
    };
  }

  if (!normalized || normalized.length < MIN_TEXT_LENGTH) {
    reasons.push("Little or no readable text found on the slip.");
    return {
      result: "FAIL",
      notes: {
        reason: "unreadable",
        reasons,
        expected_total: Number(expectedTotal),
        confidence: confidence ?? null,
        amounts_found: amounts,
        matched_amount: null,
        account_matched: false,
        account_check_skipped: account.skipped,
        has_date_hint: false,
        text_sample: normalized.slice(0, 120),
      },
    };
  }

  if (confidence != null && confidence < MIN_CONFIDENCE) {
    reasons.push(`OCR confidence is low (${Math.round(confidence)}%).`);
  }

  if (amountMatch) {
    reasons.push(
      `Found amount ${amountMatch.amount} matching order total ${Number(expectedTotal).toFixed(2)}.`
    );
  } else {
    reasons.push(
      `Could not find order total ${Number(expectedTotal).toFixed(2)} on the slip.`
    );
  }

  if (account.skipped) {
    reasons.push("Account number check skipped (placeholder account configured).");
  } else if (account.matched) {
    reasons.push("Found AeroTrek account digits on the slip.");
  } else {
    reasons.push("Could not find AeroTrek account number on the slip.");
  }

  if (hasDateHint) {
    reasons.push("Found a date-like value on the slip.");
  } else {
    reasons.push("No clear transfer date detected.");
  }

  const accountOk = account.skipped || account.matched;
  let result = "WARN";

  if (amountMatch && accountOk && (confidence == null || confidence >= MIN_CONFIDENCE)) {
    result = "PASS";
  } else if (!amountMatch && !account.matched && !account.skipped && digitRuns.length < 1) {
    result = "FAIL";
    reasons.push("Slip does not look like a bank transfer receipt.");
  } else if (!amountMatch && confidence != null && confidence < MIN_CONFIDENCE) {
    result = "FAIL";
  }

  return {
    result,
    notes: {
      reason: result.toLowerCase(),
      reasons,
      expected_total: Number(expectedTotal),
      confidence: confidence != null ? Math.round(confidence * 10) / 10 : null,
      amounts_found: amounts.slice(0, 12),
      matched_amount: amountMatch?.amount ?? null,
      account_matched: account.matched,
      account_check_skipped: account.skipped,
      has_date_hint: hasDateHint,
      text_sample: normalized.slice(0, 180),
    },
  };
}

/**
 * Runs OCR on an image slip (or soft-WARN for PDF) and returns
 * { result: 'PASS'|'WARN'|'FAIL', notes }.
 */
export async function runSlipPrecheck(
  file?: any,
  { expectedTotal, accountNumber }: any = {}
) {
  if (!file) {
    return {
      result: "FAIL",
      notes: { reason: "missing_file", reasons: ["No transfer slip uploaded."] },
    };
  }

  const isPdf =
    file.type === "application/pdf" || /\.pdf$/i.test(file.name || "");

  if (isPdf) {
    return scorePrecheck({
      text: "",
      confidence: null,
      expectedTotal,
      accountNumber,
      isPdf: true,
    });
  }

  if (!file.type || !file.type.startsWith("image/")) {
    return {
      result: "FAIL",
      notes: {
        reason: "unsupported_type",
        reasons: ["Unsupported file type. Please upload an image or PDF."],
      },
    };
  }

  // Dynamic import keeps the OCR worker out of the initial bundle.
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");

  try {
    const {
      data: { text, confidence },
    } = await worker.recognize(file);

    return scorePrecheck({
      text,
      confidence,
      expectedTotal,
      accountNumber,
      isPdf: false,
    });
  } finally {
    await worker.terminate();
  }
}

export function precheckUserMessage(result?: any) {
  if (result === "PASS") {
    return "Automatic checks look good. Our team will still confirm your payment shortly.";
  }
  if (result === "WARN") {
    return "We received your slip, but automatic checks were incomplete. Our team will review it manually.";
  }
  return "We could not clearly read this slip. You can still place the order — our team will verify it manually.";
}
