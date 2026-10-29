/** Icons from the shared SVG sprite (components/Sprite.tsx). */
export function Use({ id }: { id: string }) {
  return (
    <svg aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

/** Small outline icon in a rounded tile (menus, info cards). */
export function TileIcon({ d, className = "menu__ic" }: { d: string; className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d={d} />
      </svg>
    </span>
  );
}
