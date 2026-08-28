import { CalendarDays, FileText, Star, Trash2 } from "lucide-react";

import { DashboardStatCard } from "./DashboardStatCard";

interface DashboardStatsProps {
  deletedNotes?: number;
  favoriteNotes?: number;
  notesThisWeek?: number;
  totalNotes?: number;
}

export const DashboardStats = ({
  deletedNotes = 0,
  favoriteNotes = 0,
  notesThisWeek = 0,
  totalNotes = 0,
}: DashboardStatsProps) => {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        description="Active notes in your workspace"
        icon={FileText}
        title="Total Notes"
        tone="violet"
        value={totalNotes}
      />

      <DashboardStatCard
        description="Notes you marked as favorite"
        icon={Star}
        title="Favorites"
        tone="amber"
        value={favoriteNotes}
      />

      <DashboardStatCard
        description="Notes currently in trash"
        icon={Trash2}
        title="Deleted Notes"
        tone="rose"
        value={deletedNotes}
      />

      <DashboardStatCard
        description="Created during this week"
        icon={CalendarDays}
        title="Notes This Week"
        tone="indigo"
        value={notesThisWeek}
      />
    </section>
  );
};
