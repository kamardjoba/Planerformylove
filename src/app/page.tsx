"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app");
  }, [router]);

  // Landing page is intentionally disabled on app start.
  // Old landing markup kept in git history; route now redirects to /app.
  return null;
}


// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Flame, Calendar, Target, BarChart3, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/Button";
//   return (
//     <div className="min-h-screen bg-surface">
//       <header className="border-b border-border bg-surface-elevated/80 backdrop-blur-xl">
//         <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
//           <Link href="/" className="flex items-center gap-2">
//             <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
//               <Flame className="h-5 w-5" />
//             </span>
//             <span className="text-xl font-semibold text-text-primary">
//               DailyFlow
//             </span>
//           </Link>
//           <div className="flex items-center gap-4">
//             <Link href="/app">
//               <Button variant="ghost">Sign in</Button>
//             </Link>
//             <Link href="/app">
//               <Button>Get started</Button>
//             </Link>
//           </div>
//         </div>
//       </header>
//       <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center"
//         >
//           <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
//             Plan your day.
//             <br />
//             <span className="text-accent">Flow through work.</span>
//           </h1>
//           <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:mt-6 sm:text-lg">
//             The elegant productivity app that helps you plan your entire day in
//             one place. Timeline, focus mode, habits & analytics—without the
//             overwhelm.
//           </p>
//           <div className="mt-10 flex flex-wrap justify-center gap-4">
//             <Link href="/app">
//               <Button size="lg" className="gap-2">
//                 Open DailyFlow
//                 <ArrowRight className="h-4 w-4" />
//               </Button>
//             </Link>
//             <Link href="/app/planner">
//               <Button variant="secondary" size="lg">
//                 Try Planner
//               </Button>
//             </Link>
//           </div>
//         </motion.section>

//         <motion.section
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3, duration: 0.5 }}
//           className="mt-16 grid gap-6 sm:mt-24 sm:grid-cols-2 sm:gap-8 lg:mt-32 lg:grid-cols-4"
//         >
//           {[
//             {
//               icon: Calendar,
//               title: "Daily timeline",
//               desc: "See your day at a glance. Drag tasks to plan the perfect schedule.",
//             },
//             {
//               icon: Target,
//               title: "Focus mode",
//               desc: "One task, one timer. Pomodoro built in for deep work.",
//             },
//             {
//               icon: BarChart3,
//               title: "Analytics",
//               desc: "Track completion rates and build better habits over time.",
//             },
//             {
//               icon: Flame,
//               title: "Streaks & habits",
//               desc: "Stay consistent with habit tracking and streak counters.",
//             },
//           ].map((item, i) => (
//             <motion.div
//               key={item.title}
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 * i + 0.4 }}
//               className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft transition-shadow hover:shadow-glass"
//             >
//               <item.icon className="h-8 w-8 text-accent" />
//               <h3 className="mt-4 font-semibold text-text-primary">
//                 {item.title}
//               </h3>
//               <p className="mt-2 text-sm text-text-secondary">{item.desc}</p>
//             </motion.div>
//           ))}
//         </motion.section>
//         <motion.footer
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="mt-16 border-t border-border py-6 text-center text-sm text-text-tertiary sm:mt-24 md:mt-32 md:py-8"
//         >
//           DailyFlow — Plan your day. Flow through work.
//         </motion.footer>
//       </main>
//     </div>
//   );