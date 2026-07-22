import sanitizeHtml from "sanitize-html";

/**
 * Converts the title into safe plain text.
 * HTML tags and control whitespace are removed.
 */
export const sanitizeNoteTitle = (title: string): string => {
  return sanitizeHtml(title, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Sanitizes rich-text HTML before it is stored.
 *
 * Dangerous elements such as script, iframe, object,
 * embedded media, inline styles, event handlers and
 * javascript URLs are not allowed.
 */
export const sanitizeNoteContent = (content: string): string => {
  return sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "mark",
      "blockquote",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "hr",
      "pre",
      "code",
      "a",
    ],

    allowedAttributes: {
      a: ["href"],
    },

    allowedSchemes: ["http", "https", "mailto"],

    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
  }).trim();
};

/**
 * Rich-text editors can submit visually empty HTML such as:
 * <p><br></p>
 *
 * This check confirms that meaningful text remains after
 * all HTML tags are removed.
 */
export const hasMeaningfulNoteContent = (content: string): boolean => {
  const plainText = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .trim();

  return plainText.length > 0;
};
