"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Trash2, Save, Loader2 } from "lucide-react";
import GalleryPicker from "@/components/Gallery/GalleryPicker";
import usePackageStore from "@/stores/usePackageStore";

export default function PackageDetailsModal({ pkg, onClose }) {
  const [form, setForm] = useState(pkg);
  const [activeTab, setActiveTab] = useState("details");

  const {
    guides,
    moods,
    loading,
    loadGuides,
    loadMoods,
    updatePackage,
    showSnackbar,
  } = usePackageStore();

  /** Fetch guides + moods once */
  useEffect(() => {
    loadGuides();
    loadMoods();
  }, []);

  /** 💾 Save core details */
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: form.price,
        guide_ids: form.guides?.map((g) => g.id),
        mood_ids: form.moods?.map((m) => m.id),
      };

      const updated = await updatePackage(pkg.id, payload); // ✅ use from store
      setForm(updated);
      showSnackbar("Package updated successfully!", "success");
      onClose();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update package details", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAttachImages = async (selectedImages) => {
    try {
      const payload = { image_ids: selectedImages.map((img) => img.id) };
      const updated = await updatePackage(pkg.id, payload); // ✅ use store
      setForm(updated);
      showSnackbar("Images updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to attach selected images", "error");
    }
  };

  /** 🗑 Remove image */
  const handleRemoveImage = async (imgId) => {
    if (!confirm("Remove this image?")) return;
    try {
      const remainingIds = (form.images || [])
        .filter((img) => img.id !== imgId)
        .map((img) => img.id);
      const updated = await updatePackage(pkg.id, { image_ids: remainingIds });
      setForm(updated);
    } catch {
      showSnackbar("Failed to remove image", "error");
    }
  };

  /** 🧑‍💼 Toggle guide */
  const handleToggleGuide = async (guide) => {
    const existing = form.guides || [];
    const selected = existing.some((g) => g.id == guide.id);
    const updatedGuides = selected
      ? existing.filter((g) => g.id !== guide.id)
      : [...existing, guide];
    setForm({ ...form, guides: updatedGuides });
    await updatePackage(pkg.id, { guide_ids: updatedGuides.map((g) => g.id) });
  };

  /** 🎭 Toggle mood */
  const handleToggleMood = async (mood) => {
    const existing = form.moods || [];
    const selected = existing.some((m) => Number(m.id) === Number(mood.id)); // 👈 normalize here
    const updatedMoods = selected
      ? existing.filter((m) => Number(m.id) !== Number(mood.id))
      : [...existing, { ...mood, id: Number(mood.id) }]; // ensure stored as number

    setForm({ ...form, moods: updatedMoods });
    await updatePackage(pkg.id, {
      mood_ids: updatedMoods.map((m) => Number(m.id)),
    });
  };

  return (
    <Dialog open={!!pkg} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            ✏️ Edit Package — {form.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <TabsTrigger value="details">🧾 Details</TabsTrigger>
            <TabsTrigger value="images">🖼 Images</TabsTrigger>
            <TabsTrigger value="guides">🧑‍💼 Guides</TabsTrigger>
            <TabsTrigger value="moods">🎭 Moods</TabsTrigger>
          </TabsList>

          {/* DETAILS TAB */}
          <TabsContent value="details" className="space-y-3">
            <input
              className="w-full border rounded-md p-2"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
            />
            <input
              className="w-full border rounded-md p-2"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price"
              type="number"
            />
            <textarea
              className="w-full border rounded-md p-2"
              rows={3}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
            />
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {loading ? "Saving..." : "Save Details"}
            </Button>
          </TabsContent>

          {/* IMAGES TAB */}
          <TabsContent value="images" className="space-y-4 ">
            <h3 className="text-sm font-semibold">Attach or Manage Images</h3>
            <GalleryPicker
              preselected={form.images?.map((img) => img.id) || []}
              onSelect={handleAttachImages}
            />
            <div className="mt-4 flex flex-wrap gap-3 border-t pt-3">
              {(form.images || []).length > 0 ? (
                form.images.map((img) => (
                  <div
                    key={img.id || img.src}
                    className="relative group w-20 h-20 border rounded-lg overflow-hidden">
                    <img
                      src={
                        img?.src?.startsWith("http")
                          ? img.src // ✅ already a full URL
                          : `${process.env.NEXT_PUBLIC_API_URL}/media/${img.src}` // ✅ relative file path
                      }
                      alt={img?.title || "Image"}
                      className="w-full h-full object-cover"
                    />

                    <button
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
                      onClick={() => handleRemoveImage(img.id)}>
                      <Trash2
                        size={18}
                        className="text-white hover:text-red-400 transition"
                      />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No images yet.</p>
              )}
            </div>
          </TabsContent>

          {/* GUIDES TAB */}
          <TabsContent value="guides" className="space-y-4">
            <h3 className="text-sm font-semibold mb-2">Assign Guides</h3>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-orange-600" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {guides.map((guide) => {
                  const selected = form.guides?.some((g) => g.id === guide.id);
                  return (
                    <div
                      key={guide.id}
                      onClick={() => handleToggleGuide(guide)}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selected
                          ? "bg-orange-600 text-white shadow-md"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}>
                      <div className="flex items-center gap-2">
                        <img
                          src={guide.photo}
                          alt={guide.name}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-medium">{guide.name}</p>
                          <p className="text-xs opacity-80">
                            {guide.expertise}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs italic opacity-70">
                        {guide.bio}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* MOODS TAB */}
          <TabsContent value="moods" className="space-y-4">
            <h3 className="text-sm font-semibold">Select Package Moods</h3>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => {
                const selected = form.moods?.some((m) => m.id === mood.id);
                return (
                  <Button
                    key={mood.id}
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    className={`rounded-full ${
                      selected
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleToggleMood(mood)}>
                    {mood.icon || "🎭"} {mood.name}
                  </Button>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
