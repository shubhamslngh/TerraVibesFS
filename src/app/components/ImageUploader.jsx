import { uploadGalleryImage, updatePackage } from "@/services/api";

async function handleImageUpload(file, packageId) {
  const formData = new FormData();
  formData.append("content_type", "gallery");
  formData.append("title", file.name);
  formData.append("body", "Uploaded via AI bot");
  formData.append("src", file);

  const res = await uploadGalleryImage(formData);
  const media = res.data;

  // Once uploaded, link to the EventPackage
  const imageData = {
    src: media.src.replace("http://127.0.0.1:8000/media/", "uploads/"),
    title: media.title,
    body: media.body,
  };

  await updatePackage(packageId, {
    images: [imageData],
  });

  return media.src;
}
