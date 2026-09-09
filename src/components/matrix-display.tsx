"use client";

import { useEffect, useRef, useState } from "react";

import { FONT, GLYPH_H, GLYPH_W } from "@/lib/dot-font";

/**
 * A faithful software rendering of the Carrousel panel: 68 x 32 addressable
 * LEDs, driven by the same kind of frame buffer the device uses, in the same
 * bitmap font the page sets its headlines in.
 *
 * Everything on screen is computed locally and is real: the clock reads the
 * visitor's own time, Game of Life is actually simulated, the timer actually
 * counts. Nothing here is a mocked-up value.
 */

const COLS = 68;
const ROWS = 32;

/* The panel draws nothing but its lit pixels, so the only colour it needs is
   the accent. No ground, no unlit grid: over a photograph the LEDs sit on the
   real screen instead of on a black rectangle pasted across it. */
const ACCENT = "#ac5634";

type Buffer = Uint8Array;

const createBuffer = (): Buffer => new Uint8Array(COLS * ROWS);

function setPixel(buf: Buffer, x: number, y: number, value: number) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
  buf[y * COLS + x] = value;
}

function textWidth(text: string, scale: number, tracking = 1) {
  if (text.length === 0) return 0;
  return text.length * (GLYPH_W * scale + tracking) - tracking;
}

function drawText(
  buf: Buffer,
  text: string,
  x: number,
  y: number,
  scale = 1,
  value = 255,
  tracking = 1,
) {
  let cursor = x;
  for (const char of text.toUpperCase()) {
    const glyph = FONT[char];
    if (glyph) {
      for (let row = 0; row < GLYPH_H; row++) {
        for (let col = 0; col < GLYPH_W; col++) {
          if (glyph[row][col] !== "1") continue;
          for (let sy = 0; sy < scale; sy++) {
            for (let sx = 0; sx < scale; sx++) {
              setPixel(buf, cursor + col * scale + sx, y + row * scale + sy, value);
            }
          }
        }
      }
    }
    cursor += GLYPH_W * scale + tracking;
  }
}

function drawTextCentred(
  buf: Buffer,
  text: string,
  y: number,
  scale = 1,
  value = 255,
  tracking = 1,
) {
  const x = Math.round((COLS - textWidth(text, scale, tracking)) / 2);
  drawText(buf, text, x, y, scale, value, tracking);
}

/* -------------------------------------------------------------------------
   Apps. Each one fills a frame buffer for a given moment in time.
   ------------------------------------------------------------------------- */

const pad = (n: number) => n.toString().padStart(2, "0");
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

/** The default screen: the visitor's own local time and date. */
function renderClock(buf: Buffer, now: Date) {
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  drawTextCentred(buf, time, 4, 2, 255, 2);

  const date = `${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`;
  drawTextCentred(buf, date, 22, 1, 150, 1);

  const progress = (now.getSeconds() + now.getMilliseconds() / 1000) / 60;
  const lit = Math.round(progress * COLS);
  for (let x = 0; x < lit; x++) setPixel(buf, x, 31, 90);
}

/** Conway's Game of Life, actually simulated on the panel grid. */
function stepLife(cells: Uint8Array): Uint8Array {
  const next = new Uint8Array(COLS * ROWS);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      let neighbours = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          // The panel wraps, so gliders leave one edge and return on the other.
          const nx = (x + dx + COLS) % COLS;
          const ny = (y + dy + ROWS) % ROWS;
          neighbours += cells[ny * COLS + nx];
        }
      }
      const alive = cells[y * COLS + x] === 1;
      next[y * COLS + x] = alive
        ? neighbours === 2 || neighbours === 3
          ? 1
          : 0
        : neighbours === 3
          ? 1
          : 0;
    }
  }
  return next;
}

function seedLife(): Uint8Array {
  const cells = new Uint8Array(COLS * ROWS);
  for (let i = 0; i < cells.length; i++) {
    cells[i] = Math.random() < 0.3 ? 1 : 0;
  }
  return cells;
}

function renderLife(buf: Buffer, cells: Uint8Array, previous: Uint8Array) {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === 1) {
      // A cell that has just been born reads brighter, then settles.
      buf[i] = previous[i] === 1 ? 210 : 255;
    }
  }
}

