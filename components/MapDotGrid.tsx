"use client";

import { useEffect, useRef } from "react";

// --- hover ---
const RADIUS = 100;
const DEPTH_SCALE = 1.5;
const PARALLAX = 0.03;
const RISE = 0.14;
const FALL = 0.06;

// --- карта ---
const LAND_R = 1.2;
const LAND_A = 0.34;
const HOVER_A = 0.75;
const SWAY = 1; // амплитуда покачивания (0 = полностью статично)

// --- дуги с пакетами ---
const ARCS_ON = true;
const MAX_ARCS = 3; // одновременно в воздухе
const SPAWN_MIN = 2.2; // пауза между запусками, сек
const SPAWN_MAX = 4.5;
const TRAVEL = 4.8; // время полёта, сек
const FADE = 2.2; // время угасания хвоста, сек
const LIFT = 0.4; // высота дуги (доля длины)
const TRAIL = 0.4; // длина хвоста (доля дуги)

const GREEN = "74,222,128";
const BASE = "163,179,194";

// затухание карты по краям экрана
const EDGE_MASK =
    "radial-gradient(ellipse closest-side at 50% 50%, #000 60%, transparent 100%)";

// 190 x 83, проекция Equal Earth, 1 бит = суша
const COLS = 190;
const ROWS = 83;
const MAP_B64 =
    "AAMAAAAAAAD//v8B4EAAYAAAAAAAAOAf+AMMAAAAQE0A/j8AAAAG8A8YAAAAgLXw/8MAAACAvXEA/wMAACCI//8wAAAA4O/+//9lwH+uv+Sh/wAAH4D+////zwH/eL7///9/+P////H4AwDwv/7//////wf///////9I////vw8+YADe+////////wj/////vw/4//9/ZAEDAOD7////////+4D///9/LAAv//8HHAAAAPjk//////8/BoCX/z9gAIAA/v8BPwAAIDD+//////+AAQAC+AEGAAjA///hDwAACMX//////z/gAIAA2GAAAAD4///8BwCAhP///////z8gAAAADAQAAAD8/7//AQCg+////////x8QAAAAAQAAAID+//9fAAAA/////////w8AAAAAAAAAAMD///85AAD4/////////wcAAAAAAAAAAPD//38AAAD8//f7/////wUAAAAAAAAAAP7//xcAAAB/Pz3/////fwAAAAAAAAAAwP//fwAAAPiTD97/////HwMAAAAAAAAA8P//HwAAAD7IM8//////AQAAAAAAAAAA/v//AAAAgIc8//P///93EAAAAAAAAACA//8/AAAA4AHp//z///8xCAAAAAAAAADg//8HAAAAMAzyf/////8ZAgAAAAAAAAD4//8AAAAA/APB/////z/kAAAAAAAAAAD8/x8AAACA/wDw/////x8MAAAAAAAAAAD//wMAAADw/xj8/////w8AAAAAAAAAAMD/fwAAAAD8//7//////wcAAAAAAAAAAPA/EAAAAAD////f/////wEAAAAAAAAAAPQDBAAAAPD//+/n////fwAAAAAAAAAAAPwAAQAAAPz///vD////HwAAAAAAAAAAQD6AAAAAgP////0J/v//BwAAAAAAAAAAgAcAAAAA4P//f/4H////BAAAAAAAAAAA4AEMAAAA/P//v//B//wPAAAAAAAAAAAAeAgGAAAA/v//z3/AH34AAAAAAAAAAAAAPAMMAACA////8w/gg58AAAAAAAAAAAAAfgAAAADg////+QP4wA8IAAAAAAAAAAAAXAAAAAD8//9/PgAe0AcCAAAAAAAAAAAAPgAAAAD///+/BwAH8AMAAAAAAAAAAAAABgAAAMD///9fAMAB9IAAAAAAAAAAAAAAgQEAAOD///+HAHAAOEAAAAAAAAAAAABA2AMAAPj///8/ABgABAgAAAAAAAAAAABg/gEAAPz///8HAAogAAQAAAAAAAAAAADQ/wAAAP////8BAAIIgAMAAAAAAAAAAADwfwAAgL///38AAAAEBAAAAAAAAAAAAAD8/wAAAMD//w8AAGCBAQAAAAAAAAAAAAD/PwAAAMD//wMAAPBgAAAAAAAAAAAAAOD/HwAAAPD/fwAAADgeBAAAAAAAAAAAAPj/AwAAAPz/DwAAAI4XAQAAAAAAAAAAAP//BwAAAP//AQAAAOMNAwAAAAAAAAAAwP//AwAAwP8/AAAAwDmBBgAAAAAAAAAA8P//BwAA4P8PAAAAYIjAhwAAAAAAAAAA/P//AwAA+P8DAAAAECDAUwAAAAAAAAAA/v//AQAA/P8AAAAALADwAAAAAAAAAACA//9/AAAA/z8AAAAAOABOAAAAAAAAAADA//8PAADA/w8AAAAAIAEQAAAAAAAAAADw//8DAADw/wMAAAAAAIAAAAAAAAAAAAD4/38AAAD8/wAAAAAAgCMAAAAAAAAAAAD+/x8AAID/PwQAAAAA4AgAAAAAAAAAAAD//wcAAOD/jwEAAAAAHwMggAAAAAAAAID//wEAAPj/cQAAAADwzwAAIgAAAAAAAID/fwAAAP4/DAAAAAD8PwBAAAAAAAAAAOD/HwAAAP8HAwAAAID/HwAAAAAAAAAAAPj/AwAAwP/hAAAAAPz/BwgAAAAAAAAAAP7/AAAA8H8YAAAAgP//AQAAAAAAAAAAgP8PAAAA/B8GAAAA8P//AAAAAAAAAAAA4P8BAAAA/wMAAAAA/P8/AAAAAAAAAAAA8H8AAACAfwAAAAAA//8PAAAAAAAAAAAA/B8AAADgHwAAAADA//8BAAAAAAAAAAAA/wMAAAD4AwAAAADw/38AAAAAAAAAAADA/wAAAAD8AAAAAAD8/w8AAAAAAAAAAADwHwAAAAAfAAAAAIAH/wEAAAAAAAAAAAD8BQAAAEAAAAAAACDAPwABAAAAAAAAAAD/AAAAAAAAAAAAAADAB0AAAAIAAAAAAMA/AAAAAAAAAAAAAADwADAAAAEAAAAAAOADAAAAAAAAAAAAAAAAAAIAwAAAAAAAAPgAAAAAAAAAAAAAAAADQAAAEAAAAAAAADwAAAAAAAAAAAAAAEAABAAABAAAAAAAAAcAAAAAAAAAAAAAAABgAAAAAwAAAAAA4AEAAAAAAAAAAAAAAAAMAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAACAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

