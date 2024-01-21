import { getPresignedPost } from "@/actions/helpers/image";

export async function uploadFile(file: File, folderPath: string) {
  const { url, fields, id } = await getPresignedPost({
    folderPath,
    contentType: file.type,
  });

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", file);

  const uploadResponse = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (uploadResponse.ok) {
    return url + [folderPath, id].filter(Boolean).join("/");
  } else {
    throw new Error("File upload failed.");
  }
}
