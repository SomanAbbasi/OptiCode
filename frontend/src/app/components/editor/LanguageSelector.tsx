
import { SUPPORTED_LANGUAGES,Language } from "../../../../types/analysis";

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  disabled?: boolean; // locked while analysis is running
}

const LANGUAGE_LABELS: Record<Language, string> = {
  python : "Python",
  "c++"  : "C++",
  c      : "C",
  java   : "Java",
  "c#"   : "C#",
};

export default function LanguageSelector({
  value,
  onChange,
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Language
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as Language)}
        className="
          w-full px-3 py-2 text-sm
          bg-white border border-slate-200 rounded-xl
          text-slate-800 font-semibold
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer transition-all
        "
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {LANGUAGE_LABELS[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}