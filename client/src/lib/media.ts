const SERVER_URL = "http://localhost:5000";

export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "/placeholder-user.jpg";
  if (path.startsWith("http")) return path;

  // Ensure we don't have double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SERVER_URL}${cleanPath}`;
};
