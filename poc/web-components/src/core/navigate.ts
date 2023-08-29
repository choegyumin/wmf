export default function navigate(url: string, replace: boolean = false) {
  const shouldReplace = replace || url === location.pathname;
  window.history[shouldReplace ? 'replaceState' : 'pushState'](null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
