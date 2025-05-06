
import { format } from "date-fns";
import { FileText, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  nextVisitDate?: string | null;
  type: "form" | "visit" | "delivery";
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  // Sort events by date (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={cn("space-y-6", className)}>
      <h3 className="text-lg font-medium">Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-3.5 top-3 h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />

        <ul className="space-y-6">
          {sortedEvents.map((event) => (
            <li key={event.id} className="relative pl-9">
              {/* Event dot */}
              <div
                className={cn(
                  "absolute left-0 top-2 h-7 w-7 rounded-full border-2 border-white flex items-center justify-center",
                  event.type === "form"
                    ? "bg-blue-100"
                    : event.type === "delivery"
                    ? "bg-purple-100"
                    : "bg-green-100"
                )}
              >
                <FileText className={cn(
                  "h-3.5 w-3.5",
                  event.type === "form"
                    ? "text-blue-600"
                    : event.type === "delivery"
                    ? "text-purple-600"
                    : "text-green-600"
                )} />
              </div>

              {/* Event content */}
              <div className="rounded-lg border bg-card shadow-sm p-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(event.date), "MMM d, yyyy")}
                  </time>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.description}
                </p>

                {event.nextVisitDate && (
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <CalendarDays className="mr-1.5 h-3 w-3 text-muted-foreground" />
                    <span>
                      Next visit: {format(new Date(event.nextVisitDate), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
