"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/contexts/ToastContext";

export function ExportButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toast: showToast } = useToast();

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const element = document.querySelector("[data-export-target]") ?? document.body;
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#0f172a",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, Math.min(imgH, pdfH));
      if (imgH > pdfH) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -(pdfH * 0.95), pdfW, imgH);
      }
      pdf.save("banking-command-centre.pdf");
      showToast("Exported to PDF successfully", "success");
    } catch (err) {
      console.error("Export failed:", err);
      window.print();
      showToast("Export failed — opened print dialog instead", "error");
    } finally {
      setExporting(false);
      setShowMenu(false);
    }
  };

  const handlePrint = () => {
    window.print();
    setShowMenu(false);
    showToast("Print dialog opened", "info");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((v) => !v)}
        disabled={exporting}
        className="p-2 rounded-lg border border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/30 transition-colors disabled:opacity-50"
        title="Export"
        aria-label="Export to PDF or Print"
      >
        {exporting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full"
          />
        ) : (
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
      </button>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 top-full mt-2 w-40 glass-panel p-2 z-50"
          >
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded"
            >
              Export to PDF
            </button>
            <button
              onClick={handlePrint}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded"
            >
              Print / Save as PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