type Arc = { ax: number; ay: number; bx: number; by: number; t0: number };

export function MapDotGrid() {
    const ref = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = ref.current!;
        const box = boxRef.current!;
        const ctx = canvas.getContext("2d")!;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // распаковываем карту в список точек суши
        const bin = atob(MAP_B64);
        const landIdx: number[] = [];
        for (let i = 0; i < COLS * ROWS; i++) {
            if ((bin.charCodeAt(i >> 3) >> (i & 7)) & 1) landIdx.push(i);
        }
        const N = landIdx.length;
        const lx: Float32Array = new Float32Array(N); // позиции точек на экране (без покачивания)
        const ly: Float32Array = new Float32Array(N);
        const z: Float32Array = new Float32Array(N);

        let w = 0, h = 0, raf = 0;
        let visible = true;
        const client = { x: -9999, y: -9999 };
        let mapW = 1000;
        let arcs: Arc[] = [];
        let nextSpawn = 0;
        const active: number[] = [];

        const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, power: 0, target: 0 };

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            w = box.clientWidth;
            h = box.clientHeight;
            if (!w || !h) return;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const cell = Math.max(5, Math.min((w * 0.88) / COLS, (h * 0.9) / ROWS));
            mapW = cell * COLS;
            const ox = (w - mapW) / 2;
            const oy = (h - cell * ROWS) / 2;

            for (let k = 0; k < N; k++) {
                const i = landIdx[k];
                lx[k] = ox + ((i % COLS) + 0.5) * cell;
                ly[k] = oy + (Math.floor(i / COLS) + 0.5) * cell;
            }
            arcs = [];
        };

        const spawnArc = (ts: number) => {
            for (let tries = 0; tries < 40; tries++) {
                const a = Math.floor(Math.random() * N);
                const b = Math.floor(Math.random() * N);
                const dist = Math.hypot(lx[b] - lx[a], ly[b] - ly[a]);
                if (dist < mapW * 0.15 || dist > mapW * 0.5) continue;
                // оба конца подальше от затухающих краёв
                if (lx[a] < w * 0.12 || lx[a] > w * 0.88 || lx[b] < w * 0.12 || lx[b] > w * 0.88) continue;
                arcs.push({ ax: lx[a], ay: ly[a], bx: lx[b], by: ly[b], t0: ts });
                return;
            }
        };

        // координаты мыши переводим в локальные (относительно секции)
        const onMove = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            client.x = e.clientX;
            client.y = e.clientY;
            const mx = e.clientX - r.left;
            const my = e.clientY - r.top;
            if (mouse.target === 0 && mouse.power < 0.01) {
                mouse.x = mx;
                mouse.y = my;
            }
            mouse.tx = mx;
            mouse.ty = my;
            mouse.target = 1;
        };
        const onLeave = () => { mouse.target = 0; };

        const frame = (now: number) => {
            // секция вне экрана: ничего не рисуем
            if (!visible || !w) {
                raf = requestAnimationFrame(frame);
                return;
            }

            // мышь неподвижна, а страница скроллится: пересчитываем позицию
            if (mouse.target === 1) {
                const r = canvas.getBoundingClientRect();
                mouse.tx = client.x - r.left;
                mouse.ty = client.y - r.top;
            }

            const ts = now / 1000;
            const cx = w / 2;
            const cy = h / 2;

            // лёгкое покачивание: небольшой сдвиг и "дыхание" масштаба
            const k = reduce ? 0 : SWAY;
            const swX = Math.sin(ts * 0.22) * 5 * k;
            const swY = Math.sin(ts * 0.17 + 1) * 3.5 * k;
            const sc = 1 + Math.sin(ts * 0.13 + 2) * 0.005 * k;
            const TX = (x: number) => cx + (x - cx) * sc + swX;
            const TY = (y: number) => cy + (y - cy) * sc + swY;

            mouse.x += (mouse.tx - mouse.x) * 0.2;
            mouse.y += (mouse.ty - mouse.y) * 0.2;
            mouse.power += (mouse.target - mouse.power) * 0.1;

            ctx.clearRect(0, 0, w, h);

            // ---------- точки суши ----------
            ctx.fillStyle = `rgba(${BASE},${LAND_A})`;
            ctx.beginPath();
            active.length = 0;

            for (let i = 0; i < N; i++) {
                const sx = TX(lx[i]);
                const sy = TY(ly[i]);

                const dist = Math.hypot(mouse.x - sx, mouse.y - sy);
                let target = 0;
                if (dist < RADIUS) {
                    const k0 = 1 - dist / RADIUS;
                    target = k0 * k0 * (3 - 2 * k0) * mouse.power;
                }
                z[i] += (target - z[i]) * (target > z[i] ? RISE : FALL);

                if (z[i] < 0.003) {
                    z[i] = 0;
                    ctx.moveTo(sx + LAND_R, sy);
                    ctx.arc(sx, sy, LAND_R, 0, Math.PI * 2);
                } else {
                    active.push(sx, sy, z[i]);
                }
            }
            ctx.fill();

            for (let n = 0; n < active.length; n += 3) {
                const zv = active[n + 2];
                const px = cx + (active[n] - cx) * (1 + zv * PARALLAX);
                const py = cy + (active[n + 1] - cy) * (1 + zv * PARALLAX);
                const r = LAND_R * (1 + zv * (DEPTH_SCALE - 1) * 2);
                const a = LAND_A + zv * (HOVER_A - LAND_A);
                ctx.fillStyle = `rgba(${BASE},${a})`;
                ctx.beginPath();
                ctx.arc(px, py, r, 0, Math.PI * 2);
                ctx.fill();
            }

            // ---------- дуги и пакеты ----------
            if (ARCS_ON && !reduce) {
                if (arcs.length < MAX_ARCS && ts >= nextSpawn) {
                    spawnArc(ts);
                    nextSpawn = ts + SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN);
                }
                arcs = arcs.filter((a) => ts - a.t0 < TRAVEL + FADE);

                ctx.lineWidth = 1.2;
                ctx.lineCap = "round";

                for (const a of arcs) {
                    const e = ts - a.t0;
                    const Ax = TX(a.ax), Ay = TY(a.ay);
                    const Bx = TX(a.bx), By = TY(a.by);
                    const len = Math.hypot(Bx - Ax, By - Ay);
                    // контрольная точка: середина, поднятая вверх
                    const Cx = (Ax + Bx) / 2;
                    const Cy = (Ay + By) / 2 - len * LIFT;

                    const pt = (u: number): [number, number] => {
                        const q = 1 - u;
                        return [
                            q * q * Ax + 2 * q * u * Cx + u * u * Bx,
                            q * q * Ay + 2 * q * u * Cy + u * u * By,
                        ];
                    };

                    const p = Math.min(e / TRAVEL, 1);
                    const head = p * p * (3 - 2 * p); // ease in-out
                    let tail = Math.max(0, head - TRAIL);
                    if (e > TRAVEL) {
                        const f = Math.min((e - TRAVEL) / FADE, 1);
                        tail = (1 - TRAIL) + TRAIL * f * f;
                    }

                    // хвост: сегменты, яркость растёт к голове
                    const SEG = 28;
                    let [px0, py0] = pt(tail);
                    for (let s = 1; s <= SEG; s++) {
                        const u = tail + (head - tail) * (s / SEG);
                        const [px1, py1] = pt(u);
                        const al = Math.pow(s / SEG, 1.6) * 0.6;
                        ctx.strokeStyle = `rgba(${GREEN},${al})`;
                        ctx.beginPath();
                        ctx.moveTo(px0, py0);
                        ctx.lineTo(px1, py1);
                        ctx.stroke();
                        px0 = px1;
                        py0 = py1;
                    }

                    // голова пакета
                    if (e < TRAVEL) {
                        const [hx, hy] = pt(head);
                        ctx.fillStyle = `rgba(${GREEN},0.22)`;
                        ctx.beginPath();
                        ctx.arc(hx, hy, 6, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = `rgba(${GREEN},1)`;
                        ctx.beginPath();
                        ctx.arc(hx, hy, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            raf = requestAnimationFrame(frame);
        };

        resize();
        raf = requestAnimationFrame(frame);

        const ro = new ResizeObserver(resize);
        ro.observe(box);
        const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
        io.observe(box);

        window.addEventListener("mousemove", onMove);
        document.addEventListener("mouseleave", onLeave);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <div
            ref={boxRef}
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden animate-fade-in"
            style={{ animationDelay: "0.1s" }}
        >
            <canvas
                ref={ref}
                className="absolute inset-0"
                style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
            />
        </div>
    );
}