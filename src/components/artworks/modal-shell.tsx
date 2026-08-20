"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ModalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const close = () => router.back();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 pb-12 sm:p-8"
      style={{ paddingTop: "max(6rem, calc(3rem + env(safe-area-inset-top)))" }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="fixed inset-0 -z-10 cursor-default"
      />
      <div className="relative w-full max-w-4xl bg-cream p-8 sm:p-12">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-6 top-6 font-sans text-xs font-light uppercase tracking-widest text-ink/70 hover:text-ink"
        >
          Close ✕
        </button>
        {children}
      </div>
    </div>
  );
}