/** A focus session counting down in real time from twenty-five minutes. */
function renderTimer(buf: Buffer, elapsedMs: number) {
  const total = 25 * 60;
  const remaining = Math.max(0, total - Math.floor(elapsedMs / 1000));
  const label = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`;

  drawTextCentred(buf, "FOCUS", 3, 1, 130, 1);
  drawTextCentred(buf, label, 12, 2, 255, 2);

  const left = 8;
  const width = COLS - left * 2;
  const done = Math.round((1 - remaining / total) * width);
  for (let x = 0; x < width; x++) {
    setPixel(buf, left + x, 28, x < done ? 255 : 45);
  }
}

/* -------------------------------------------------------------------------
   Component
   ------------------------------------------------------------------------- */

const APPS = ["Clock", "Game of Life", "Pomodoro"] as const;
const APP_DURATION_MS = 7000;
const WIPE_MS = 420;

export function MatrixDisplay({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [appName, setAppName] = useState<string>(APPS[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    /* Transparent, so the panel has no ground of its own. */
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cell = 0;
    let dpr = 1;

    const resize = () => {
      const width = wrap.clientWidth;
      if (width === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cell = width / COLS;
      canvas.width = Math.round(COLS * cell * dpr);
      canvas.height = Math.round(ROWS * cell * dpr);
      canvas.style.height = `${ROWS * cell}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
    };

    const paint = (buf: Buffer, wipeCol: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const r = Math.max(0.5, cell * 0.3);
      ctx.fillStyle = ACCENT;

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (x >= wipeCol) continue;
          const value = buf[y * COLS + x];
          if (value === 0) continue;

          /* On a dark ground a brighter LED is a lighter one. Here the panel
             sits on the cream page and on the pale screen of the photographs,
             so brightness is carried by opacity instead: the dimmer pixels of
             a frame recede rather than glow. */
          ctx.globalAlpha = value / 255;
          ctx.beginPath();
          ctx.arc(x * cell + cell / 2, y * cell + cell / 2, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    /* --- state ------------------------------------------------------------ */
    let appIndex = 0;
    let appStartedAt = performance.now();
    let lifeCells = seedLife();
    let lifePrevious = lifeCells;
    let lastLifeStep = 0;
    let lastSecond = -1;
    let dirty = true;
    let frame = 0;

    const buildFrame = (now: Date, elapsed: number): Buffer => {
      const buf = createBuffer();
      switch (APPS[appIndex]) {
        case "Clock":
          renderClock(buf, now);
          break;
        case "Game of Life":
          renderLife(buf, lifeCells, lifePrevious);
          break;
        case "Pomodoro":
          renderTimer(buf, elapsed);
          break;
      }
      return buf;
    };

    if (reduced) {
      // No cycling, no simulation. One honest frame, refreshed each minute.
      const drawStatic = () => paint(buildFrame(new Date(), 0), COLS);
      resize();
      drawStatic();
      const observer = new ResizeObserver(() => {
        resize();
        drawStatic();
      });
      observer.observe(wrap);
      const interval = window.setInterval(drawStatic, 30_000);
      return () => {
        observer.disconnect();
        window.clearInterval(interval);
      };
    }

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          // Do not let the timer jump forward while the panel was off screen.
          appStartedAt = performance.now();
          dirty = true;
          frame = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "120px" },
    );

    function tick(time: number) {
      if (!visible) return;
      const elapsed = time - appStartedAt;

      if (elapsed > APP_DURATION_MS + WIPE_MS) {
        appIndex = (appIndex + 1) % APPS.length;
        appStartedAt = time;
        if (APPS[appIndex] === "Game of Life") {
          lifeCells = seedLife();
          lifePrevious = lifeCells;
        }
        setAppName(APPS[appIndex]);
        dirty = true;
      }

      const now = new Date();
      if (APPS[appIndex] === "Game of Life") {
        if (time - lastLifeStep > 110) {
          lifePrevious = lifeCells;
          lifeCells = stepLife(lifeCells);
          lastLifeStep = time;
          dirty = true;
        }
      } else if (now.getSeconds() !== lastSecond) {
        lastSecond = now.getSeconds();
        dirty = true;
      }

      // The wipe reveals the new app column by column, the way the panel does.
      const wiping = elapsed < WIPE_MS;
      const wipeCol = wiping ? Math.round((elapsed / WIPE_MS) * COLS) : COLS;
      if (wiping) dirty = true;

      if (dirty) {
        paint(buildFrame(now, Math.max(0, elapsed - WIPE_MS)), wipeCol);
        dirty = false;
      }
      frame = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();
    io.observe(wrap);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <canvas
        ref={canvasRef}
        /* The aspect ratio reserves the height before the first paint sets
           it, so nothing shifts when the panel comes up. */
        style={{ aspectRatio: `${COLS} / ${ROWS}` }}
        className="block w-full"
        role="img"
        aria-label={`The Carrousel panel, 68 by 32 LEDs, currently running ${appName}`}
      />
    </div>
  );
}
