export function createPageUrl(pageName) {
  return `/${pageName.toLowerCase().replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`;
}
