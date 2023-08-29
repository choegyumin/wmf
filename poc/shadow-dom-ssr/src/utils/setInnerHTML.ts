/** @see {@link https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md} */
export default function setInnerHTML(el: ParentNode, html: string): void {
  const fragment = new DOMParser().parseFromString(`<pre>${html}</pre>`, 'text/html', { includeShadowRoots: true });
  (el instanceof HTMLTemplateElement ? el.content : el).replaceChildren(
    ...(fragment.body.firstChild?.childNodes ?? []),
  );
}
