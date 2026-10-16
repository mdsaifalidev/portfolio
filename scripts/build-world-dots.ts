// Generates public/telemetry/world-dots.json: a dot-matrix world map where every dot carries the
// ISO 3166-1 alpha-2 code of the country it sits in. Run once (or when changing the grid):
//   pnpm exec tsx scripts/build-world-dots.ts
import fs from "node:fs";
import path from "node:path";
import { geoBounds, geoCentroid, geoContains } from "d3-geo";
import countriesCodes from "i18n-iso-countries";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";

const STEP = 2.5; // degrees between dots
const LAT_TOP = 83;
const LAT_BOTTOM = -57; // skip Antarctica
const WIDTH = 1000;
const HEIGHT = Math.round((WIDTH * (LAT_TOP - LAT_BOTTOM)) / 360);

const topo = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "node_modules", "world-atlas", "countries-50m.json"), "utf8"),
) as Topology;
const countries = (feature(topo, topo.objects.countries) as FeatureCollection<Geometry>).features as Feature<Geometry>[];

const shapes = countries
  .map((f) => ({ f, code: countriesCodes.numericToAlpha2(String(f.id ?? "")) ?? "", bounds: geoBounds(f) }))
  .filter((s) => s.code);

const project = (lon: number, lat: number) => [
  Math.round(((lon + 180) / 360) * WIDTH * 10) / 10,
  Math.round(((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * HEIGHT * 10) / 10,
];

const inBounds = ([[w, s], [e, n]]: [[number, number], [number, number]], lon: number, lat: number) =>
  lat >= s && lat <= n && (w <= e ? lon >= w && lon <= e : lon >= w || lon <= e); // handles the antimeridian

const dots: [number, number, string][] = [];
const covered = new Set<string>();

for (let lat = LAT_TOP; lat >= LAT_BOTTOM; lat -= STEP) {
  for (let lon = -180 + STEP / 2; lon < 180; lon += STEP) {
    const hit = shapes.find((s) => inBounds(s.bounds, lon, lat) && geoContains(s.f, [lon, lat]));
    if (!hit) continue;
    const [x, y] = project(lon, lat);
    dots.push([x, y, hit.code]);
    covered.add(hit.code);
  }
}

// Small countries the grid misses still get one dot, so a visit from there can light up.
for (const s of shapes) {
  if (covered.has(s.code)) continue;
  const [lon, lat] = geoCentroid(s.f);
  if (lat < LAT_BOTTOM || lat > LAT_TOP) continue;
  const [x, y] = project(lon, lat);
  dots.push([x, y, s.code]);
  covered.add(s.code);
}

const out = path.join(process.cwd(), "public", "telemetry", "world-dots.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ width: WIDTH, height: HEIGHT, dots }));
console.log(`✓ ${dots.length} dots across ${covered.size} countries → public/telemetry/world-dots.json (${Math.round(fs.statSync(out).size / 1024)} KB)`);
