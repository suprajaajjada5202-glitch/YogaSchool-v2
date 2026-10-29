import { ICONS } from "./config";

export function Icon({ name, path }: { name?: string; path?: string }) {
  return (
    <svg className="a-ic" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={path ?? ICONS[name ?? ""] ?? ""}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
