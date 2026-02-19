import { cn } from "@/lib/utils";

type TabId = "details" | "checklist" | "discussion";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: "details", label: "Details" },
  { id: "checklist", label: "Checklist" },
  { id: "discussion", label: "Discussion" },
];

interface TaskFormTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  pendingCount?: number;
}

export function TaskFormTabs({
  activeTab,
  onTabChange,
  pendingCount = 0,
}: TaskFormTabsProps) {
  return (
    <div className="flex gap-0 px-4 sm:px-6 border-b border-white/6 shrink-0 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-3 sm:px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px",
            activeTab === tab.id
              ? "text-white border-primary"
              : "text-white/35 border-transparent hover:text-white/60",
          )}
        >
          {tab.label}
          {tab.id === "checklist" && pendingCount > 0 && (
            <span className="ml-1.5 bg-primary/20 text-primary text-[9px] font-black px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export type { TabId };
