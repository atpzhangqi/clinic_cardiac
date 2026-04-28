import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const assetDir = path.resolve(__dirname, "../c3_assets");
const outputPath = path.join(outDir, "C3_coronary_anatomy_3slides.pptx");

async function readImageBlob(imagePath) {
  const bytes = await fs.readFile(imagePath);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

const W = 1280;
const H = 720;
const colors = {
  ink: "#13212F",
  muted: "#5B6675",
  bg: "#F7FAFC",
  panel: "#FFFFFF",
  red: "#B91C1C",
  blue: "#1D4ED8",
  teal: "#0F766E",
  line: "#D8E1EA",
  softRed: "#FEE2E2",
  softBlue: "#DBEAFE",
  softTeal: "#CCFBF1",
  dark: "#0B1725",
};

function addText(slide, text, box, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "rect",
    position: box,
    fill: opts.fill ?? "#FFFFFF00",
    line: { fill: "#FFFFFF00", width: 0 },
  });
  shape.text = text;
  shape.text.typeface = opts.typeface ?? "Aptos";
  shape.text.fontSize = opts.fontSize ?? 24;
  shape.text.color = opts.color ?? colors.ink;
  shape.text.bold = Boolean(opts.bold);
  shape.text.alignment = opts.alignment ?? "left";
  shape.text.verticalAlignment = opts.verticalAlignment ?? "top";
  shape.text.autoFit = opts.autoFit ?? "shrinkText";
  shape.text.insets = opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 };
  return shape;
}

function addBadge(slide, text, x, y, fill, color = colors.ink) {
  const badge = slide.shapes.add({
    geometry: "roundRect",
    adjustmentList: [{ name: "adj", formula: "val 18000" }],
    position: { left: x, top: y, width: 152, height: 38 },
    fill,
    line: { fill, width: 1 },
  });
  badge.text = text;
  badge.text.typeface = "Aptos";
  badge.text.fontSize = 18;
  badge.text.bold = true;
  badge.text.color = color;
  badge.text.alignment = "center";
  badge.text.verticalAlignment = "middle";
  badge.text.insets = { left: 8, right: 8, top: 4, bottom: 4 };
  return badge;
}

function addCard(slide, x, y, w, h, title, body, accent, fill) {
  slide.shapes.add({
    geometry: "rect",
    position: { left: x, top: y, width: 6, height: h },
    fill: accent,
    line: { fill: accent, width: 0 },
  });
  slide.shapes.add({
    geometry: "roundRect",
    adjustmentList: [{ name: "adj", formula: "val 6000" }],
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { fill: colors.line, width: 1 },
  });
  addText(slide, title, { left: x + 24, top: y + 20, width: w - 48, height: 30 }, {
    fontSize: 24,
    bold: true,
    color: accent,
  });
  addText(slide, body, { left: x + 24, top: y + 62, width: w - 48, height: h - 80 }, {
    fontSize: 19,
    color: colors.ink,
  });
}

function addHeader(slide, title, subtitle = "C3.pdf | Coronary artery anatomy") {
  slide.background.fill = colors.bg;
  addText(slide, title, { left: 56, top: 42, width: 820, height: 50 }, {
    fontSize: 34,
    bold: true,
  });
  addText(slide, subtitle, { left: 58, top: 92, width: 560, height: 24 }, {
    fontSize: 15,
    color: colors.muted,
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: 56, top: 126, width: 1168, height: 1 },
    fill: colors.line,
    line: { fill: colors.line, width: 0 },
  });
}

const deck = Presentation.create({
  slideSize: { width: W, height: H },
});

// Slide 1
{
  const slide = deck.slides.add();
  addHeader(slide, "冠状动脉解剖总览");

  const hero = slide.images.add({
    blob: await readImageBlob(path.join(assetDir, "p2_1_Image26.png")),
    fit: "contain",
    alt: "Coronary artery anatomy diagram from source PDF",
  });
  hero.position = { left: 704, top: 154, width: 500, height: 458 };

  addBadge(slide, "终末动脉", 72, 162, colors.softRed, colors.red);
  addBadge(slide, "舒张期供血", 242, 162, colors.softBlue, colors.blue);
  addBadge(slide, "主动脉根部起源", 412, 162, colors.softTeal, colors.teal);

  addText(slide, "两大主干入口", { left: 72, top: 236, width: 300, height: 34 }, {
    fontSize: 25,
    bold: true,
  });
  addText(slide,
    "Left main stem 分为 LAD 与 LCx；RCA 单独起源于主动脉根部。冠脉主要在心脏舒张期获得灌注，因此心率、舒张压和灌注压会影响心肌供血。",
    { left: 72, top: 280, width: 560, height: 104 },
    { fontSize: 22, color: colors.ink }
  );

  addCard(
    slide,
    72,
    430,
    560,
    122,
    "学习重点",
    "把“血管 - 分支 - 供血区域 - 相关心梗/传导异常”连在一起记忆，能更快从 ECG 区域定位推回可能受累冠脉。",
    colors.red,
    colors.panel
  );
}

