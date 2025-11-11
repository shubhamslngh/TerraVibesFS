"use client";

import { useEffect, useState } from "react";
import { Upload, Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import usePackageStore from "@/stores/usePackageStore";

export default function GalleryPicker({
  packageId,
  onSelect,
  preselected = [],
}) {
  const [gallery, setGallery] = useState([]);
  const [selectedIds, setSelectedIds] = useState(preselected);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { setPackageImages } = usePackageStore();

  // 🔹 Fetch gallery
  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get("content/?content_type=gallery");
      setGallery(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  // 🔹 Handle file upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("content_type", "gallery");
    formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
    formData.append("body", "Uploaded via AI Gallery Picker");
    formData.append("src", file);

    try {
      const res = await api.post("content/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGallery((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("⚠️ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Toggle selection
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✏️ Edit image
  const handleEdit = (img) => {
    const newTitle = prompt("Edit title:", img.title);
    if (newTitle === null) return; // cancelled
    const newBody = prompt("Edit body:", img.body || "");
    const newSlug = prompt("Edit slug:", img.slug || "");
    api
      .patch(`content/${img.id}/`, {
        title: newTitle,
        body: newBody,
        slug: newSlug,
      })
      .then(() => loadGallery())
      .catch(() => alert("⚠️ Failed to update image"));
  };

  // 🗑️ Delete image
  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api.delete(`content/${id}/`);
      setGallery((prev) => prev.filter((img) => img.id !== id));
    } catch {
      alert("⚠️ Failed to delete image");
    }
  };

  // 🔹 Confirm selection and sync
  const handleConfirm = () => {
    const selectedImages = gallery
      .filter((img) => selectedIds.includes(img.id))
      .map((img) => ({
        id: img.id,
        title: img.title,
        body: img.body,
        src: img.src.replace("http://127.0.0.1:8000/media/", "uploads/"),
      }));

    if (onSelect) onSelect(selectedImages);
    if (packageId) setPackageImages(packageId, selectedImages);
  };

  // 💅 UI same layout
  return (
    <div className="space-y-3">
      {/* Upload Controls */}
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 cursor-pointer text-orange-600 font-semibold">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload New"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={loadGallery}
          disabled={loading}>
          🔄 Refresh
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="max-h-72 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2">
        {loading ? (
          <p className="text-sm text-gray-400 col-span-3">Loading gallery...</p>
        ) : gallery.length ? (
          gallery.map((img) => {
            const selected = selectedIds.includes(img.id);
            return (
              <div
                key={img.id}
                className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all group ${
                  selected
                    ? "ring-2 ring-orange-500 scale-[1.02]"
                    : "hover:ring-2 hover:ring-gray-300"
                }`}
                onClick={() => toggleSelect(img.id)}>
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-24 object-cover"
                />
                {/* Overlay for actions */}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-white/80 hover:bg-orange-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(img);
                    }}>
                    <Pencil size={14} className="text-orange-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-white/80 hover:bg-red-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.id);
                    }}>
                    <Trash2 size={14} className="text-red-600" />
                  </Button>
                </div>

                {selected && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Check className="text-white" size={22} />
                  </div>
                )}
                <p className="absolute bottom-0 bg-black/50 text-white text-xs px-1 truncate w-full">
                  {img.title}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm col-span-3">
            No images available.
          </p>
        )}
      </div>

      {/* Confirm Selection */}
      <div className="flex justify-end">
        <Button onClick={handleConfirm} disabled={!selectedIds.length}>
          📎 Attach {selectedIds.length} Image
          {selectedIds.length > 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
}
