/**
 * Angry Tiger — icon registry.
 * Pure path data (no JSX — see components/Icon.tsx for the renderer).
 * Every icon in the live product today: the four nav utility icons.
 * All share the same stroke language (2px stroke, no fill, round caps
 * implied by the 24×24 viewBox convention already in use).
 */

export type IconPath =
  | { type: "circle"; cx: number; cy: number; r: number }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number }
  | { type: "path"; d: string };

export type IconDef = {
  viewBox: string;
  paths: IconPath[];
};

export const icons = {
  search: {
    viewBox: "0 0 24 24",
    paths: [
      { type: "circle", cx: 10.5, cy: 10.5, r: 7 },
      { type: "line", x1: 15.8, y1: 15.8, x2: 22, y2: 22 },
    ],
  },
  account: {
    viewBox: "0 0 24 24",
    paths: [
      { type: "circle", cx: 12, cy: 7.5, r: 4 },
      { type: "path", d: "M4 21c1.4-4.2 4.8-6.2 8-6.2s6.6 2 8 6.2" },
    ],
  },
  cart: {
    viewBox: "0 0 24 24",
    paths: [
      { type: "path", d: "M1.5 3.5h3l2.6 12h11.4l2.6-9H6" },
      { type: "circle", cx: 9.5, cy: 19.5, r: 1.7 },
      { type: "circle", cx: 16.8, cy: 19.5, r: 1.7 },
    ],
  },
  menu: {
    viewBox: "0 0 24 24",
    paths: [
      { type: "line", x1: 3, y1: 6, x2: 21, y2: 6 },
      { type: "line", x1: 3, y1: 12, x2: 21, y2: 12 },
      { type: "line", x1: 3, y1: 18, x2: 21, y2: 18 },
    ],
  },
} as const satisfies Record<string, IconDef>;

export type IconName = keyof typeof icons;
