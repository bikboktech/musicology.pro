import axios from "./axios";

const downloadPlaylist = async (spotifyLink: string) => {
  const response = (await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlist-management/download`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistLink: spotifyLink }),
    }
  )) as Response;

  const contentDisposition = response.headers.get("Content-Disposition");

  const filenameMatch =
    contentDisposition && contentDisposition.match(/filename="(.+)"/);
  const filename = filenameMatch ? filenameMatch[1] : "playlist.zip";

  const blob = await response.blob();

  const downloadUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a") as HTMLAnchorElement;
  link.href = downloadUrl;
  link.setAttribute("download", filename);

  document.body.appendChild(link);

  link.click();

  link.parentNode?.removeChild(link);
};

export default downloadPlaylist;
