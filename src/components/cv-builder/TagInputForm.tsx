import React, { useState } from "react";
import { X } from "lucide-react";
import { SkillEntry } from "./cvTypes";

interface TagInputFormProps {
  entries: SkillEntry[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export default function TagInputForm({ entries, onAdd, onRemove }: TagInputFormProps) {
  const [value, setValue] = useState("");

  const commit = () => {
    if (value.trim()) {
      onAdd(value);
      setValue("");
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Skills</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          placeholder="Type a skill and press Enter (e.g. Python, Public Speaking)"
          className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all"
        />
        <button
          type="button"
          onClick={commit}
          className="px-4 py-2.5 bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light rounded-xl text-sm font-bold hover:bg-nepal-crimson/20 transition-colors cursor-pointer shrink-0"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map((skill) => (
          <span
            key={skill.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-nepal-blue/10 text-nepal-blue dark:text-sky-400"
          >
            {skill.name}
            <button
              type="button"
              onClick={() => onRemove(skill.id)}
              aria-label={`Remove ${skill.name}`}
              className="hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}