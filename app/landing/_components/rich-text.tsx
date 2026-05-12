/**
 * Render i18n strings that contain HTML markup.
 * Replaces legacy `class="g-blue"` with Tailwind `text-gradient-blue`.
 */
export function renderRichText(html: string) {
  const fixed = html
    .replace(/class="g-blue"/g, 'class="text-gradient-blue"')
    .replace(/class="g-indigo"/g, 'class="text-gradient-indigo"')
    .replace(/class="g-shimmer"/g, 'class="text-gradient-shimmer"');
  return { __html: fixed };
}

/**
 * Small helper component for rendering potentially-safe HTML strings.
 * Use ONLY with i18n translation strings (not user input).
 */
export function SafeHtml({ html, tag: Tag = "span" }: { html: string; tag?: "span" | "h2" | "h1" | "p" | "div" }) {
  return <Tag dangerouslySetInnerHTML={renderRichText(html)} />;
}
