export default (url) => {
  const u = new URL(url);

  return `${u.origin}${u.pathname}?v=${u.searchParams.get("v")}`
 }