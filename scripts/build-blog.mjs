// ============================================================
// Gülsüm Aydın Butik — Blog sayfası üretici
// Google E-Tablo'daki "Blog" sekmesinden her yazı için ayrı, statik bir
// HTML sayfası üretir (Google'ın en iyi okuduğu biçim). Ayrıca:
//   blog/index.html   → blog ana sayfası
//   blog/posts.json   → sitenin ana sayfasındaki "Stil Rehberi" bölümü için
//   sitemap.xml       → Google'a tüm sayfaların listesi
//   robots.txt
// GitHub Actions bunu saatte bir çalıştırır (.github/workflows/blog.yml).
// Yerel deneme: node scripts/build-blog.mjs --blog=blog.csv --products=p.csv --settings=s.csv
// ============================================================
import fs from "node:fs";
import path from "node:path";

const SITE = "https://www.gulsumaydin.com.tr";
const BRAND = "Gülsüm Aydın Butik";
const SHEET_ID = "1X4qYrQXg1Msn_5HnnYadiwWJu2J7z-FmZwMzpA-SbVQ";
const BLOG_GID = "1602734708";
const WA_NUMBER = "908508406128";
const URLS = {
  blog: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${BLOG_GID}`,
  products: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sayfa1`,
  settings: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Ayarlar`,
};
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "blog");

// ---------- yardımcılar ----------
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || "").split("=").slice(1).join("=");

async function load(kind) {
  const local = arg(kind);
  if (local) return fs.readFileSync(local, "utf8");
  const res = await fetch(URLS[kind], { redirect: "follow" });
  if (!res.ok) throw new Error(`${kind} indirilemedi: HTTP ${res.status}`);
  const text = await res.text();
  if (/^\s*<!DOCTYPE html/i.test(text)) throw new Error(`${kind}: tablo herkese açık değil (HTML döndü)`);
  return text;
}

function parseCSV(text) {
  const rows = []; let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(field); field = ""; rows.push(row); row = []; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v && v.trim()));
}
function csvObjects(text) {
  const rows = parseCSV(text); if (!rows.length) return [];
  const h = rows[0].map((x) => x.trim());
  return rows.slice(1).map((r) => Object.fromEntries(h.map((k, i) => [k, (r[i] || "").trim()])));
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const split = (s) => (s ? String(s).split("|").map((x) => x.trim()).filter(Boolean) : []);
const isVideo = (u) => /\.(mp4|webm|mov)(\?|$)/i.test(u || "");
const abs = (u) => (!u ? "" : /^https?:\/\//i.test(u) ? u : `${SITE}/${String(u).replace(/^\/+/, "")}`);
const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
function trDate(iso) { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? `${+m[3]} ${AYLAR[+m[2] - 1]} ${m[1]}` : ""; }
function isoDate(s) { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ""); return m ? `${m[1]}-${m[2]}-${m[3]}` : new Date().toISOString().slice(0, 10); }
function parsePrice(str) {
  let s = String(str ?? "").trim().replace(/[^0-9.,-]/g, ""); if (!s) return 0;
  if (s.includes(",") && s.includes(".")) s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  else if (s.includes(",")) { const p = s.split(","); s = p[p.length - 1].length <= 2 ? p.slice(0, -1).join("") + "." + p[p.length - 1] : s.replace(/,/g, ""); }
  const n = parseFloat(s); return isNaN(n) ? 0 : n;
}
const money = (n) => n.toLocaleString("tr-TR") + " TL";
function slugify(t) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u" };
  return String(t).replace(/[çğıöşüÇĞİIÖŞÜ]/g, (c) => map[c]).toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
const stripTags = (h) => String(h).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

// Panelden gelen içerikte sadece güvenli etiketlere izin ver
const ALLOWED = { p: [], h2: [], h3: [], h4: [], ul: [], ol: [], li: [], strong: [], b: [], em: [], i: [], u: [], br: [], blockquote: [], a: ["href"], img: ["src", "alt"] };
function sanitize(html) {
  html = String(html || "").replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  return html.replace(/<(\/?)([a-zA-Z0-9]+)([^>]*)>/g, (m, close, tag, attrs) => {
    tag = tag.toLowerCase();
    if (tag === "div") tag = "p";
    if (tag === "h1") tag = "h2"; // sayfada tek H1 olmalı (başlık)
    if (!ALLOWED[tag]) return "";
    if (close) return `</${tag}>`;
    const out = [];
    for (const name of ALLOWED[tag]) {
      const mm = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(attrs);
      if (!mm) continue;
      let v = mm[2] ?? mm[3] ?? "";
      if ((name === "href" || name === "src") && !/^(https?:\/\/|\/|#)/i.test(v)) continue; // javascript: vb. engelle
      out.push(`${name}="${esc(v.replace(/&amp;/g, "&"))}"`);
    }
    if (tag === "a") {
      const href = (/href="([^"]*)"/.exec(out.join(" ")) || [])[1] || "";
      if (/^https?:\/\//i.test(href) && !href.startsWith(SITE)) out.push('target="_blank" rel="noopener"');
    }
    if (tag === "img") out.push('loading="lazy"');
    return `<${tag}${out.length ? " " + out.join(" ") : ""}>`;
  });
}

// ---------- verileri oku ----------
const [blogCsv, productCsv, settingsCsv] = await Promise.all([load("blog"), load("products"), load("settings").catch(() => "")]);
const settings = Object.fromEntries(csvObjects(settingsCsv).filter((r) => r.key).map((r) => [r.key, r.value]));
const gaId = (settings.gaId || "").trim();
const pixelId = String(settings.metaPixelId || "").replace(/\D/g, "");

const products = {};
for (const p of csvObjects(productCsv)) {
  if (!p.id) continue;
  const all = split(p.images);
  const photos = all.filter((u) => !isVideo(u)).map(abs);
  const vid = all.find(isVideo);
  const idSlug = slugify(p.id) || "urun";
  products[p.id] = {
    id: p.id, name: p.name, price: parsePrice(p.price), oldPrice: p.oldPrice ? parsePrice(p.oldPrice) : 0, category: p.category || "",
    image: photos[0] || "", photos, video: !photos.length && vid ? abs(vid) : "",
    slug: `${slugify(p.name).slice(0, 50).replace(/-+$/, "")}-${idSlug}`.replace(/^-/, ""),
    shortDescription: p.shortDescription || "", description: p.description || "", fabric: p.fabric || "", fit: p.fit || "",
    measurements: p.measurements || "", modelInfo: p.modelInfo || "", colors: split(p.colors), sizes: split(p.sizes),
  };
}
const productUrl = (p) => `${SITE}/urun/${p.slug}/`;
const idToSlug = Object.fromEntries(Object.values(products).map((p) => [p.id.toLowerCase(), p.slug]));

const allRows = csvObjects(blogCsv);
if (!allRows.length || !("slug" in allRows[0])) throw new Error("Blog sekmesi okunamadı veya başlıklar eksik; mevcut sayfalar korunuyor.");
const posts = allRows
  .filter((r) => r.slug && r.title && /^(1|true|evet)$/i.test(r.published || ""))
  .map((r) => ({ ...r, slug: slugify(r.slug), date: isoDate(r.date), updated: isoDate(r.updated || r.date) }))
  .filter((r, i, a) => r.slug && a.findIndex((x) => x.slug === r.slug) === i)
  .sort((a, b) => b.date.localeCompare(a.date));

// ---------- ortak parçalar ----------
const CSS = `
:root{--serif:'Playfair Display',Georgia,serif;--sans:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;--bg:#FFFCF7;--bg2:#F8F2E9;--ink:#1E1B18;--ink2:#6E655B;--gold:#A6875D;--gold-d:#8A6D45;--line:#EFE7DA;--card:#fff;--sale:#8C3A4B}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:var(--sans);background:var(--bg);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}img{max-width:100%;display:block}
.bar{background:var(--ink);color:#fff;text-align:center;font-size:11px;letter-spacing:.6px;padding:7px 12px}
.top{background:var(--card);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:10}
.top-in{max-width:1080px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{font-family:var(--serif);font-weight:700;font-size:19px;text-decoration:none;line-height:1.1}.brand small{display:block;font-family:var(--sans);font-size:10px;font-weight:500;letter-spacing:1.4px;text-transform:uppercase;color:var(--ink2)}
.nav{display:flex;gap:4px;flex-wrap:wrap}.nav a{text-decoration:none;font-size:13px;font-weight:600;color:var(--ink2);padding:8px 10px;border-radius:8px}.nav a:hover,.nav a.on{color:var(--gold-d);background:var(--bg2)}
.wrap{max-width:760px;margin:0 auto;padding:22px 16px 56px}.wide{max-width:1080px}
.crumb{font-size:12px;color:var(--ink2);margin-bottom:14px}.crumb a{text-decoration:none}.crumb a:hover{color:var(--gold-d)}
h1{font-family:var(--serif);font-size:clamp(27px,5vw,40px);line-height:1.18;margin:0 0 12px;letter-spacing:-.3px}
.meta{font-size:12.5px;color:var(--ink2);display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px}.meta .tag{background:var(--bg2);color:var(--gold-d);font-weight:700;padding:2px 9px;border-radius:10px}
.cover{border-radius:14px;overflow:hidden;background:var(--bg2);aspect-ratio:4/3;margin-bottom:26px}.cover img{width:100%;height:100%;object-fit:cover;object-position:top}
.lead{font-size:17px;color:var(--ink);}
.toc{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 20px;margin:0 0 28px}.toc b{font-size:11px;letter-spacing:.6px;text-transform:uppercase;color:var(--ink2)}.toc ol{margin:8px 0 0;padding-left:18px}.toc li{margin:3px 0;font-size:14px}.toc a{text-decoration:none;color:var(--gold-d)}.toc a:hover{text-decoration:underline}
.content{font-size:16.5px}.content h2{font-family:var(--serif);font-size:25px;line-height:1.25;margin:38px 0 12px;scroll-margin-top:80px}.content h3{font-size:18px;margin:26px 0 8px}
.content p{margin:0 0 16px}.content ul,.content ol{margin:0 0 18px;padding-left:22px}.content li{margin-bottom:8px}.content a{color:var(--gold-d);text-decoration:underline;text-underline-offset:2px}
.content blockquote{margin:22px 0;padding:14px 18px;border-left:3px solid var(--gold);background:var(--bg2);border-radius:0 10px 10px 0}
.content img{border-radius:12px;margin:18px 0}
.sec{margin-top:44px}.sec h2{font-family:var(--serif);font-size:22px;margin:0 0 14px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}@media(min-width:700px){.grid{grid-template-columns:repeat(3,1fr);gap:18px}}
.pc{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;text-decoration:none;display:flex;flex-direction:column;transition:transform .15s}.pc:hover{transform:translateY(-2px)}
.pc .im{aspect-ratio:3/4;background:var(--bg2)}.pc .im img{width:100%;height:100%;object-fit:cover}
.pc .in{padding:10px 12px 12px}.pc .nm{font-size:13px;font-weight:600;line-height:1.35}.pc .pr{font-size:14px;font-weight:700;margin-top:4px}.pc .pr s{color:var(--ink2);font-weight:500;font-size:12px;margin-left:6px}
.bc .im{aspect-ratio:4/3}.bc .nm{font-family:var(--serif);font-size:17px;font-weight:700}.bc .ex{font-size:13px;color:var(--ink2);margin-top:6px}.bc .dt{font-size:11.5px;color:var(--ink2);margin-top:8px}
.list{display:grid;gap:18px}@media(min-width:700px){.list{grid-template-columns:repeat(2,1fr)}}
.cta{margin-top:44px;background:var(--ink);color:#fff;border-radius:16px;padding:26px 22px;text-align:center}.cta h2{font-family:var(--serif);margin:0 0 6px;font-size:22px}.cta p{margin:0 0 16px;color:#d9d2c7;font-size:14px}
.btn{display:inline-block;padding:12px 20px;border-radius:10px;font-weight:600;font-size:14px;text-decoration:none;margin:4px}.btn-g{background:var(--gold);color:#fff}.btn-w{background:#25D366;color:#fff}
.foot{border-top:1px solid var(--line);background:var(--bg2);text-align:center;font-size:11.5px;line-height:1.7;color:var(--ink2);padding:26px 16px}.foot .fl{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;margin-bottom:12px;font-size:12px}.foot a{text-underline-offset:2px}
@media(max-width:600px){.nav a{padding:6px 7px;font-size:12px}.content{font-size:16px}}
`;

function tracking() {
  let s = "";
  if (gaId) s += `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(gaId)}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config",${JSON.stringify(gaId)});</script>`;
  if (pixelId) s += `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');</script>`;
  return s;
}

function page({ title, description, canonical, image, ogType = "website", jsonld = [], body, active }) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
${image ? `<meta property="og:image" content="${esc(image)}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS.trim()}</style>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
${tracking()}
</head>
<body>
<div class="bar">TÜM SİPARİŞLERDE ÜCRETSİZ KARGO · KAPIDA ÖDEME İMKANI</div>
<header class="top"><div class="top-in">
<a class="brand" href="/">${BRAND.replace(" Butik", "")} Butik<small>Tesettür Giyim</small></a>
<nav class="nav"><a href="/">Ana Sayfa</a><a href="/?kategori=T%C3%BCm%20%C3%9Cr%C3%BCnler">Ürünler</a><a href="/blog/"${active === "blog" ? ' class="on"' : ""}>Blog</a></nav>
</div></header>
${body}
<footer class="foot"><div class="fl">${LEGAL.map(([slug, label]) => `<a href="/?sayfa=${slug}">${label}</a>`).join("")}<a href="https://instagram.com/gulsumaydinbutik" rel="noopener" target="_blank">Instagram</a></div>
<div>© ${new Date().getFullYear()} ${BRAND} · Tüm hakları saklıdır.<br>Kapıda ödeme · 14 gün içinde cayma hakkı</div></footer>
</body>
</html>
`;
}

// Sitedeki yasal sayfalar (legal.js) — alt bilgide bağlantı verilir
const LEGAL = [
  ["mesafeli-satis-sozlesmesi", "Mesafeli Satış Sözleşmesi"], ["kvkk-aydinlatma-metni", "KVKK Aydınlatma Metni"],
  ["gizlilik-ve-cerez-politikasi", "Gizlilik ve Çerez Politikası"], ["iade-cayma-ve-degisim", "İade, Cayma ve Değişim"],
  ["teslimat-ve-odeme", "Teslimat ve Ödeme"], ["hakkimizda", "Hakkımızda & İletişim"],
];
const ORG = { "@type": "Organization", name: BRAND, url: SITE + "/", logo: { "@type": "ImageObject", url: SITE + "/icon-512.png" } };

function productCard(p) {
  return `<a class="pc" href="/urun/${p.slug}/"><div class="im">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" width="300" height="400">` : p.video ? `<video src="${esc(p.video)}#t=0.1" muted playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover" aria-label="${esc(p.name)}"></video>` : ""}</div><div class="in"><div class="nm">${esc(p.name)}</div><div class="pr">${money(p.price)}${p.oldPrice > p.price ? `<s>${money(p.oldPrice)}</s>` : ""}</div></div></a>`;
}
function postCard(p) {
  return `<a class="pc bc" href="/blog/${p.slug}/"><div class="im">${p.coverImage ? `<img src="${esc(abs(p.coverImage))}" alt="${esc(p.title)}" loading="lazy" width="400" height="300" style="object-position:top">` : ""}</div><div class="in"><div class="nm">${esc(p.title)}</div>${p.excerpt ? `<div class="ex">${esc(p.excerpt)}</div>` : ""}<div class="dt">${trDate(p.date)}</div></div></a>`;
}

// ---------- yazı sayfaları ----------
fs.mkdirSync(OUT, { recursive: true });
const manifestPath = path.join(OUT, "posts.json");
const oldSlugs = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")).map((p) => p.slug) : [];

for (const post of posts) {
  const url = `${SITE}/blog/${post.slug}/`;
  let html = sanitize(post.content);
  // Yazıdaki ürün bağlantılarını (/?urun=p9) ürünün kendi sayfasına çevir (Google için doğrudan, taranabilir bağlantı)
  html = html.replace(/href="\/\?urun=([^"&#]+)"/g, (m, id) => { const sl = idToSlug[decodeURIComponent(id).toLowerCase()]; return sl ? `href="/urun/${sl}/"` : m; });
  // Başlıklara kimlik ekle (içindekiler listesi ve Google "doğrudan bağlantı" için)
  const toc = []; const used = {};
  html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (m, inner) => {
    let id = slugify(stripTags(inner)) || "bolum"; if (used[id]) id += "-" + ++used[id]; else used[id] = 1;
    toc.push({ id, text: stripTags(inner) });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  // "Sık Sorulan Sorular" bölümünden FAQ yapısal verisi
  const faq = [];
  const faqStart = html.search(/<h2[^>]*>[^<]*(Sık Sorulan|Merak Edilen)/i);
  if (faqStart > -1) {
    const rest = html.slice(faqStart); const end = rest.indexOf("<h2", 5);
    const block = end > -1 ? rest.slice(0, end) : rest;
    const re = /<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g; let m;
    while ((m = re.exec(block))) faq.push({ "@type": "Question", name: stripTags(m[1]), acceptedAnswer: { "@type": "Answer", text: stripTags(m[2]) } });
  }
  const words = stripTags(html).split(" ").length;
  const readMin = Math.max(1, Math.round(words / 200));
  const cover = abs(post.coverImage);
  const related = split(post.relatedProducts).map((id) => products[id]).filter(Boolean);
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const metaTitle = post.metaTitle || `${post.title} | ${BRAND}`;
  const desc = post.metaDescription || post.excerpt || stripTags(html).slice(0, 155);

  const jsonld = [
    { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title.slice(0, 110), description: desc, image: cover ? [cover] : undefined,
      datePublished: post.date, dateModified: post.updated, author: ORG, publisher: ORG, mainEntityOfPage: { "@type": "WebPage", "@id": url },
      inLanguage: "tr-TR", keywords: post.focusKeyword || undefined, wordCount: words },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: SITE + "/blog/" },
      { "@type": "ListItem", position: 3, name: post.title, item: url }] },
  ];
  if (faq.length) jsonld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq });

  const body = `<main class="wrap">
<nav class="crumb" aria-label="Sayfa yolu"><a href="/">Ana Sayfa</a> › <a href="/blog/">Blog</a> › ${esc(post.title)}</nav>
<article>
<h1>${esc(post.title)}</h1>
<div class="meta">${post.tags ? `<span class="tag">${esc(split(post.tags)[0] || post.tags)}</span>` : ""}<time datetime="${post.date}">${trDate(post.date)}</time><span>${readMin} dk okuma</span></div>
${cover ? `<figure class="cover" style="margin:0 0 26px"><img src="${esc(cover)}" alt="${esc(post.title)}" width="800" height="600" fetchpriority="high"></figure>` : ""}
${toc.length > 2 ? `<nav class="toc" aria-label="İçindekiler"><b>İçindekiler</b><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ol></nav>` : ""}
<div class="content">${html}</div>
</article>
${related.length ? `<section class="sec"><h2>Yazıda Geçen Ürünler</h2><div class="grid">${related.map(productCard).join("")}</div></section>` : ""}
<section class="cta"><h2>Sorunuz mu var?</h2><p>Beden, renk ve kumaş hakkında WhatsApp'tan hemen yardımcı olalım.</p>
<a class="btn btn-w" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Merhaba, \"" + post.title + "\" yazınızı okudum, bilgi almak istiyorum.")}" target="_blank" rel="noopener">WhatsApp'tan Yaz</a>
<a class="btn btn-g" href="/">Mağazaya Git</a></section>
${others.length ? `<section class="sec"><h2>Bunları da Okuyun</h2><div class="list">${others.map(postCard).join("")}</div></section>` : ""}
</main>`;

  const dir = path.join(OUT, post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page({ title: metaTitle, description: desc, canonical: url, image: cover, ogType: "article", jsonld, body, active: "blog" }));
}

// Yayından kaldırılan / silinen yazıların sayfalarını temizle
for (const s of oldSlugs) {
  if (!posts.some((p) => p.slug === s) && /^[a-z0-9-]+$/.test(s)) fs.rmSync(path.join(OUT, s), { recursive: true, force: true });
}

// ---------- ürün sayfaları (Google Görseller / Alışveriş / Lens için taranabilir, statik) ----------
const PCSS = `
.pd{display:grid;gap:22px}@media(min-width:800px){.pd{grid-template-columns:1.1fr 1fr;gap:34px;align-items:start}}
.pd-gal{display:grid;gap:10px}.pd-main{border-radius:14px;overflow:hidden;background:var(--bg2);aspect-ratio:3/4}.pd-main img{width:100%;height:100%;object-fit:cover}
.pd-th{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.pd-th img{border-radius:10px;aspect-ratio:3/4;object-fit:cover;width:100%;background:var(--bg2)}
.pd h1{font-size:clamp(24px,4vw,32px)}.pd-pr{font-size:26px;font-weight:700;margin:6px 0 4px}.pd-pr s{font-size:16px;color:var(--ink2);font-weight:500;margin-left:10px}
.pd-note{font-size:13px;color:var(--ink2);margin:0 0 18px}
.pd-spec{width:100%;border-collapse:collapse;margin:18px 0;font-size:14.5px}.pd-spec th{text-align:left;width:34%;color:var(--ink2);font-weight:600;padding:9px 0;border-bottom:1px solid var(--line)}.pd-spec td{padding:9px 0;border-bottom:1px solid var(--line)}
.pd-desc p{margin:0 0 12px}.pd-btns{margin:18px 0 6px}.pd-btns .btn{margin:4px 8px 4px 0}
`;
fs.rmSync(path.join(ROOT, "urun"), { recursive: true, force: true });
const plist = Object.values(products);
for (const p of plist) {
  const url = productUrl(p);
  const imgs = p.photos;
  const desc = stripTags(p.shortDescription || p.description || p.name).slice(0, 155);
  const text = (p.description || p.shortDescription || "").split(/\n+/).map((x) => x.trim()).filter(Boolean);
  const specs = [["Kumaş", p.fabric], ["Kalıp", p.fit], ["Ölçüler", p.measurements], ["Model bilgisi", p.modelInfo], ["Renkler", p.colors.join(", ")], ["Bedenler", p.sizes.join(", ")], ["Kategori", p.category]].filter(([, v]) => v && v !== "—");
  const jsonld = [
    { "@context": "https://schema.org", "@type": "Product", name: p.name, description: stripTags([p.shortDescription, p.description].filter(Boolean).join(" ")).slice(0, 4900) || p.name,
      image: imgs.length ? imgs : undefined, sku: p.id, mpn: p.id, brand: { "@type": "Brand", name: BRAND }, category: p.category || undefined,
      material: p.fabric || undefined, color: p.colors.length ? p.colors.join(", ") : undefined, audience: { "@type": "PeopleAudience", suggestedGender: "female" },
      offers: { "@type": "Offer", url, priceCurrency: "TRY", price: p.price.toFixed(2), priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
        availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", seller: { "@type": "Organization", name: BRAND },
        shippingDetails: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "TRY" }, shippingDestination: { "@type": "DefinedRegion", addressCountry: "TR" } },
        hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy", applicableCountry: "TR", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: 14, returnMethod: "https://schema.org/ReturnByMail", returnFees: "https://schema.org/FreeReturn" } } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE + "/" },
      ...(p.category ? [{ "@type": "ListItem", position: 2, name: p.category, item: `${SITE}/?kategori=${encodeURIComponent(p.category)}` }] : []),
      { "@type": "ListItem", position: p.category ? 3 : 2, name: p.name, item: url }] },
  ];
  const others = plist.filter((x) => x.id !== p.id && x.category === p.category).concat(plist.filter((x) => x.id !== p.id && x.category !== p.category)).slice(0, 6);
  const body = `<style>${PCSS.trim()}</style><main class="wrap wide">
<nav class="crumb" aria-label="Sayfa yolu"><a href="/">Ana Sayfa</a> › ${p.category ? `<a href="/?kategori=${encodeURIComponent(p.category)}">${esc(p.category)}</a> › ` : ""}${esc(p.name)}</nav>
<article class="pd">
<div class="pd-gal">
${imgs.length ? `<div class="pd-main"><img src="${esc(imgs[0])}" alt="${esc(p.name)}" width="800" height="1066" fetchpriority="high"></div>` : p.video ? `<div class="pd-main"><video src="${esc(p.video)}#t=0.1" controls muted playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover" aria-label="${esc(p.name)}"></video></div>` : ""}
${imgs.length > 1 ? `<div class="pd-th">${imgs.slice(1).map((u, i) => `<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="${esc(p.name)} - görsel ${i + 2}" loading="lazy" width="300" height="400"></a>`).join("")}</div>` : ""}
</div>
<div>
<h1>${esc(p.name)}</h1>
<div class="pd-pr">${money(p.price)}${p.oldPrice > p.price ? `<s>${money(p.oldPrice)}</s>` : ""}</div>
<p class="pd-note">Ücretsiz kargo · Kapıda ödeme · 14 gün içinde cayma hakkı</p>
<div class="pd-btns"><a class="btn btn-g" href="/?urun=${encodeURIComponent(p.id)}">Renk / Beden Seç ve Sepete Ekle</a>
<a class="btn btn-w" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Merhaba, \"" + p.name + "\" hakkında bilgi almak istiyorum.")}" target="_blank" rel="noopener">WhatsApp'tan Sor</a></div>
${specs.length ? `<table class="pd-spec">${specs.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>` : ""}
<div class="pd-desc content">${text.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
</div>
</article>
${others.length ? `<section class="sec"><h2>Bunlar da Hoşunuza Gidebilir</h2><div class="grid">${others.map(productCard).join("")}</div></section>` : ""}
</main>`;
  const dir = path.join(ROOT, "urun", p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page({ title: `${p.name} | ${BRAND}`, description: desc, canonical: url, image: imgs[0] || "", ogType: "product", jsonld, body }));
}

// ---------- blog ana sayfası ----------
fs.writeFileSync(path.join(OUT, "index.html"), page({
  title: `Blog — Tesettür Kombin ve Kumaş Rehberi | ${BRAND}`,
  description: "Tesettür kombin önerileri, kumaş rehberleri ve bakım ipuçları. Gülsüm Aydın Butik stil rehberiyle doğru parçayı seçin, uzun yıllar kullanın.",
  canonical: `${SITE}/blog/`, image: posts[0] ? abs(posts[0].coverImage) : `${SITE}/hero-desktop.jpg`,
  jsonld: [{ "@context": "https://schema.org", "@type": "Blog", name: `${BRAND} Blog`, url: `${SITE}/blog/`, publisher: ORG, inLanguage: "tr-TR",
    blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.date })) }],
  active: "blog",
  body: `<main class="wrap wide"><nav class="crumb"><a href="/">Ana Sayfa</a> › Blog</nav>
<h1>Stil Rehberi</h1><p class="lead" style="color:var(--ink2);margin:0 0 26px">Tesettür kombin önerileri, kumaş rehberleri ve bakım ipuçları.</p>
${posts.length ? `<div class="list">${posts.map(postCard).join("")}</div>` : "<p>Yakında yeni yazılar burada olacak.</p>"}</main>`,
}));

// ---------- posts.json (ana sayfadaki bölüm için) ----------
fs.writeFileSync(manifestPath, JSON.stringify(posts.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, coverImage: abs(p.coverImage), date: p.date, tag: split(p.tags)[0] || "" })), null, 1) + "\n");

// ---------- sitemap.xml + robots.txt ----------
const urls = [
  { loc: `${SITE}/`, pri: "1.0" },
  { loc: `${SITE}/blog/`, lastmod: posts.reduce((m, p) => (p.updated > m ? p.updated : m), "") || undefined, pri: "0.8" },
  ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}/`, lastmod: p.updated, pri: "0.7" })),
  ...[...new Set(Object.values(products).map((p) => p.category).filter(Boolean))].map((c) => ({ loc: `${SITE}/?kategori=${encodeURIComponent(c)}`, pri: "0.6" })),
  ...plist.map((p) => ({ loc: productUrl(p), pri: "0.9", images: p.photos })),
];
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `<url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.pri}</priority>${(u.images || []).map((i) => `<image:image><image:loc>${esc(i)}</image:loc></image:image>`).join("")}</url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin.html\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`${posts.length} yazı, ${Object.keys(products).length} ürün → blog, ürün sayfaları ve sitemap üretildi.`);
