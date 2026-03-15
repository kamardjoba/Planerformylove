# DailyFlow

A modern productivity web app to plan your day, organize tasks, and track progress. Inspired by Notion, Todoist, Sunsama, TickTick, and Linear.

## Tech Stack

- **Frontend:** React, Next.js 14, Tailwind CSS, Framer Motion, @dnd-kit (drag & drop)
- **State:** Zustand with localStorage persistence
- **Charts:** Recharts

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the landing page to enter the app at `/app`.

## Features

- **Dashboard** — Today’s tasks, quick add, progress bar, motivational message, habits & streaks
- **Planner** — Add, edit, delete, reorder tasks by date; full task details (title, description, priority, due time, tags)
- **Calendar** — Weekly/monthly view, tasks per day, click a day to see tasks
- **Focus Mode** — Single-task view with Pomodoro (work / short break / long break)
- **Statistics** — Completed today/week, completion rate, 7-day bar chart and area chart
- **Settings** — Dark/light theme, Pomodoro durations, notifications, keyboard shortcuts
- **Habits** — Streak display on dashboard (demo data)

## Keyboard Shortcuts

- `⌘ K` — Planner  
- `⌘ D` — Dashboard  
- `⌘ C` — Calendar  
- `⌘ F` — Focus  
- `⌘ S` — Statistics  
- `?` — Settings (shortcuts section)

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # Landing
│   ├── app/          # App shell (sidebar + layout)
│   │   ├── page.tsx  # Dashboard
│   │   ├── planner/
│   │   ├── calendar/
│   │   ├── focus/    # FocusView component + page
│   │   ├── stats/
│   │   └── settings/
├── components/
│   ├── ui/           # Button, Card, Input, Badge, ProgressBar
│   ├── layout/       # Sidebar, AppLayout
│   ├── tasks/        # TaskCard, QuickAddTask, TaskModal, SortableTaskList
│   ├── habits/       # HabitStreak
│   ├── keyboard/     # KeyboardShortcuts
│   └── providers/    # ThemeProvider
├── store/            # Zustand store (tasks, habits, settings)
├── types/            # Task, Habit, UserSettings
└── lib/              # demo-data
```

Data is stored in the browser via Zustand’s `persist` middleware (localStorage). The app ships with demo tasks and habits so you can try it immediately.
