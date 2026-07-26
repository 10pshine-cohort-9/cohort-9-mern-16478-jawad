import { CalendarDays, FileText, Pin, Trash2 } from "lucide-react";

import { DashboardStatCard } from "./DashboardStatCard";

interface DashboardStatsProps {
  deletedNotes?: number;
  notesThisWeek?: number;
  pinnedNotes?: number;
  totalNotes?: number;
}

export const DashboardStats = ({
  deletedNotes = 0,
  notesThisWeek = 0,
  pinnedNotes = 0,
  totalNotes = 0,
}: DashboardStatsProps) => {
  return (
    // <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatCard
        description="All notes in your workspace"
        icon={FileText}
        title="Total Notes"
        value={totalNotes}
      />

      <DashboardStatCard
        description="Notes saved for quick access"
        icon={Pin}
        title="Pinned Notes"
        value={pinnedNotes}
      />

      <DashboardStatCard
        description="Notes currently in trash"
        icon={Trash2}
        title="Deleted Notes"
        value={deletedNotes}
      />

      <DashboardStatCard
        description="Notes created during this week"
        icon={CalendarDays}
        title="This Week"
        value={notesThisWeek}
      />
    </section>
  );
};
