// export type Post = {
//   id: number;
//   title: string;
//   thumbnailUrl: string;
//   createdAt: string;
//   categories: string[];
//   content: string;
// }

export type MicroCMSPost = {
  id: string
  title: string
  content: string
  createdAt: string
  categories: { id: string; name: string }[]
  thumbnail: { url: string; height: number; width: number }
}
