/** Icons from the shared SVG sprite (components/Sprite.tsx). */
export function Use({ id }: { id: string }) {
  return (
    <svg aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

/** Small outline icon in a rounded tile (menus, info cards). pathLength (e.g. 1) lets CSS draw the outline in by
    fractions of its length, whatever the icon. */
export function TileIcon({ d, className = "menu__ic", pathLength }: { d: string; className?: string; pathLength?: number }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={d}
          pathLength={pathLength}
        />
      </svg>
    </span>
  );
}
