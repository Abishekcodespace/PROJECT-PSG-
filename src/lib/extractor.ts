import { ExtractedPageContent, ExtractedSegment, PageSection } from '../types/audit';

/**
 * Normalizes text by removing redundant whitespace and standardizing punctuation.
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .trim();
}

/**
 * Detects whether a DOM container represents a specific section hierarchy.
 */
function classifySection(
  tag: string,
  ancestorClassNames: string,
  ancestorIds: string,
  order: number,
  totalEstimate: number
): PageSection {
  const context = `${ancestorClassNames} ${ancestorIds}`.toLowerCase();

  if (context.includes('footer') || tag === 'footer') {
    return 'footer';
  }
  if (context.includes('faq') || context.includes('frequently-asked') || context.includes('accordion') || context.includes('questions')) {
    return 'faq';
  }
  if (context.includes('pricing') || context.includes('plans') || context.includes('subscription') || context.includes('tier') || context.includes('billing')) {
    return 'pricing';
  }
  if (context.includes('hero') || context.includes('banner') || context.includes('headline') || tag === 'header' || (order <= 3 && order < totalEstimate * 0.2)) {
    return 'hero';
  }
  if (context.includes('feature') || context.includes('benefit') || context.includes('capabilities') || context.includes('service') || context.includes('why-us')) {
    return 'features';
  }
  if (order < totalEstimate * 0.35) {
    return 'above-the-fold';
  }
  return 'body';
}

/**
 * Extracts visible structured content from an HTML snapshot string.
 * Works seamlessly in Node.js (via cheerio or regex/DOM) and browser (DOMParser).
 */
