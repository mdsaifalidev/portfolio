"use client";

import { Command } from "cmdk";
import {
  ArrowUpRight,
  Copy,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Hash,
  Mail,
  Moon,
  NotebookPen,
  Search,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { trackEvent } from "@/lib/analytics";
import { openChat } from "@/lib/chat-events";
import type { PaletteItem } from "@/lib/palette";
import { toggleTheme } from "@/lib/theme";

const groupIcons = { Navigate: Hash, Projects: FolderGit2, Writing: NotebookPen, Links: ArrowUpRight };

const itemClass =
  "flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm text-text data-[selected=true]:bg-surface data-[selected=true]:text-accent";

export function CommandPalette({ items, open, onClose }: { items: PaletteItem[]; open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setSearch("");
      setCopied(false);
      dialog.showModal();
      inputRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => dialogRef.current?.close();

  const go = (item: PaletteItem) => {
    close();
    if (item.group === "Projects") trackEvent("project_link_click", { label: item.label });
    if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
    else router.push(item.href);
  };

  const groups = (["Navigate", "Projects", "Writing", "Links"] as const)
    .map((group) => ({ group, items: items.filter((i) => i.group === group) }))
    .filter((g) => g.items.length > 0);

  const question = search.trim();

  return (
    <dialog
      ref={dialogRef}
      className="palette-dialog"
      data-ui
      aria-label="Command menu"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <Command label="Command menu" loop className="flex max-h-[min(70vh,32rem)] flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4"> {/* data-ui panel divider, taste-skill-ignore */}
          <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <Command.Input
            ref={inputRef}
            enterKeyHint="go"
            value={search}
            onValueChange={setSearch}
            placeholder="Search the site, or ask my AI a question..."
            className="h-12 w-full bg-transparent text-sm text-text placeholder:text-muted focus:outline-none pointer-coarse:text-base"
          />
          <kbd className="border border-border px-1.5 py-0.5 text-step-0 text-muted">Esc</kbd>
        </div>

        <Command.List className="overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin]">
          <Command.Empty className="px-3 py-6 text-center text-sm">No matches - press Enter to ask my AI instead.</Command.Empty>

          {question && (
            <Command.Group heading="Assistant" forceMount>
              <Command.Item
                forceMount
                value={`ask-ai ${question}`}
                onSelect={() => {
                  close();
                  openChat({ question });
                }}
                className={itemClass}
              >
                <Sparkles className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="truncate">
                  Ask my AI: <span className="text-muted">&quot;{question}&quot;</span>
                </span>
                <CornerDownLeft className="ml-auto size-3.5 shrink-0 text-muted" aria-hidden="true" />
              </Command.Item>
            </Command.Group>
          )}

          {groups.map(({ group, items }) => {
            const Icon = groupIcons[group];
            return (
              <Command.Group key={group} heading={group}>
                {items.map((item) => (
                  <Command.Item key={item.id} value={item.id} keywords={[item.label, ...(item.keywords ?? [])]} onSelect={() => go(item)} className={itemClass}>
                    <Icon className="size-4 shrink-0 text-muted" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                    {item.hint && <span className="ml-auto shrink-0 text-step-0 text-muted">{item.hint}</span>}
                    {item.external && <ArrowUpRight className="size-3.5 shrink-0 text-muted" aria-hidden="true" />}
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}

          <Command.Group heading="Actions">
            <Command.Item value="action-ask-ai" keywords={["ask", "ai", "assistant", "chat"]} onSelect={() => { close(); openChat(); }} className={itemClass}>
              <Sparkles className="size-4 shrink-0 text-muted" aria-hidden="true" />
              Ask my AI
            </Command.Item>
            <Command.Item value="action-theme" keywords={["theme", "dark", "light", "mode"]} onSelect={() => { toggleTheme(); close(); }} className={itemClass}>
              <Moon className="size-4 shrink-0 text-muted" aria-hidden="true" />
              Toggle light / dark theme
            </Command.Item>
            <Command.Item
              value="action-copy-email"
              keywords={["copy", "email", "contact", profile.email]}
              onSelect={async () => {
                try {
                  await navigator.clipboard.writeText(profile.email);
                  setCopied(true);
                  setTimeout(close, 700);
                } catch {
                  window.location.href = `mailto:${profile.email}`;
                }
              }}
              className={itemClass}
            >
              <Copy className="size-4 shrink-0 text-muted" aria-hidden="true" />
              {copied ? "Email copied" : "Copy email address"}
            </Command.Item>
            <Command.Item value="action-email" keywords={["email", "mail", "contact", "hire"]} onSelect={() => { close(); window.location.href = `mailto:${profile.email}`; }} className={itemClass}>
              <Mail className="size-4 shrink-0 text-muted" aria-hidden="true" />
              Email Saif
            </Command.Item>
            <Command.Item
              value="action-resume"
              keywords={["resume", "cv", "pdf", "download"]}
              onSelect={() => {
                close();
                trackEvent("resume_download", { label: "palette" });
                window.open(profile.resume, "_blank", "noopener");
              }}
              className={itemClass}
            >
              <FileText className="size-4 shrink-0 text-muted" aria-hidden="true" />
              Open resume (PDF)
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </dialog>
  );
}
