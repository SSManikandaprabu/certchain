/* eslint-disable @typescript-eslint/no-explicit-any */
// Client-side PDF text extraction and canvas rendering engine

export interface ExtractedCertificate {
  studentName: string;
  courseTitle: string;
  institution: string;
  issueDate: string;
  credentialId: string;
  sha256Hash: string;
  merkleRoot: string;
  blockNumber: string;
  thumbnailUrl?: string;
  pdfUrl?: string;
  rawText: string;
  isExtracted: boolean;
}

// Ensure PDF.js is loaded in the browser
export async function getPdfJs(): Promise<any> {
  if (typeof window === "undefined") return null;

  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }

  // Load from CDN
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("pdfjs-script");
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).pdfjsLib));
      return;
    }

    const script = document.createElement("script");
    script.id = "pdfjs-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(lib);
      } else {
        reject(new Error("PDF.js failed to load"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load PDF.js script"));
    document.head.appendChild(script);
  });
}

// Compute genuine SHA-256 hash using native Web Crypto
export async function computeSha256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Clean and extract readable string lines from PDF text items
interface TextLine {
  text: string;
  fontSize: number;
  y: number;
  x: number;
}

// Client-side Optical Character Recognition (OCR) for scanned image certificates
async function performClientOcr(canvas: HTMLCanvasElement): Promise<string> {
  if (typeof window === "undefined") return "";
  try {
    if (!(window as any).Tesseract) {
      await new Promise((resolve, reject) => {
        const existing = document.getElementById("tesseract-script");
        if (existing) {
          existing.addEventListener("load", () => resolve(true));
          return;
        }
        const script = document.createElement("script");
        script.id = "tesseract-script";
        script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    if ((window as any).Tesseract) {
      const worker = await (window as any).Tesseract.createWorker("eng");
      const ret = await worker.recognize(canvas);
      await worker.terminate();
      return ret?.data?.text || "";
    }
  } catch (ocrErr) {
    console.warn("Client-side OCR warning:", ocrErr);
  }
  return "";
}

export async function extractCertificateData(
  file: File
): Promise<ExtractedCertificate> {
  const buffer = await file.arrayBuffer();
  const sha256 = await computeSha256(buffer);
  const pdfUrl = URL.createObjectURL(file);

  const cleanFileName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  const rawLines: TextLine[] = [];
  let fullRawText = "";
  let thumbnailUrl: string | undefined = undefined;
  let renderedCanvas: HTMLCanvasElement | null = null;

  try {
    const pdfjs = await getPdfJs();
    if (pdfjs) {
      const loadingTask = pdfjs.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      // Render thumbnail canvas
      try {
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
          thumbnailUrl = canvas.toDataURL("image/png");
          renderedCanvas = canvas;
        }
      } catch (renderErr) {
        console.warn("PDF page render warning:", renderErr);
      }

      // Extract text content
      const textContent = await page.getTextContent();
      const items = textContent.items as any[];

      // Group text items by roughly identical Y coordinate to form logical lines
      const lineMap = new Map<number, { text: string; fontSize: number; x: number }[]>();

      for (const item of items) {
        if (!item.str || !item.str.trim()) continue;
        const y = Math.round(item.transform[5]);
        const x = Math.round(item.transform[4]);
        const fontSize = Math.round(Math.abs(item.transform[0] || item.height || 12));

        let foundY = y;
        const currentKeys = Array.from(lineMap.keys());
        for (const existingY of currentKeys) {
          if (Math.abs(existingY - y) <= 4) {
            foundY = existingY;
            break;
          }
        }

        if (!lineMap.has(foundY)) {
          lineMap.set(foundY, []);
        }
        lineMap.get(foundY)!.push({ text: item.str, fontSize, x });
      }

      // Sort lines top to bottom (higher Y in PDF coordinate space is higher up on page)
      const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

      for (const y of sortedYs) {
        const lineItems = lineMap.get(y)!.sort((a, b) => a.x - b.x);
        const lineText = lineItems.map((i) => i.text.trim()).join(" ");
        const maxFontSize = Math.max(...lineItems.map((i) => i.fontSize));
        if (lineText.length > 0) {
          rawLines.push({
            text: lineText,
            fontSize: maxFontSize,
            y,
            x: lineItems[0].x,
          });
        }
      }

      fullRawText = rawLines.map((l) => l.text).join("\n");
    }
  } catch (err) {
    console.warn("PDF.js parsing fallback triggered:", err);
  }

  // Fallback: If raw text is empty, attempt binary ASCII extraction
  if (rawLines.length === 0) {
    try {
      const decoder = new TextDecoder("utf-8", { fatal: false });
      const rawAscii = decoder.decode(new Uint8Array(buffer).slice(0, 100000));
      const asciiRegex = /\(([^()]{2,60})\)\s*Tj/g;
      let m: RegExpExecArray | null;
      while ((m = asciiRegex.exec(rawAscii)) !== null) {
        const clean = m[1].replace(/\\([()\\])/g, "$1").trim();
        if (clean.length > 2) {
          rawLines.push({
            text: clean,
            fontSize: 14,
            y: 0,
            x: 0,
          });
        }
      }
      fullRawText = rawLines.map((l) => l.text).join("\n");
    } catch {
      // Ignored
    }
  }

  // Fallback 2: If still empty and a canvas was rendered, run client-side Tesseract OCR
  if (rawLines.length === 0 && renderedCanvas) {
    try {
      const ocrText = await performClientOcr(renderedCanvas);
      if (ocrText && ocrText.trim()) {
        const lines = ocrText
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 2);
        for (const l of lines) {
          rawLines.push({
            text: l,
            fontSize: 14,
            y: 0,
            x: 0,
          });
        }
        fullRawText = ocrText;
      }
    } catch {
      // Ignored
    }
  }

  // Parse fields from structured lines
  let detectedStudent = "";
  let detectedCourse = "";
  let detectedInstitution = "";
  let detectedDate = "";
  let detectedId = "";

  const leadInRegex = /(?:this is to certify that|certifies that|is hereby awarded to|presented to|conferred upon|proudly presented to|awarded to|certify that|granted to|has successfully completed|in recognition of|student name:?|name:?)/i;

  const titleExclusions = /(certificate|completion|achievement|diploma|degree|excellence|participation|appreciation|university|college|academy|institute|program|accredited|authorized|signature|director|president|founder|date|verify|credential|id|authorized)/i;

  // 1. Try finding student name right after lead-in line
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].text.trim();
    if (leadInRegex.test(line)) {
      // Check next 1-2 lines for candidate name
      for (let j = i + 1; j <= Math.min(i + 2, rawLines.length - 1); j++) {
        const candidate = rawLines[j].text.trim();
        if (
          candidate.length >= 3 &&
          candidate.length <= 40 &&
          !titleExclusions.test(candidate) &&
          !/^[0-9\W]+$/.test(candidate)
        ) {
          detectedStudent = candidate;
          break;
        }
      }
      if (detectedStudent) break;
    }
  }

  // 2. If student not found by lead-in, look for the largest font size in middle of page
  if (!detectedStudent && rawLines.length > 0) {
    const sortedBySize = [...rawLines].sort((a, b) => b.fontSize - a.fontSize);
    for (const item of sortedBySize) {
      const txt = item.text.trim();
      if (
        txt.length >= 3 &&
        txt.length <= 36 &&
        !titleExclusions.test(txt) &&
        !/^[0-9\W]+$/.test(txt) &&
        !txt.toLowerCase().includes("web3") &&
        !txt.toLowerCase().includes("ethereum") &&
        !txt.toLowerCase().includes("blockchain")
      ) {
        detectedStudent = txt;
        break;
      }
    }
  }

  // 3. Try finding course title (look after "for completing", "course:", "degree of", "field of", or after student name)
  const courseLeadInRegex = /(?:for completing|successfully completing|completed the|course in|program in|specialization in|degree of|field of|in the subject of|titled|for:|course:?|program:?)/i;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].text.trim();
    if (courseLeadInRegex.test(line)) {
      // If course is on same line after the keyword:
      const split = line.split(courseLeadInRegex);
      if (split[1] && split[1].trim().length > 3) {
        detectedCourse = split[1].trim();
        break;
      }
      // Or on the following line:
      if (i + 1 < rawLines.length) {
        const next = rawLines[i + 1].text.trim();
        if (next.length > 3 && next.length < 80 && !titleExclusions.test(next)) {
          detectedCourse = next;
          break;
        }
      }
    }
  }

  // If not found, look for line after student name
  if (!detectedCourse && detectedStudent) {
    const studentIdx = rawLines.findIndex((l) => l.text.includes(detectedStudent));
    if (studentIdx !== -1) {
      for (let k = studentIdx + 1; k < Math.min(studentIdx + 4, rawLines.length); k++) {
        const candidate = rawLines[k].text.trim();
        if (
          candidate.length >= 5 &&
          candidate.length <= 70 &&
          !leadInRegex.test(candidate) &&
          !/(date|issued|signature|director|president|founder|grade|hours)/i.test(candidate)
        ) {
          detectedCourse = candidate;
          break;
        }
      }
    }
  }

  // 4. Try finding Institution
  const institutionKeywords = /(university|college|institute|academy|school of|google|coursera|edx|udemy|stanford|harvard|mit|iit|polytechnic|foundation|technologies|corporation|credentials office|board)/i;
  for (const item of rawLines) {
    if (institutionKeywords.test(item.text) && item.text.length < 60) {
      detectedInstitution = item.text.trim();
      break;
    }
  }

  // 5. Try finding Date
  const dateRegex = /(?:issued|date|awarded on|completed on)?\s*([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i;
  const dateMatch = fullRawText.match(dateRegex);
  if (dateMatch && dateMatch[1]) {
    detectedDate = dateMatch[1].trim();
  }

  // 6. Try finding Credential ID / Verification ID
  const idRegex = /(?:credential id|certificate id|cert id|id|verification code|serial|number|no\.?):?\s*([A-Za-z0-9_-]{5,32})/i;
  const idMatch = fullRawText.match(idRegex);
  if (idMatch && idMatch[1]) {
    detectedId = idMatch[1].trim();
  }

  // Fallbacks if extraction could not find fields
  const words = cleanFileName.split(/\s+/).filter(Boolean);
  if (!detectedStudent) {
    if (words.length >= 2 && !/^(certificate|diploma|doc|document|img|scan|untitled)$/i.test(words[0])) {
      detectedStudent = words
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    } else {
      detectedStudent = "Unidentified Candidate";
    }
  }

  if (!detectedCourse) {
    if (words.length > 2 && !/^(certificate|diploma|doc|document|img|scan|untitled)$/i.test(words[0])) {
      detectedCourse = words
        .slice(2)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    } else {
      detectedCourse = "Unspecified Course / Program";
    }
  }

  if (!detectedInstitution) {
    detectedInstitution = "Unregistered / External Issuer";
  }

  if (!detectedDate) {
    detectedDate = "No Issuance Date Found";
  }

  if (!detectedId) {
    detectedId = "Unanchored Document (No Credential ID)";
  }

  const simulatedRoot = "0x" + sha256.slice(0, 16) + "e94c8b20" + sha256.slice(24, 40) + "b7f0";
  const randomBlock = "#" + (61400000 + Math.floor(Math.random() * 50000)).toLocaleString();

  return {
    studentName: detectedStudent,
    courseTitle: detectedCourse,
    institution: detectedInstitution,
    issueDate: detectedDate,
    credentialId: detectedId,
    sha256Hash: sha256,
    merkleRoot: simulatedRoot,
    blockNumber: randomBlock,
    thumbnailUrl,
    pdfUrl,
    rawText: fullRawText,
    isExtracted: rawLines.length > 0,
  };
}
