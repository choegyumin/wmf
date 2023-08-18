interface DOMParserOptions {
  /**
   * @see {@link https://developer.chrome.com/articles/declarative-shadow-dom/}
   * @see {@link https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md#mitigation}
   */
  includeShadowRoots: boolean;
}

interface DOMParser {
  parseFromString(string: string, type: DOMParserSupportedType, options: DOMParserOptions): Document;
}
