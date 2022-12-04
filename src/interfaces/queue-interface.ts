export default interface QueueObject {
  type: "video" | "playlist";
  title?: string | string[];
  link: URL | URL[];
  userId: string;
}
