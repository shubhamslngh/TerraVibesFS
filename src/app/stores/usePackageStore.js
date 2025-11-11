
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { fetchPackages } from "@/lib/search";
import { getGuides, getMoods, patchPackage } from "@/services/api";

const normalizeArray = (arr) =>
    (arr || [])
        .map((item) => {
            if (!item) return null;
            if (typeof item === "number") return { id: item };
            if (typeof item === "string")
                return { id: parseInt(item, 10), name: item };
            return {
                ...item,
                id: parseInt(item.id, 10),
                name: item.name || item.title || "",
            };
        })
        .filter(Boolean)
        .filter(
            (v, i, self) => i === self.findIndex((x) => x.id === v.id && v.id != null)
        );

const normalizePackage = (pkg) => ({
    id: Number(pkg.id),
    title: pkg.title || "",
    description: pkg.description || "",
    price: Number(pkg.price || 0),
    services: pkg.services || [],
    images: normalizeArray(pkg.images),
    guides: normalizeArray(pkg.guides),
    moods: normalizeArray(pkg.moods),
    is_active: pkg.is_active ?? true,
});

const usePackageStore = create(
   
    devtools((set, get) => ({
        packages: [],
        guides: [],
        moods: [],
        loading: false,
        snackbar: { open: false, message: "", type: "info" },

        loadPackages: async (filters = {}, force = false) => {
            const { packages } = get();

            // ⚡ Skip guard if force refresh requested
            if (packages.length && !force) return;

            set({ loading: true });
            try {
                const pkgs = await fetchPackages(filters);
                const normalized = pkgs.map(normalizePackage);
                set({ packages: normalized });
            } catch (err) {
                console.error("❌ Failed to load packages", err);
                get().showSnackbar("Failed to load packages", "error");
            } finally {
                set({ loading: false });
            }
        },

        updatePackage: async (id, payload) => {
            try {
                const res = await patchPackage(id, payload);
                const normalized = normalizePackage(res.data);
                set((state) => ({
                    packages: state.packages.map((p) =>
                        p.id === normalized.id ? normalized : p
                    ),
                }));
                get().showSnackbar("Package updated ✅", "success");
                return normalized;
            } catch (err) {
                console.error("❌ Failed to update package", err);
                get().showSnackbar("Failed to update package", "error");
                throw err;
            }
        },

        loadGuides: async (force = false) => {
            const { guides } = get();
            if (guides.length > 0 && !force) return;
            try {
                const res = await getGuides();
                const data = Array.isArray(res) ? res : res?.results || res?.data || [];
                set({ guides: normalizeArray(data) });
            } catch (err) {
                console.error("❌ Failed to load guides", err);
                get().showSnackbar("Failed to load guides", "error");
            }
        },

        loadMoods: async (force = false) => {
            const { moods } = get();
            if (moods.length > 0 && !force) return;
            try {
                const res = await getMoods();
                const data = Array.isArray(res) ? res : res?.results || res?.data || [];
                set({ moods: normalizeArray(data) });
            } catch (err) {
                console.error("❌ Failed to load moods", err);
                get().showSnackbar("Failed to load moods", "error");
            }
        },

        showSnackbar: (message, type = "info") =>
            set({ snackbar: { open: true, message, type } }),
        closeSnackbar: () =>
            set({ snackbar: { open: false, message: "", type: "info" } }),
    }))
);

export default usePackageStore;
