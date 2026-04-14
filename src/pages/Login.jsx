import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════
   EARTH GLOBE — full space atmosphere
   - Deep space background with nebula clouds
   - 320 twinkling stars + shooting stars
   - Realistic Earth: ocean, continents, atmosphere glow
   - Lat/lon grid (meridians + parallels)
   - 42 world cities with pulsing dots
   - Animated communication arcs between cities
   - Slow majestic rotation
══════════════════════════════════════════════════════════════ */

const CITIES = [
    // Europe
    { name: 'Paris', lat: 48.85, lon: 2.35 },
    { name: 'Londres', lat: 51.50, lon: -0.12 },
    { name: 'Berlin', lat: 52.52, lon: 13.40 },
    { name: 'Madrid', lat: 40.42, lon: -3.70 },
    { name: 'Rome', lat: 41.90, lon: 12.50 },
    { name: 'Moscou', lat: 55.75, lon: 37.62 },
    { name: 'Istanbul', lat: 41.01, lon: 28.95 },
    { name: 'Amsterdam', lat: 52.37, lon: 4.90 },
    { name: 'Stockholm', lat: 59.33, lon: 18.07 },
    { name: 'Varsovie', lat: 52.23, lon: 21.01 },
    // Middle East / Africa
    { name: 'Dubaï', lat: 25.20, lon: 55.27 },
    { name: 'Le Caire', lat: 30.04, lon: 31.24 },
    { name: 'Casablanca', lat: 33.59, lon: -7.62 },
    { name: 'Alger', lat: 36.74, lon: 3.06 },
    { name: 'Lagos', lat: 6.52, lon: 3.38 },
    { name: 'Nairobi', lat: -1.29, lon: 36.82 },
    { name: 'Johannesburg', lat: -26.20, lon: 28.04 },
    { name: 'Téhéran', lat: 35.69, lon: 51.39 },
    // Asia
    { name: 'Mumbai', lat: 19.08, lon: 72.88 },
    { name: 'Delhi', lat: 28.61, lon: 77.20 },
    { name: 'Karachi', lat: 24.86, lon: 67.01 },
    { name: 'Beijing', lat: 39.90, lon: 116.40 },
    { name: 'Shanghai', lat: 31.23, lon: 121.47 },
    { name: 'Tokyo', lat: 35.68, lon: 139.69 },
    { name: 'Séoul', lat: 37.57, lon: 126.98 },
    { name: 'Singapour', lat: 1.35, lon: 103.82 },
    { name: 'Bangkok', lat: 13.75, lon: 100.52 },
    { name: 'Jakarta', lat: -6.21, lon: 106.85 },
    { name: 'Chengdu', lat: 30.57, lon: 104.07 },
    // Oceania
    { name: 'Sydney', lat: -33.87, lon: 151.21 },
    { name: 'Melbourne', lat: -37.81, lon: 144.96 },
    // Americas
    { name: 'New York', lat: 40.71, lon: -74.00 },
    { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
    { name: 'Chicago', lat: 41.88, lon: -87.63 },
    { name: 'Toronto', lat: 43.65, lon: -79.38 },
    { name: 'Miami', lat: 25.77, lon: -80.19 },
    { name: 'Mexico', lat: 19.43, lon: -99.13 },
    { name: 'Bogota', lat: 4.71, lon: -74.07 },
    { name: 'São Paulo', lat: -23.55, lon: -46.63 },
    { name: 'Buenos Aires', lat: -34.61, lon: -58.38 },
    { name: 'Santiago', lat: -33.45, lon: -70.67 },
];

/* Landmass polygons [lat, lon] — 8 regions */
const LANDMASSES = [
    // Europe
    [[36, 5], [36, 28], [42, 34], [52, 30], [60, 28], [66, 22], [66, 4], [58, -4], [50, -5], [44, 0], [36, 5]],
    // Scandinavie extra
    [[56, 8], [58, 5], [62, 4], [70, 14], [72, 22], [68, 28], [60, 26], [56, 14]],
    // Afrique
    [[37, 5], [37, 38], [24, 38], [12, 44], [-1, 42], [-12, 40], [-36, 18], [-36, 16], [-26, -6], [0, -6], [10, -16], [20, -16], [37, 5]],
    // Asie
    [[10, 58], [10, 140], [22, 145], [36, 140], [52, 135], [68, 120], [72, 70], [62, 58], [50, 30], [42, 26], [36, 36], [26, 58], [10, 58]],
    // Asie Sud-Est îles (simplifiée)
    [[-8, 110], [-8, 140], [4, 140], [4, 110], [-8, 110]],
    // Amérique du Nord
    [[15, -87], [15, -74], [24, -80], [30, -80], [36, -74], [46, -64], [58, -64], [70, -84], [70, -132], [55, -130], [42, -124], [26, -110], [15, -92]],
    // Amérique du Sud
    [[10, -74], [10, -50], [-6, -34], [-22, -42], [-56, -68], [-56, -66], [-38, -64], [-20, -40], [0, -50], [10, -60]],
    // Australie
    [[-16, 128], [-16, 146], [-28, 152], [-40, 146], [-40, 114], [-26, 114], [-20, 118]],
    // Groenland
    [[60, -44], [60, -22], [72, -20], [80, -30], [80, -56], [68, -54]],
    // Antarctique (partial)
    [[-68, -60], [-68, 60], [-76, 60], [-76, -60]],
];

/* ── Math helpers ── */
function latLonTo3D(lat, lon, r) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = lon * Math.PI / 180;
    return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
    };
}