// Slide 2
{
  const slide = deck.slides.add();
  addHeader(slide, "三大冠脉：分支、供血与心梗定位");

  const rows = [
    {
      name: "RCA",
      accent: colors.blue,
      fill: colors.softBlue,
      branch: "SA nodal a.、right marginal a.、AV nodal a.、PDA",
      supply: "右房、右室、后间隔、双室下壁；常供应 SA/AV node",
      mi: "下壁/后壁/RV MI；近端 RCA 可见逸搏、AV block",
    },
    {
      name: "LAD",
      accent: colors.red,
      fill: colors.softRed,
      branch: "diagonal branches、septal branches",
      supply: "前外侧 LV、前 2/3 室间隔",
      mi: "前壁/侧壁/间隔 MI；可伴 RBBB/LBBB 或 complete heart block",
    },
    {
      name: "LCx",
      accent: colors.teal,
      fill: colors.softTeal,
      branch: "obtuse marginal branches；左优势时可发出 PDA",
      supply: "左房、后外侧 LV；左优势时供应下壁/后间隔",
      mi: "后壁/侧壁；左优势闭塞可造成更广泛 LV 损伤",
    },
  ];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const y = 164 + i * 160;
    slide.shapes.add({
      geometry: "roundRect",
      adjustmentList: [{ name: "adj", formula: "val 5000" }],
      position: { left: 56, top: y, width: 1168, height: 132 },
      fill: colors.panel,
      line: { fill: colors.line, width: 1 },
    });
    slide.shapes.add({
      geometry: "roundRect",
      adjustmentList: [{ name: "adj", formula: "val 12000" }],
      position: { left: 82, top: y + 28, width: 112, height: 76 },
      fill: r.fill,
      line: { fill: r.fill, width: 0 },
    });
    addText(slide, r.name, { left: 82, top: y + 45, width: 112, height: 38 }, {
      fontSize: 30,
      bold: true,
      alignment: "center",
      verticalAlignment: "middle",
      color: r.accent,
    });
    addText(slide, "主要分支", { left: 228, top: y + 24, width: 156, height: 28 }, {
      fontSize: 17,
      bold: true,
      color: colors.muted,
    });
    addText(slide, r.branch, { left: 228, top: y + 55, width: 260, height: 56 }, {
      fontSize: 19,
    });
    addText(slide, "供血区域", { left: 526, top: y + 24, width: 156, height: 28 }, {
      fontSize: 17,
      bold: true,
      color: colors.muted,
    });
    addText(slide, r.supply, { left: 526, top: y + 55, width: 278, height: 56 }, {
      fontSize: 19,
    });
    addText(slide, "相关表现", { left: 850, top: y + 24, width: 156, height: 28 }, {
      fontSize: 17,
      bold: true,
      color: colors.muted,
    });
    addText(slide, r.mi, { left: 850, top: y + 55, width: 318, height: 56 }, {
      fontSize: 19,
    });
  }
}

// Slide 3
{
  const slide = deck.slides.add();
  addHeader(slide, "冠脉优势型：由 PDA 来源决定");

  const ecg = slide.images.add({
    blob: await readImageBlob(path.join(assetDir, "p2_2_Image28.jpg")),
    fit: "cover",
    alt: "ECG territory reference image from source PDF",
  });
  ecg.position = { left: 56, top: 452, width: 1168, height: 176 };

  addCard(
    slide,
    64,
    166,
    352,
    186,
    "右优势：约 70%",
    "PDA 来自 RCA。RCA 血栓可影响 RV、下壁/后壁，以及 SA 或 AV node；怀疑 RV infarct 时需谨慎使用 GTN。",
    colors.blue,
    colors.panel
  );
  addCard(
    slide,
    464,
    166,
    352,
    186,
    "左优势：约 10%",
    "PDA 来自 LCx。若左侧优势且发生闭塞，可能造成更广泛的后壁、下壁、侧壁 LV 损伤，并累及室间隔。",
    colors.red,
    colors.panel
  );
  addCard(
    slide,
    864,
    166,
    352,
    186,
    "混合供血：约 20%",
    "PDA 或后下壁供血由 RCA 与 LCx 共同参与。定位时应结合 ECG 区域、血流动力学和传导改变。",
    colors.teal,
    colors.panel
  );

  addText(slide, "临床记忆线索", { left: 72, top: 382, width: 220, height: 30 }, {
    fontSize: 22,
    bold: true,
  });
  addText(slide,
    "先看 ECG 受累区域，再推测冠脉；同时判断 PDA 来源，因为优势型会改变下壁/后壁梗死时可能伴随的结构损伤。",
    { left: 292, top: 382, width: 832, height: 42 },
    { fontSize: 21, color: colors.ink }
  );
}

await fs.mkdir(outDir, { recursive: true });
for (let i = 0; i < deck.slides.count; i++) {
  const slide = deck.slides.getItem(i);
  const png = await deck.export({ slide, format: "png", scale: 1 });
  const previewPath = path.join(outDir, `preview_${String(i + 1).padStart(2, "0")}.png`);
  if (typeof png.save === "function") {
    await png.save(previewPath);
  } else if (typeof png.arrayBuffer === "function") {
    await fs.writeFile(previewPath, Buffer.from(await png.arrayBuffer()));
  } else if (png instanceof Uint8Array) {
    await fs.writeFile(previewPath, png);
  } else if (png?.bytes instanceof Uint8Array) {
    await fs.writeFile(previewPath, png.bytes);
  } else if (png?.buffer instanceof ArrayBuffer) {
    await fs.writeFile(previewPath, Buffer.from(png.buffer));
  } else if (typeof png?.dataUrl === "string") {
    await fs.writeFile(previewPath, Buffer.from(png.dataUrl.split(",").pop(), "base64"));
  } else {
    await fs.writeFile(
      path.join(outDir, `preview_${String(i + 1).padStart(2, "0")}_inspect.json`),
      JSON.stringify({ type: typeof png, keys: png ? Object.keys(png) : [] }, null, 2)
    );
  }
}

const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(outputPath);
console.log(outputPath);
