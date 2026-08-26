import type { Goal } from "./types";
import { isGoalDone, CATEGORY_COLORS } from "./types";

export async function generateShareImage(
  goals: Goal[],
  year: number
): Promise<Blob> {
  const w = 1080;
  const h = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non supporté");

  try {
    await Promise.all([
      document.fonts.load("500 60px Fraunces"),
      document.fonts.load("italic 500 40px Fraunces"),
      document.fonts.load("500 28px Manrope"),
      document.fonts.load("400 24px Manrope"),
    ]);
  } catch {
    // Tant pis, on retombe sur les polices système.
  }

  // Fond
  ctx.fillStyle = "#0F111B";
  ctx.fillRect(0, 0, w, h);
  const glow1 = ctx.createRadialGradient(w * 0.15, h * 0.08, 0, w * 0.15, h * 0.08, 500);
  glow1.addColorStop(0, "rgba(155,147,214,0.10)");
  glow1.addColorStop(1, "rgba(155,147,214,0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, w, h);
  const glow2 = ctx.createRadialGradient(w * 0.85, h * 0.2, 0, w * 0.85, h * 0.2, 450);
  glow2.addColorStop(0, "rgba(232,179,74,0.08)");
  glow2.addColorStop(1, "rgba(232,179,74,0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, w, h);

  const doneGoals = goals.filter(isGoalDone);
  const doneCount = doneGoals.length;
  const total = goals.length;

  // Eyebrow
  ctx.fillStyle = "#7D7A93";
  ctx.font = "500 28px Manrope, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("VISION BOARD", 80, 130);

  // Titre
  ctx.fillStyle = "#EDEAF6";
  ctx.font = "500 84px Fraunces, serif";
  ctx.fillText(`${year}`, 78, 230);

  // Constellation (dispersion de points, dorés si accomplis)
  const skyTop = 300;
  const skyHeight = 260;
  const n = Math.max(total, 1);
  const pts: { x: number; y: number; done: boolean }[] = [];
  for (let i = 0; i < total; i++) {
    const t = n <= 1 ? 0.5 : i / (n - 1);
    const x = 100 + t * (w - 200);
    const y = skyTop + skyHeight / 2 + Math.sin(i * 1.7) * (skyHeight * 0.32);
    pts.push({ x, y, done: isGoalDone(goals[i]) });
  }
  ctx.strokeStyle = "rgba(43,48,72,0.6)";
  ctx.lineWidth = 1.5;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const lit = a.done && b.done;
    ctx.strokeStyle = lit ? "rgba(232,179,74,0.5)" : "rgba(43,48,72,0.6)";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  for (const p of pts) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.done ? 15 : 9, 0, Math.PI * 2);
    ctx.fillStyle = p.done ? "#E8B34A" : "#171A28";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = p.done ? "#E8B34A" : "#4A4E68";
    ctx.stroke();
    if (p.done) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 26, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(232,179,74,0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // Grand chiffre
  const statY = 700;
  ctx.fillStyle = "#E8B34A";
  ctx.font = "500 220px Fraunces, serif";
  ctx.textAlign = "center";
  ctx.fillText(`${doneCount}`, w / 2, statY);

  ctx.fillStyle = "#7D7A93";
  ctx.font = "400 32px Manrope, sans-serif";
  ctx.fillText(
    `objectif${doneCount > 1 ? "s" : ""} accompli${doneCount > 1 ? "s" : ""} sur ${total}`,
    w / 2,
    statY + 60
  );

  // Liste des titres accomplis
  ctx.textAlign = "left";
  let y = statY + 150;
  const listItems = doneGoals.slice(0, 7);
  for (const g of listItems) {
    ctx.fillStyle = CATEGORY_COLORS[g.category];
    ctx.beginPath();
    ctx.arc(90, y - 10, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#EDEAF6";
    ctx.font = "italic 500 36px Fraunces, serif";
    const label =
      g.title.length > 42 ? g.title.slice(0, 40) + "…" : g.title;
    ctx.fillText(label, 118, y);
    y += 62;
  }
  if (doneGoals.length > listItems.length) {
    ctx.fillStyle = "#7D7A93";
    ctx.font = "400 30px Manrope, sans-serif";
    ctx.fillText(`+ ${doneGoals.length - listItems.length} autres`, 118, y);
  }

  // Footer
  ctx.fillStyle = "#4A4E68";
  ctx.font = "400 24px Manrope, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Mon année en étoiles", w / 2, h - 60);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Échec de génération de l'image"));
    }, "image/png");
  });
}
