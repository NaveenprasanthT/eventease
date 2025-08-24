"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function DateTimePicker({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handleDateChange = (selected: Date | undefined) => {
    if (!selected) {
      setDate(undefined);
      onChange(undefined);
      return;
    }

    // keep previous time
    const prev = date ?? new Date();
    selected.setHours(prev.getHours(), prev.getMinutes());
    setDate(selected);
    onChange(selected);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!date) return;
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? date.toLocaleString() : "Pick a date & time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col space-y-4 p-4">
        {/* Calendar */}
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />

        {/* Time input */}
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <input
            type="time"
            className="border rounded-md p-1"
            value={date ? date.toTimeString().slice(0, 5) : ""}
            onChange={handleTimeChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