export function extractLandingPageContent(
  htmlContent: string,
  url = 'https://example.com'
): ExtractedPageContent {
  const limitations: string[] = [];
  const segments: ExtractedSegment[] = [];
  const ctas: { text: string; section: PageSection; tag: string }[] = [];
  const sectionCounts: Record<PageSection, number> = {
    hero: 0,
    'above-the-fold': 0,
    features: 0,
    pricing: 0,
    faq: 0,
    body: 0,
    footer: 0,
    unknown: 0,
  };

  if (!htmlContent || typeof htmlContent !== 'string' || htmlContent.trim().length === 0) {
    limitations.push('The provided HTML snapshot is empty or null.');
    return {
      url,
      title: '',
      metaDescription: '',
      segments: [],
      ctas: [],
      sectionCounts,
      rawText: '',
      extractedTextLength: 0,
      isTruncated: false,
      hasErrors: true,
      limitations,
    };
  }

  // Pre-cleanup: strip scripts, styles, svg, and comment nodes
  let cleaned = htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Extract Title
  let title = '';
  const titleMatch = cleaned.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    title = normalizeText(titleMatch[1]);
  }

  // Extract Meta Description
  let metaDescription = '';
  const metaMatch = cleaned.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                    cleaned.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  if (metaMatch) {
    metaDescription = normalizeText(metaMatch[1]);
  }

  // Parse using browser DOMParser if available, else robust tag-based recursive walk
  let rawAllText = '';

  if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Remove unwanted elements
      doc.querySelectorAll('script, style, noscript, svg, iframe').forEach((el) => el.remove());

      const walkElements: { el: Element; section: PageSection }[] = [];

      function determineElementSection(el: Element): PageSection {
        let current: Element | null = el;
        while (current && current !== doc.body) {
          const tag = current.tagName.toLowerCase();
          const className = current.className || '';
          const id = current.id || '';
          const str = `${tag} ${className} ${id}`.toLowerCase();

          if (str.includes('footer')) return 'footer';
          if (str.includes('faq') || str.includes('accordion') || str.includes('questions')) return 'faq';
          if (str.includes('pricing') || str.includes('plans') || str.includes('tier') || str.includes('billing')) return 'pricing';
          if (str.includes('hero') || str.includes('banner') || tag === 'header') return 'hero';
          if (str.includes('feature') || str.includes('benefit') || str.includes('why-us')) return 'features';
          current = current.parentElement;
        }
        return 'body';
      }

      // Collect target nodes
      const targetTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'button', 'a', 'span', 'blockquote', 'td', 'th'];
      const seenTexts = new Set<string>();
      let orderIndex = 0;

      doc.body.querySelectorAll(targetTags.join(',')).forEach((el) => {
        // Skip if el has child block elements already captured
        const hasBlockChildren = el.querySelector('h1, h2, h3, h4, h5, h6, p, li, blockquote');
        if (hasBlockChildren) return;

        const text = normalizeText(el.textContent || '');
        if (text.length < 2) return;

        // Dedup contiguous exact duplicates
        const dedupKey = `${el.tagName.toLowerCase()}:${text}`;
        if (seenTexts.has(dedupKey) && text.length > 50) return;
        seenTexts.add(dedupKey);

        const tag = el.tagName.toLowerCase();
        let section = determineElementSection(el);
        if (section === 'body' && orderIndex < 4) {
          section = 'hero';
        }

        const isHeading = /^h[1-6]$/.test(tag);
        const isCta = tag === 'button' || (tag === 'a' && (
          el.classList.contains('btn') ||
          el.classList.contains('button') ||
          el.classList.contains('cta') ||
          /get started|sign up|try free|apply|demo|buy|start|register/i.test(text)
        ));

        if (isCta && text.length < 50) {
          ctas.push({ text, section, tag });
        }

        const segment: ExtractedSegment = {
          id: `seg-${orderIndex + 1}`,
          text,
          normalizedText: text.toLowerCase(),
          tag,
          section,
          isHeading,
          isCta,
          order: orderIndex + 1,
        };

        segments.push(segment);
        sectionCounts[section] = (sectionCounts[section] || 0) + 1;
        rawAllText += ` [${section.toUpperCase()}] ${text}\n`;
        orderIndex++;
      });
    } catch (err) {
      limitations.push(`DOMParser encountered parsing warning: ${String(err)}`);
    }
  }

  // Fallback or Node-side HTML tag regex parser if segments are empty
  if (segments.length === 0) {
    const tagRegex = /<(h[1-6]|p|li|button|a|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
    let match: RegExpExecArray | null;
    let orderIndex = 0;
    const seenTexts = new Set<string>();

    while ((match = tagRegex.exec(cleaned)) !== null) {
      const tag = match[1].toLowerCase();
      const innerHtml = match[2];
      const stripped = normalizeText(innerHtml.replace(/<[^>]+>/g, ' '));

      if (stripped.length < 2) continue;

      const dedupKey = `${tag}:${stripped}`;
      if (seenTexts.has(dedupKey) && stripped.length > 40) continue;
      seenTexts.add(dedupKey);

      // Section classification heuristic based on tag and surroundings
      const preceding = cleaned.substring(Math.max(0, match.index - 350), match.index).toLowerCase();
      let section: PageSection = 'body';

      if (preceding.includes('footer') || tag === 'footer') {
        section = 'footer';
      } else if (preceding.includes('faq') || preceding.includes('accordion') || preceding.includes('question')) {
        section = 'faq';
      } else if (preceding.includes('pricing') || preceding.includes('plan') || preceding.includes('tier') || preceding.includes('rate')) {
        section = 'pricing';
      } else if (orderIndex <= 3 || preceding.includes('hero') || preceding.includes('header') || tag === 'h1') {
        section = 'hero';
      } else if (preceding.includes('feature') || preceding.includes('benefit')) {
        section = 'features';
      } else if (orderIndex <= 7) {
        section = 'above-the-fold';
      }

      const isHeading = /^h[1-6]$/.test(tag);
      const isCta = tag === 'button' || (tag === 'a' && /btn|cta|button|primary/i.test(match[0])) ||
                    /get started|sign up|try free|apply|demo|buy|start|register/i.test(stripped);

      if (isCta && stripped.length < 50) {
        ctas.push({ text: stripped, section, tag });
      }

      const segment: ExtractedSegment = {
        id: `seg-${orderIndex + 1}`,
        text: stripped,
        normalizedText: stripped.toLowerCase(),
        tag,
        section,
        isHeading,
        isCta,
        order: orderIndex + 1,
      };

      segments.push(segment);
      sectionCounts[section] = (sectionCounts[section] || 0) + 1;
      rawAllText += ` [${section.toUpperCase()}] ${stripped}\n`;
      orderIndex++;
    }
  }

  // Check extraction completeness
  if (segments.length === 0) {
    // If no HTML tags matched, maybe plain text was passed
    const plainLines = cleaned.split(/\r?\n/).map((l) => normalizeText(l)).filter((l) => l.length > 2);
    if (plainLines.length > 0) {
      plainLines.forEach((line, idx) => {
        const section: PageSection = idx === 0 ? 'hero' : 'body';
        segments.push({
          id: `seg-${idx + 1}`,
          text: line,
          normalizedText: line.toLowerCase(),
          tag: 'p',
          section,
          isHeading: idx === 0,
          isCta: false,
          order: idx + 1,
        });
        sectionCounts[section] = (sectionCounts[section] || 0) + 1;
        rawAllText += ` [${section.toUpperCase()}] ${line}\n`;
      });
      limitations.push('HTML tags were absent; structured line extraction fallback was applied.');
    } else {
      limitations.push('Unable to extract any visible text content from the provided snapshot.');
    }
  }

  if (segments.length > 0 && segments.length < 3) {
    limitations.push('Extracted content has very few text segments. Extraction may be partial or incomplete.');
  }

  const extractedTextLength = rawAllText.length;
  const isTruncated = htmlContent.length > 300000;

  if (isTruncated) {
    limitations.push('Snapshot exceeds 300KB and was processed with length boundaries.');
  }

  return {
    url,
    title,
    metaDescription,
    segments,
    ctas,
    sectionCounts,
    rawText: rawAllText.trim(),
    extractedTextLength,
    isTruncated,
    hasErrors: segments.length === 0,
    limitations,
  };
}
