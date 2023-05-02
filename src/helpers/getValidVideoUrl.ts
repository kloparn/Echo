export default (url) => {
  const u = new URL(url);

  return `${u.origin}${u.pathname}?${u.searchParams.get("v")}`
 }