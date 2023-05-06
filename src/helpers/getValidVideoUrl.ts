export default (url) => {
  const u = new URL(url);

  if (!u.searchParams.get("v")) return url;

  return `${u.origin}${u.pathname}?v=${u.searchParams.get("v")}`;
};
