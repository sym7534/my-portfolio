/**
 * thumb-config.mjs — per-project ASCII thumbnail settings.
 *
 * Tuning lives here so the renderer stays generic. Every value below was
 * chosen by rendering contact sheets (tools/sweep.mjs, tools/contact-sheet.mjs)
 * and looking at the result at the size the cards are actually displayed
 * (~370px wide), not at the flattering 600px render size.
 *
 * Palette: the site is ink-on-paper (globals.css --color-text-primary #171717
 * on --color-bg-white #ffffff) and everything on the page is type, so the
 * thumbnails are monochrome and TEXT mode. The vivid 9-color SHAPES look from
 * ascii-graphics reads as clip-art here and fights every other element.
 *
 * Per-project knobs that matter:
 *   isolate       — segment the subject with rembg (tools/cutouts.py) and drop
 *                   the background. Only works on PHOTOS of a single object.
 *   crop          — fractional {x,y,w,h} window into the source. For
 *                   screenshots, where the subject is one region of a
 *                   desktop-sized frame.
 *   detail        — 0..1 local-contrast weighting. High for screenshots (kills
 *                   flat chrome, keeps edges/text); 0 for isolated subjects,
 *                   whose silhouette already separates them from paper.
 *   targetDensity — fraction of covered cells that get ink. The exposure knob.
 *   invert        — for dark-UI sources, so the bright UI becomes the ink.
 */

export const DEFAULTS = {
  cols: 58,
  cellW: 11,
  spacing: 0,
  gamma: 1.0,
  mode: "TEXT",
  cellOutline: false,
  chipAmount: 0.0,
  ink: "#171717",
  paper: "#ffffff",
  alphaCut: 0.35,
  inkFloor: 0.72,
  inkCeil: 1.0,
  floorTone: 0.06,
  targetDensity: 0.6,
  autoLevels: true,
  levelsLow: 0.02,
  levelsHigh: 0.98,
  contrast: 1.4,
  detail: 0,
  detailRadius: 2,
  invert: false,
  isolate: false,
  trim: true,
  pad: 0.96,
  seed: 0,
  outlineAlpha: 0.25,
  glyphScale: 0.95,
  bold: true,
  jitter: 0,
  crop: null,
};

export const THUMBS = [
  {
    slug: "canopi",
    minFloor: 0.16,
    src: "/assets/projects/canopi/canopizoomedout.png",
    // light UI screenshot; crop to the map so the mosaic has real structure
    // instead of acres of near-white chrome
    crop: { x: 0.32, y: 0.08, w: 0.5, h: 0.72 },
    aspect: 4 / 3,
    contrast: 1.7,
    detail: 0.5,
    targetDensity: 0.3,
  },
  {
    slug: "robot-hand",
    src: "/assets/projects/robot-hand/finalhand.png",
    // photo on a cluttered shelf: isolate the hand
    isolate: true,
    aspect: 3 / 4,
  },
  {
    slug: "vex",
    src: "/assets/projects/vex/cover.png",
    isolate: true,
    aspect: 3 / 4,
  },
  {
    slug: "waterloowash",
    minFloor: 0.18,
    src: "/assets/projects/waterloowash/cover.png",
    // three phone mockups; crop to the middle one so a single screen reads
    crop: { x: 0.335, y: 0.0, w: 0.33, h: 1.0 },
    aspect: 3 / 4,
    contrast: 1.6,
    detail: 0.45,
    targetDensity: 0.26,
  },
  {
    slug: "tronring",
    // The site screenshot is a dark page with sparse text; as a mosaic it is
    // almost empty. The chrome star is the project's actual identity and has
    // real form, so it renders as a subject instead of scattered text.
    src: "/assets/projects/tronring/faviconmaxsize.png",
    aspect: 1,
    contrast: 1.5,
    detail: 0,
    targetDensity: 0.55,
  },
  {
    slug: "self-driving-car",
    minFloor: 0.14,
    src: "/assets/projects/self-driving-car/cover.png",
    // Foxglove 3D panel: crop inside the grid, away from the window chrome
    crop: { x: 0.06, y: 0.1, w: 0.84, h: 0.85 },
    invert: true,
    aspect: 1,
    contrast: 1.6,
    detail: 0.5,
    targetDensity: 0.26,
  },
  {
    slug: "mars-rover",
    minFloor: 0.14,
    src: "/assets/projects/rover/cover.png",
    // screenshot, not a photo — segmentation cannot help here, so crop to the
    // rover in the 3D viewport instead
    isolate: false,
    crop: { x: 0.245, y: 0.5, w: 0.215, h: 0.15 },
    aspect: 16 / 10,
    contrast: 2.2,
    detail: 0.55,
    targetDensity: 0.4,
  },
  {
    slug: "portfolio",
    minFloor: 0.2,
    src: "/assets/projects/personal-site/cover.png",
    // 2x2 grid of site variants; crop to the top-left "Original Version" panel
    crop: { x: 0.012, y: 0.05, w: 0.2, h: 0.44 },
    aspect: 3 / 4,
    contrast: 1.8,
    detail: 0.5,
    targetDensity: 0.3,
  },
  {
    slug: "molehunt",
    minFloor: 0.1,
    src: "/assets/projects/molehunt/cover.png",
    // Minecraft villagers; crop to the front group
    crop: { x: 0.13, y: 0.05, w: 0.55, h: 0.9 },
    aspect: 4 / 3,
    contrast: 1.3,
    detail: 0.45,
    targetDensity: 0.42,
  },
  {
    slug: "card-dealer",
    src: "/assets/projects/card-dealer/cover.png",
    isolate: true,
    aspect: 3 / 2,
    // robot is small in a wide frame: scale it up and drop the ghost cards
    // that segmentation left semi-transparent
    pad: 1.7,
    alphaCut: 0.75,
    targetDensity: 0.75,
  },
  {
    slug: "smart-home",
    src: "/assets/projects/smart-home/cover.png",
    isolate: true,
    aspect: 3 / 2,
  },
];
