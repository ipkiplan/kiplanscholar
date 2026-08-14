import React from "react";
import { PersonalInfo } from "./cvTypes";

interface PersonalInfoFormProps {
  value: PersonalInfo;
  onChange: (patch: Partial<PersonalInfo>) => void;
}

const FIELDS: Array<{ key: keyof PersonalInfo; label: string; placeholder: string; required?: boolean }> = [
  { key: "fullName", label: "Full Name", placeholder: "e.g. Anusha Shrestha", required: true },
  { key: "email", label: "Email", placeholder: "you@example.com", required: true },
  { key: "phone", label: "Phone", placeholder: "+977 98XXXXXXXX" },
  { key: "location", label: "Location", placeholder: "Kathmandu, Nepal" },
  { key: "linkedIn", label: "LinkedIn (optional)", placeholder: "linkedin.com/in/..." },
  { key: "portfolio", label: "Portfolio / Website (optional)", placeholder: "yourdomain.com" },
];

export default function PersonalInfoForm({ value, onChange }: PersonalInfoFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {FIELDS.map((field) => (
        <div key={field.key} className={field.key === "fullName" || field.key === "email" ? "sm:col-span-2" : ""}>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            {field.label} {field.required && <span className="text-nepal-crimson">*</span>}
          </label>
          <input
            type="text"
            value={value[field.key]}
            onChange={(e) => onChange({ [field.key]: e.target.value })}
            placeholder={field.placeholder}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all"
          />
        </div>
      ))}
    </div>
  );
}