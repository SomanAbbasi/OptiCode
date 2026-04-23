
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
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Language
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as Language)}
        className="
          w-full px-3 py-2 text-sm
          bg-white border border-gray-200 rounded-lg
          text-gray-800 font-medium
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer transition-colors
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