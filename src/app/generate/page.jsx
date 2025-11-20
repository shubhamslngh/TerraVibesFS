"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  Edit,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import api from "@/services/api";
import PackageDetailsModal from "@/components/modals/PackageDetailsModal";
import usePackageStore from "@/stores/usePackageStore";

export default function GeneratePackageChat() {
  const { packages, loadPackages, updatePackage, loading } = usePackageStore();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I can help you design or edit a travel package.",
    },
  ]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [jsonDraft, setJsonDraft] = useState(null);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const bottomRef = useRef(null);
  const [sending, setSending] = useState(false);

  const scrollToBottom = () =>
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );

  /** ✏️ Add assistant message */
  const appendAssistantMessage = (text) =>
    setMessages((prev) => [...prev, { role: "assistant", content: text }]);

  /** 💬 Send chat prompt to AI backend */
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", content: input };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setInput("");
    setSending(true);

    try {
      const res = await api.post("generate-package/", { messages: updated });
      const data = res.data;

      if (data.mode === "chat") {
        appendAssistantMessage(data.reply);
      } else if (data.mode === "json") {
        setJsonDraft(data.data);
        appendAssistantMessage(
          "🧳 Here's the package I designed! Review below 👇"
        );
      }
    } catch (err) {
      console.error(err);
      appendAssistantMessage("⚠️ Something went wrong. Try again later.");
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  /** ✅ Confirm new package creation */
  const confirmPackage = async () => {
    if (!jsonDraft) return;
    setSending(true);
    try {
      const res = await api.post("seed-package/", jsonDraft);
      const pkg = res.data.data;
      appendAssistantMessage(
        `✅ Package **${pkg.title}** created successfully! 🎉`
      );
      setJsonDraft(null);
      await loadPackages({}, true); // ✅ Refresh global store
    } catch (err) {
      console.error(err);
      appendAssistantMessage("⚠️ Failed to seed package.");
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-green-100 to-amber-100 dark:via-slate-800 dark:from-black dark:to-black py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="rounded-2xl shadow-xl backdrop-blur-md bg-white/80 dark:bg-gray-900/70 border border-black/5 dark:border-white/10 overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold font-cinzel text-center text-gray-800 dark:text-amber-200">
              🌍 AI Travel Studio
            </h1>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
              Design new travel packages or manage existing ones
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* TABS HEADER */}
              <TabsList className="grid grid-cols-2 w-full h-full bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="chat"
                  className="flex items-center justify-center gap-2 py-3 hover:bg-slate-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none">
                  <MessageSquareText size={18} /> Chat Assistant
                </TabsTrigger>
                <TabsTrigger
                  value="packages"
                  className="flex items-center justify-center gap-2 py-3 hover:text-black hover:bg-slate-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none">
                  <Edit size={18} /> Manage Packages
                </TabsTrigger>
              </TabsList>

              {/* 💬 CHAT TAB */}
              <TabsContent value="chat" className="p-5">
                <div className="h-[55vh] overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}>
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-orange-600 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-amber-100 border border-gray-200 dark:border-gray-700"
                        }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* INPUT AREA */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Describe your travel package idea..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button onClick={sendMessage} disabled={sending}>
                    {sending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </Button>
                </div>

                {/* DRAFT PREVIEW */}
                {jsonDraft && (
                  <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      🧾 Draft Preview
                    </h3>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 text-sm overflow-x-auto max-h-[200px]">
                      <pre>{JSON.stringify(jsonDraft, null, 2)}</pre>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setJsonDraft(null)}>
                        Edit
                      </Button>
                      <Button onClick={confirmPackage} disabled={sending}>
                        {sending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Confirm & Save"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* 🧾 PACKAGES TAB */}
              <TabsContent value="packages" className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Your Packages</h3>
                  <Button
                    onClick={() => loadPackages({ isActive: true }, true)} // 👈 force refresh
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    Refresh
                  </Button>
                </div>

                {packages.length > 0 ? (
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {packages.map((pkg) => (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex justify-between items-center bg-white/70 dark:bg-gray-800 border rounded-lg p-3 shadow-sm hover:shadow-md transition">
                        <div>
                          <p className="font-semibold">{pkg.title}</p>
                          <p className="text-sm text-gray-500">₹{pkg.price}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPackage(pkg)}>
                          View / Edit
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No packages yet. Click “Refresh” to load existing ones.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* ✏️ Edit Modal */}
      {selectedPackage && (
        <PackageDetailsModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onSave={(updatedPkg) => {
            updatePackage(updatedPkg.id, updatedPkg); // ✅ global update
            setSelectedPackage(null);
            appendAssistantMessage(
              `✅ ${updatedPkg.title} updated successfully!`
            );
          }}
        />
      )}
    </main>
  );
}
