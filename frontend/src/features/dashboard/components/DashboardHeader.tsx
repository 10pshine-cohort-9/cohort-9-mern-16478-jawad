import { motion } from "motion/react";

import { useAuth } from "@/features/auth/hooks/useAuth";

const getGreeting = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  }

  if (currentHour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
};

export const DashboardHeader = () => {
  const { user } = useAuth();

  const firstName = user?.fullName.trim().split(/\s+/)[0] ?? "there";

  return (
    <motion.header
      animate={{
        opacity: 1,
        y: 0,
      }}
      initial={{
        opacity: 0,
        y: 8,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <h1 className="text-2xl font-extrabold tracking-tight text-[#11175f] sm:text-3xl dark:text-white">
        {getGreeting()}, {firstName}! 👋
      </h1>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Here&apos;s what&apos;s happening with your notes today.
      </p>
    </motion.header>
  );
};