function project(x, y, z, rot) {
    const cr = Math.cos(rot), sr = Math.sin(rot);
    const rx = x * cr + z * sr;
    const rz = -x * sr + z * cr;
    return { rx, ry: y, rz };
}

function slerp(ax, ay, az, bx, by, bz, t) {
    const dot = Math.max(-1, Math.min(1, ax * bx + ay * by + az * bz));
    const omega = Math.acos(dot);
    if (Math.abs(omega) < 0.0001) return { x: ax, y: ay, z: az };
    const sinO = Math.sin(omega);
    const sa = Math.sin((1 - t) * omega) / sinO;
    const sb = Math.sin(t * omega) / sinO;
    return { x: sa * ax + sb * bx, y: sa * ay + sb * by, z: sa * az + sb * bz };
}

/* ══════════════════════════════════════════════
   GLOBE CANVAS COMPONENT
══════════════════════════════════════════════ */
function GlobeCanvas({ onReady }) {
    const cvs = useRef(null);
    const cb = useRef(onReady);
    useEffect(() => { cb.current = onReady; }, [onReady]);

    useEffect(() => {
        const canvas = cvs.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let W = canvas.width, H = canvas.height;
        const getR = () => Math.min(canvas.width, canvas.height) * 0.358;
        const getCX = () => canvas.width / 2;
        const getCY = () => canvas.height / 2;

        /* ── Stars (static positions, twinkle in place) ── */
        const stars = Array.from({ length: 380 }, () => {
            const brightness = Math.random();
            return {
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 1200 - 600,
                r: brightness > 0.92 ? 1.4 + Math.random() * 0.8 : 0.3 + Math.random() * 1.0,
                ph: Math.random() * Math.PI * 2,
                sp: 0.004 + Math.random() * 0.016,
                bright: brightness,
                color: brightness > 0.88
                    ? `hsl(${200 + Math.random() * 40},${60 + Math.random() * 30}%,${88 + Math.random() * 12}%)`
                    : `hsl(${190 + Math.random() * 60},${30 + Math.random() * 40}%,${80 + Math.random() * 15}%)`,
            };
        });

        /* ── Shooting stars ── */
        const shooters = [];
        let nextShooter = 180;

        function spawnShooter() {
            const startX = Math.random() * canvas.width * 0.8;
            const startY = Math.random() * canvas.height * 0.35;
            shooters.push({
                x: startX, y: startY,
                vx: 4 + Math.random() * 7,
                vy: 1.5 + Math.random() * 3.5,
                life: 1, maxLife: 1,
                length: 80 + Math.random() * 140,
                alpha: 0.7 + Math.random() * 0.3,
            });
        }

        /* ── Communication arcs ── */
        const arcs = [];
        let nextArc = 60;

        function spawnArc(rot) {
            const R = getR();
            const vis = CITIES.map((c, i) => {
                const p = latLonTo3D(c.lat, c.lon, R);
                const r = project(p.x, p.y, p.z, rot);
                return { i, lat: c.lat, lon: c.lon, rz: r.rz };
            }).filter(c => c.rz > -R * 0.15);

            if (vis.length < 2) return;
            const a = vis[Math.floor(Math.random() * vis.length)];
            let b = vis[Math.floor(Math.random() * vis.length)];
            for (let t = 0; b.i === a.i && t < 10; t++)
                b = vis[Math.floor(Math.random() * vis.length)];
            if (b.i === a.i) return;

            const palette = ['#4fc3f7', '#81d4fa', '#b3e5fc', '#29b6f6', '#80deea', '#80cbc4', '#a5d6a7'];
            arcs.push({
                a: CITIES[a.i], b: CITIES[b.i],
                t: 0,
                speed: 0.006 + Math.random() * 0.010,
                life: 1,
                done: false,
                color: palette[Math.floor(Math.random() * palette.length)],
                width: 0.7 + Math.random() * 1.1,
                glow: Math.random() > 0.6,
            });
        }

        /* ── Nebula clouds (static, subtle) ── */
        const nebulae = [
            { x: 0.12, y: 0.18, r: 0.22, c: 'rgba(30,50,120,0.09)' },
            { x: 0.85, y: 0.25, r: 0.18, c: 'rgba(60,20,90,0.07)' },
            { x: 0.20, y: 0.78, r: 0.16, c: 'rgba(20,60,100,0.08)' },
            { x: 0.78, y: 0.72, r: 0.20, c: 'rgba(10,40,80,0.06)' },
            { x: 0.50, y: 0.10, r: 0.25, c: 'rgba(40,30,100,0.06)' },
        ];

        let frame = 0;
        let rotation = 0;
        let readyCalled = false;

        /* ════════════════════════════
           DRAW FUNCTIONS
        ════════════════════════════ */

        function drawSpace() {
            W = canvas.width; H = canvas.height;

            /* Deep space gradient */
            const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
            bg.addColorStop(0, '#010510');
            bg.addColorStop(0.25, '#020818');
            bg.addColorStop(0.5, '#030c20');
            bg.addColorStop(0.8, '#020818');
            bg.addColorStop(1, '#010510');
            ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

            /* Nebula clouds */
            nebulae.forEach(n => {
                const ng = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, Math.min(W, H) * n.r);
                ng.addColorStop(0, n.c); ng.addColorStop(1, 'transparent');
                ctx.fillStyle = ng;
                ctx.beginPath(); ctx.arc(n.x * W, n.y * H, Math.min(W, H) * n.r, 0, Math.PI * 2); ctx.fill();
            });
        }

        function drawStars() {
            const W2 = canvas.width, H2 = canvas.height;
            stars.forEach(s => {
                const sx = ((s.x + 1000) / 2000) * W2;
                const sy = ((s.y + 600) / 1200) * H2;
                const b = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(s.ph + frame * s.sp));

                ctx.save();
                ctx.globalAlpha = b;

                /* Bright stars get a 4-point sparkle */
                if (s.r > 1.3) {
                    const len = s.r * 5;
                    ctx.strokeStyle = s.color; ctx.lineWidth = 0.5;
                    ctx.globalAlpha = b * 0.5;
                    ctx.beginPath(); ctx.moveTo(sx - len, sy); ctx.lineTo(sx + len, sy); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(sx, sy - len); ctx.lineTo(sx, sy + len); ctx.stroke();
                    ctx.globalAlpha = b;
                    /* Glow */
                    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 4);
                    sg.addColorStop(0, s.color.replace('hsl', 'hsla').replace(')', `,${b * 0.4})`));
                    sg.addColorStop(1, 'transparent');
                    ctx.fillStyle = sg;
                    ctx.beginPath(); ctx.arc(sx, sy, s.r * 4, 0, Math.PI * 2); ctx.fill();
                }

                ctx.fillStyle = s.color;
                ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            });
        }

        function drawShooters() {
            for (let i = shooters.length - 1; i >= 0; i--) {
                const s = shooters[i];
                s.x += s.vx; s.y += s.vy; s.life -= 0.022;
                if (s.life <= 0) { shooters.splice(i, 1); continue; }

                const tailX = s.x - s.vx * (s.length / Math.hypot(s.vx, s.vy));
                const tailY = s.y - s.vy * (s.length / Math.hypot(s.vx, s.vy));

                const sg = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
                sg.addColorStop(0, 'rgba(255,255,255,0)');
                sg.addColorStop(0.7, `rgba(200,230,255,${s.life * s.alpha * 0.5})`);
                sg.addColorStop(1, `rgba(255,255,255,${s.life * s.alpha})`);

                ctx.save();
                ctx.strokeStyle = sg; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y); ctx.stroke();
                /* head glow */
                ctx.globalAlpha = s.life * 0.8;
                const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 5);
                hg.addColorStop(0, 'rgba(255,255,255,0.9)'); hg.addColorStop(1, 'rgba(200,230,255,0)');
                ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(s.x, s.y, 5, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }
        }

        function drawGlobe() {
            const R = getR(), CX = getCX(), CY = getCY();

            /* ── Outer space glow (large, very subtle) ── */
            const spaceGlow = ctx.createRadialGradient(CX, CY, R * 0.88, CX, CY, R * 1.55);
            spaceGlow.addColorStop(0, 'rgba(20,100,255,0.20)');
            spaceGlow.addColorStop(0.35, 'rgba(10,60,180,0.10)');
            spaceGlow.addColorStop(0.7, 'rgba(5,30,100,0.04)');
            spaceGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = spaceGlow;
            ctx.beginPath(); ctx.arc(CX, CY, R * 1.55, 0, Math.PI * 2); ctx.fill();

            /* ── Atmosphere halo ── */
            const atm = ctx.createRadialGradient(CX, CY, R * 0.93, CX, CY, R * 1.14);
            atm.addColorStop(0, 'rgba(80,160,255,0.38)');
            atm.addColorStop(0.4, 'rgba(40,100,220,0.18)');
            atm.addColorStop(0.75, 'rgba(20,60,160,0.07)');
            atm.addColorStop(1, 'transparent');
            ctx.fillStyle = atm;
            ctx.beginPath(); ctx.arc(CX, CY, R * 1.14, 0, Math.PI * 2); ctx.fill();

            /* ── Ocean base ── */
            const ocean = ctx.createRadialGradient(CX - R * 0.30, CY - R * 0.25, R * 0.04, CX, CY, R);
            ocean.addColorStop(0, '#1e5ab4');
            ocean.addColorStop(0.18, '#1548a0');
            ocean.addColorStop(0.42, '#0d3272');
            ocean.addColorStop(0.72, '#081c4a');
            ocean.addColorStop(1, '#040e28');
            ctx.fillStyle = ocean;
            ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fill();

            /* ── Clip everything inside globe ── */
            ctx.save();
            ctx.beginPath(); ctx.arc(CX, CY, R - 0.5, 0, Math.PI * 2); ctx.clip();

            /* Meridians */
            ctx.strokeStyle = 'rgba(80,160,255,0.13)'; ctx.lineWidth = 0.55;
            for (let lon = 0; lon < 360; lon += 15) {
                const theta = (lon * Math.PI / 180) + rotation;
                ctx.beginPath(); let fst = true;
                for (let la = -88; la <= 88; la += 2) {
                    const phi = (90 - la) * Math.PI / 180;
                    const x3 = R * Math.sin(phi) * Math.cos(theta);
                    const y3 = R * Math.cos(phi);
                    const z3 = R * Math.sin(phi) * Math.sin(theta);
                    const pr = project(x3, y3, z3, 0);
                    if (pr.rz >= -R * 0.05) {
                        fst ? ctx.moveTo(CX + pr.rx, CY - pr.ry) : ctx.lineTo(CX + pr.rx, CY - pr.ry);
                        fst = false;
                    } else fst = true;
                }
                ctx.stroke();
            }
            /* Parallels */
            for (let la = -75; la <= 75; la += 15) {
                const phi = (90 - la) * Math.PI / 180;
                ctx.beginPath(); let fst = true;
                for (let lon2 = 0; lon2 <= 360; lon2 += 3) {
                    const theta = (lon2 * Math.PI / 180) + rotation;
                    const x3 = R * Math.sin(phi) * Math.cos(theta);
                    const y3 = R * Math.cos(phi);
                    const z3 = R * Math.sin(phi) * Math.sin(theta);
                    const pr = project(x3, y3, z3, 0);
                    if (pr.rz >= -R * 0.05) {
                        fst ? ctx.moveTo(CX + pr.rx, CY - pr.ry) : ctx.lineTo(CX + pr.rx, CY - pr.ry);
                        fst = false;
                    } else fst = true;
                }
                ctx.stroke();
            }
            /* Equator highlight */
            ctx.strokeStyle = 'rgba(100,200,255,0.22)'; ctx.lineWidth = 0.9;
            ctx.beginPath(); let fstEq = true;
            for (let lon2 = 0; lon2 <= 360; lon2 += 2) {
                const theta = (lon2 * Math.PI / 180) + rotation;
                const x3 = R * Math.cos(theta), y3 = 0, z3 = R * Math.sin(theta);
                const pr = project(x3, y3, z3, 0);
                if (pr.rz >= 0) {
                    fstEq ? ctx.moveTo(CX + pr.rx, CY - pr.ry) : ctx.lineTo(CX + pr.rx, CY - pr.ry);
                    fstEq = false;
                } else fstEq = true;
            }
            ctx.stroke();

            /* ── Continents ── */
            LANDMASSES.forEach(poly => {
                ctx.fillStyle = 'rgba(34,100,58,0.72)';
                ctx.strokeStyle = 'rgba(60,160,80,0.40)';
                ctx.lineWidth = 0.6;
                ctx.beginPath(); let started = false;
                poly.forEach(([la, lo]) => {
                    const phi = (90 - la) * Math.PI / 180;
                    const theta = (lo * Math.PI / 180) + rotation;
                    const x3 = R * Math.sin(phi) * Math.cos(theta);
                    const y3 = R * Math.cos(phi);
                    const z3 = R * Math.sin(phi) * Math.sin(theta);
                    const pr = project(x3, y3, z3, 0);
                    if (pr.rz < -R * 0.12) { started = false; return; }
                    const sx = CX + pr.rx, sy = CY - pr.ry;
                    if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
                });
                ctx.closePath(); ctx.fill(); ctx.stroke();

                /* Land shading — lighter near lit side */
                ctx.fillStyle = 'rgba(60,140,80,0.22)';
                started = false;
                ctx.beginPath();
                poly.forEach(([la, lo]) => {
                    const phi = (90 - la) * Math.PI / 180;
                    const theta = (lo * Math.PI / 180) + rotation;
                    const x3 = R * Math.sin(phi) * Math.cos(theta);
                    const y3 = R * Math.cos(phi);
                    const z3 = R * Math.sin(phi) * Math.sin(theta);
                    const pr = project(x3, y3, z3, 0);
                    if (pr.rz < -R * 0.12 || pr.rx > R * 0.3) { started = false; return; }
                    const sx = CX + pr.rx, sy = CY - pr.ry;
                    if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
                });
                ctx.closePath(); ctx.fill();
            });

            /* ── Ice caps ── */
            ctx.fillStyle = 'rgba(220,240,255,0.55)';
            // North pole cap
            ctx.beginPath(); let fpN = true;
            for (let lo = 0; lo <= 360; lo += 6) {
                const la = 75;
                const phi = (90 - la) * Math.PI / 180;
                const theta = (lo * Math.PI / 180) + rotation;
                const x3 = R * Math.sin(phi) * Math.cos(theta), y3 = R * Math.cos(phi), z3 = R * Math.sin(phi) * Math.sin(theta);
                const pr = project(x3, y3, z3, 0);
                if (pr.rz >= -0) { fpN ? ctx.moveTo(CX + pr.rx, CY - pr.ry) : ctx.lineTo(CX + pr.rx, CY - pr.ry); fpN = false; }
            }
            ctx.closePath(); ctx.fill();

            ctx.restore(); // end clip

            /* ── Terminator shadow (dark side) ── */
            const termX = CX + R * 0.35;
            const shadow = ctx.createRadialGradient(termX, CY, R * 0.3, CX, CY, R * 1.02);
            shadow.addColorStop(0, 'transparent');
            shadow.addColorStop(0.55, 'rgba(2,8,24,0.10)');
            shadow.addColorStop(0.78, 'rgba(2,6,20,0.42)');
            shadow.addColorStop(1, 'rgba(1,4,14,0.72)');
            ctx.fillStyle = shadow;
            ctx.beginPath(); ctx.arc(CX, CY, R * 1.02, 0, Math.PI * 2); ctx.fill();

            /* ── Rim light (edge of globe, lit by "sun") ── */
            const rim = ctx.createRadialGradient(CX - R * 0.28, CY - R * 0.28, R * 0.62, CX, CY, R * 1.01);
            rim.addColorStop(0, 'transparent');
            rim.addColorStop(0.72, 'rgba(60,140,255,0.06)');
            rim.addColorStop(0.9, 'rgba(80,160,255,0.20)');
            rim.addColorStop(1, 'rgba(100,180,255,0.35)');
            ctx.strokeStyle = rim; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.stroke();

            /* ── Specular highlight (top-left) ── */
            const spec = ctx.createRadialGradient(CX - R * 0.38, CY - R * 0.38, 0, CX - R * 0.18, CY - R * 0.18, R * 0.58);
            spec.addColorStop(0, 'rgba(220,240,255,0.22)');
            spec.addColorStop(0.5, 'rgba(180,220,255,0.08)');
            spec.addColorStop(1, 'transparent');
            ctx.fillStyle = spec;
            ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fill();
        }

        function drawCities() {
            const R = getR(), CX = getCX(), CY = getCY();
            CITIES.forEach(city => {
                const p3 = latLonTo3D(city.lat, city.lon, R);
                const pr = project(p3.x, p3.y, p3.z, rotation);
                if (pr.rz < -R * 0.05) return;

                const depth = (pr.rz / R + 1) / 2;  // 0.5..1
                const alpha = 0.35 + depth * 0.60;
                const size = 1.2 + depth * 2.0;
                const pulse = 0.65 + 0.35 * Math.abs(Math.sin(frame * 0.045 + city.lat * 0.1 + city.lon * 0.05));

                const sx = CX + pr.rx, sy = CY - pr.ry;

                /* Outer glow */
                const og = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 5.5);
                og.addColorStop(0, `rgba(80,200,255,${alpha * 0.55 * pulse})`);
                og.addColorStop(0.5, `rgba(40,160,255,${alpha * 0.2 * pulse})`);
                og.addColorStop(1, 'transparent');
                ctx.fillStyle = og;
                ctx.beginPath(); ctx.arc(sx, sy, size * 5.5, 0, Math.PI * 2); ctx.fill();

                /* City dot */
                ctx.fillStyle = `rgba(200,240,255,${alpha * pulse})`;
                ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2); ctx.fill();

                /* Bright core */
                ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9 * pulse})`;
                ctx.beginPath(); ctx.arc(sx, sy, size * 0.45, 0, Math.PI * 2); ctx.fill();
            });
        }

        function drawArcs() {
            const R = getR(), CX = getCX(), CY = getCY();

            for (let i = arcs.length - 1; i >= 0; i--) {
                const arc = arcs[i];
                if (!arc.done) {
                    arc.t = Math.min(1, arc.t + arc.speed);
                    if (arc.t >= 1) arc.done = true;
                } else {
                    arc.life -= 0.018;
                    if (arc.life <= 0) { arcs.splice(i, 1); continue; }
                }

                const p3a = latLonTo3D(arc.a.lat, arc.a.lon, R);
                const p3b = latLonTo3D(arc.b.lat, arc.b.lon, R);
                const pra = project(p3a.x, p3a.y, p3a.z, rotation);
                const prb = project(p3b.x, p3b.y, p3b.z, rotation);
                if (pra.rz < -R * 0.1 || prb.rz < -R * 0.1) { arc.life = 0; continue; }

                const ax = p3a.x / R, ay = p3a.y / R, az = p3a.z / R;
                const bx = p3b.x / R, by = p3b.y / R, bz = p3b.z / R;
                const STEPS = 56;
                const endIdx = Math.floor(arc.t * STEPS);

                ctx.save();
                ctx.globalAlpha = arc.life * 0.88;
                if (arc.glow) {
                    ctx.shadowColor = arc.color; ctx.shadowBlur = 6;
                }
                ctx.strokeStyle = arc.color; ctx.lineWidth = arc.width; ctx.lineCap = 'round';
                ctx.beginPath(); let fst = true;

                for (let k = 0; k <= endIdx; k++) {
                    const t = k / STEPS;
                    const lift = 1 + 0.22 * Math.sin(Math.PI * t);
                    const pt = slerp(ax, ay, az, bx, by, bz, t);
                    const pr = project(pt.x * R * lift, pt.y * R * lift, pt.z * R * lift, rotation);
                    if (pr.rz < -R * 0.05) { fst = true; continue; }
                    const sx = CX + pr.rx, sy = CY - pr.ry;
                    fst ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
                    fst = false;
                }
                ctx.stroke();
                ctx.shadowBlur = 0;

                /* ── Traveling packet (head of arc) ── */
                if (!arc.done && endIdx < STEPS) {
                    const t = endIdx / STEPS;
                    const lift = 1 + 0.22 * Math.sin(Math.PI * t);
                    const pt = slerp(ax, ay, az, bx, by, bz, t);
                    const pr = project(pt.x * R * lift, pt.y * R * lift, pt.z * R * lift, rotation);
                    if (pr.rz >= -R * 0.05) {
                        const px = CX + pr.rx, py = CY - pr.ry;
                        const hg = ctx.createRadialGradient(px, py, 0, px, py, 8);
                        hg.addColorStop(0, 'rgba(255,255,255,1)');
                        hg.addColorStop(0.3, 'rgba(180,240,255,0.7)');
                        hg.addColorStop(1, 'rgba(100,200,255,0)');
                        ctx.fillStyle = hg;
                        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill();
                    }
                }

                /* ── Destination burst ── */
                if (arc.done && arc.life > 0.7) {
                    const burst = 1 - (arc.life - 0.7) / 0.3;
                    const pr = project(p3b.x, p3b.y, p3b.z, rotation);
                    const bsx = CX + pr.rx, bsy = CY - pr.ry;
                    const bg2 = ctx.createRadialGradient(bsx, bsy, 0, bsx, bsy, 14 * burst);
                    bg2.addColorStop(0, `rgba(200,240,255,${0.9 * (1 - burst)})`);
                    bg2.addColorStop(1, 'transparent');
                    ctx.fillStyle = bg2;
                    ctx.beginPath(); ctx.arc(bsx, bsy, 14 * burst, 0, Math.PI * 2); ctx.fill();
                }

                ctx.restore();
            }
        }

        /* ════════════════════════
           MAIN LOOP
        ════════════════════════ */
        function tick() {
            frame++;
            rotation += 0.0022; // slow, majestic

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawSpace();
            drawStars();
            drawShooters();

            /* Shooting star spawn */
            if (frame >= nextShooter) {
                spawnShooter();
                nextShooter = frame + 120 + Math.floor(Math.random() * 220);
            }

            drawGlobe();
            drawCities();

            /* Arc spawn */
            if (frame >= nextArc) {
                spawnArc(rotation);
                nextArc = frame + 40 + Math.floor(Math.random() * 50);
            }
            drawArcs();

            /* CommSight subtle watermark */
            ctx.save();
            ctx.globalAlpha = 0.048;
            const fsize = Math.min(canvas.width * 0.088, 86);
            ctx.font = `700 ${fsize}px 'Cormorant Garamond', Georgia, serif`;
            ctx.fillStyle = '#88aadd';
            ctx.textAlign = 'center';
            ctx.fillText('CommSight', getCX(), getCY() + getR() * 1.38);
            ctx.restore();

            if (!readyCalled && frame > 25) {
                readyCalled = true;
                if (cb.current) cb.current();
            }

            raf = requestAnimationFrame(tick);
        }

        tick();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas ref={cvs} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0,
        }} />
    );
}

/* ══════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════ */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault(); setError(''); setLoading(true);
        try { await login(email, password); navigate('/tasks'); }
        catch (err) { setError(err.response?.data?.error || 'Identifiants incorrects'); }
        finally { setLoading(false); }
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .lg-root{
          position:relative;width:100vw;height:100vh;overflow:hidden;
          display:flex;align-items:center;justify-content:center;
          font-family:'DM Sans',sans-serif;
        }

        /* ── Form card ── */
        .lg-card{
          position:relative;z-index:10;
          width:100%;max-width:400px;padding:0 18px;
          opacity:0;transform:translateY(26px) scale(0.97);
          transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1);
        }
        .lg-card.show{opacity:1;transform:translateY(0) scale(1)}

        .lg-inner{
          background:rgba(255,255,255,0.072);
          backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
          border:1px solid rgba(255,255,255,0.13);
          border-radius:24px;padding:42px 38px 34px;
          box-shadow:
            0 0 0 0.5px rgba(80,160,255,0.12),
            0 36px 90px rgba(0,0,0,0.62),
            0 8px 24px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.13);
          position:relative;overflow:hidden;
        }

        /* Inner shimmer background */
        .lg-inner::after{
          content:'';position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse 60% 40% at 30% 20%,rgba(60,130,255,0.06) 0%,transparent 70%);
        }

        /* Top accent bar */
        .lg-inner::before{
          content:'';position:absolute;top:0;left:42px;right:42px;height:1.5px;
          background:linear-gradient(90deg,transparent,rgba(80,160,255,0.7) 20%,rgba(160,220,255,1) 50%,rgba(80,160,255,0.7) 80%,transparent);
          border-radius:0 0 2px 2px;
        }

        /* Brand row */
        .lg-brand{display:flex;align-items:center;gap:13px;margin-bottom:28px}
        .lg-logo-wrap{
          width:48px;height:48px;border-radius:13px;flex-shrink:0;
          background:linear-gradient(145deg,rgba(20,70,200,0.5),rgba(10,40,140,0.4));
          border:1px solid rgba(80,160,255,0.32);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 14px rgba(0,0,0,0.4),0 0 20px rgba(30,100,255,0.2);
        }
        .lg-brand-name{
          font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;
          color:#deeeff;line-height:1;letter-spacing:.4px;
          text-shadow:0 2px 12px rgba(0,0,0,0.5);
        }
        .lg-brand-tag{font-size:11px;color:rgba(140,200,255,0.48);margin-top:3px;font-weight:300}

        .lg-divider{height:1px;margin-bottom:24px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.09) 35%,rgba(255,255,255,0.09) 65%,transparent)}

        .lg-heading{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600;color:#cce8ff;margin-bottom:5px;letter-spacing:.2px}
        .lg-sub{font-size:12px;color:rgba(130,185,255,0.42);margin-bottom:24px}

        /* Fields */
        .lg-field{margin-bottom:16px}
        .lg-label{display:block;font-size:10px;font-weight:500;color:rgba(150,205,255,0.50);letter-spacing:1px;text-transform:uppercase;margin-bottom:7px;font-family:'DM Mono',monospace}
        .lg-wrap{position:relative}
        .lg-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:rgba(100,170,255,0.36);pointer-events:none;display:flex}
        .lg-input{
          width:100%;padding:12px 14px 12px 40px;
          background:rgba(255,255,255,0.065);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:11px;color:#ddeeff;font-size:13.5px;
          font-family:'DM Sans',sans-serif;outline:none;
          transition:border-color .25s,background .25s,box-shadow .25s;
        }
        .lg-input::placeholder{color:rgba(140,190,255,0.20)}
        .lg-input:hover{border-color:rgba(255,255,255,0.20);background:rgba(255,255,255,0.09)}
        .lg-input:focus{
          border-color:rgba(80,160,255,0.55);
          background:rgba(20,60,160,0.18);
          box-shadow:0 0 0 3px rgba(50,130,255,0.14),0 0 18px rgba(30,100,255,0.12);
        }

        /* Error */
        .lg-error{
          display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:14px;
          background:rgba(200,40,40,0.13);border:1px solid rgba(255,90,90,0.20);
          border-radius:10px;color:#ffaaaa;font-size:13px;
          animation:shake .35s ease;
        }

        /* Submit button */
        .lg-btn{
          width:100%;padding:13px 20px;margin-top:6px;
          background:linear-gradient(135deg,#1242c0 0%,#1a56e8 45%,#1038b8 100%);
          border:1px solid rgba(100,170,255,0.38);border-radius:12px;
          color:#d8eeff;font-size:14px;font-weight:500;
          font-family:'DM Sans',sans-serif;cursor:pointer;
          display:flex;align-items:center;justify-content:center;gap:8px;
          transition:opacity .2s,transform .18s,box-shadow .25s;
          box-shadow:0 4px 28px rgba(14,54,210,0.50),0 1px 4px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.14);
          letter-spacing:.3px;position:relative;overflow:hidden;
        }
        .lg-btn::before{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 60%);
          pointer-events:none;
        }
        .lg-btn:hover:not(:disabled){opacity:.88;transform:translateY(-1px);box-shadow:0 8px 36px rgba(14,54,210,0.65),inset 0 1px 0 rgba(255,255,255,0.14)}
        .lg-btn:active:not(:disabled){transform:scale(.984)}
        .lg-btn:disabled{opacity:.45;cursor:not-allowed}

        /* Footer */
        .lg-foot{display:flex;align-items:center;justify-content:space-between;margin-top:20px}
        .lg-reg-link{font-size:12px;color:rgba(110,175,255,0.44);text-decoration:none;transition:color .2s}
        .lg-reg-link:hover{color:rgba(180,220,255,0.85)}
        .lg-copy{font-size:10px;color:rgba(100,150,220,0.22);font-family:'DM Mono',monospace}

        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
      `}</style>

            <div className="lg-root">
                <GlobeCanvas onReady={() => setVisible(true)} />

                <div className={`lg-card${visible ? ' show' : ''}`}>
                    <div className="lg-inner">

                        <div className="lg-brand">
                            <div className="lg-logo-wrap">
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                                    <circle cx="13" cy="13" r="5.5" stroke="#6ab4ff" strokeWidth="1.4" />
                                    <circle cx="13" cy="13" r="2" fill="#6ab4ff" />
                                    <line x1="13" y1="3.5" x2="13" y2="7.5" stroke="#6ab4ff" strokeWidth="1.4" strokeLinecap="round" />
                                    <line x1="13" y1="18.5" x2="13" y2="22.5" stroke="#6ab4ff" strokeWidth="1.4" strokeLinecap="round" />
                                    <line x1="3.5" y1="13" x2="7.5" y2="13" stroke="#6ab4ff" strokeWidth="1.4" strokeLinecap="round" />
                                    <line x1="18.5" y1="13" x2="22.5" y2="13" stroke="#6ab4ff" strokeWidth="1.4" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <div className="lg-brand-name">CommSight</div>
                                <div className="lg-brand-tag">Communication &amp; Gestion d'entreprise</div>
                            </div>
                        </div>

                        <div className="lg-divider" />
                        <div className="lg-heading">Connexion</div>
                        <div className="lg-sub">Accédez à votre espace de travail mondial</div>

                        <form onSubmit={handleSubmit}>
                            <div className="lg-field">
                                <label className="lg-label">Adresse email</label>
                                <div className="lg-wrap">
                                    <span className="lg-icon"><Mail size={14} /></span>
                                    <input className="lg-input" type="email" value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="vous@entreprise.com" required />
                                </div>
                            </div>

                            <div className="lg-field">
                                <label className="lg-label">Mot de passe</label>
                                <div className="lg-wrap">
                                    <span className="lg-icon"><Lock size={14} /></span>
                                    <input className="lg-input" type="password" value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••" required />
                                </div>
                            </div>

                            {error && (
                                <div className="lg-error">
                                    <AlertCircle size={14} style={{ flexShrink: 0 }} /> {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="lg-btn">
                                {loading
                                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        style={{ animation: 'spin .8s linear infinite' }}>
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2" />
                                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    : <><span>Se connecter</span><ArrowRight size={15} /></>
                                }
                            </button>
                        </form>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-blue-200">
                                    Se souvenir de moi
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-300 hover:text-blue-200 transition-colors font-semibold"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>


                        <div className="lg-foot">
                            <Link to="/register" className="lg-reg-link">Créer un compte employé</Link>
                            <span className="lg-copy">© 2026 CommSight</span>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}                                                                                               