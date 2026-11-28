import { ToolsNav, DepthPicker, ReportTools } from "@/components/factguard-tools";
import type { CheckDepth } from "@/lib/factguard-evidence";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, BrainCircuit, Check, CircleAlert, FileText, Image as ImageIcon, Link2, LoaderCircle, Search, ShieldCheck, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisText } from "@/components/analysis-text";
import { analyzeInformation } from "@/lib/analysis.functions";
import { analysisInputSchema, type AnalysisInput, type AnalysisReport } from "@/lib/analysis-schema";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/check")({
  head: () => ({ meta: [
    { title: "Перевірка інформації — FactGuard" },
    { name: "description", content: "Перевір тексти, посилання й зображення з FactGuard: AI-аналіз тверджень, ознак маніпуляції та доступних джерел." },
    { property: "og:title", content: "FactGuard — перевірка інформації" },
    { property: "og:description", content: "Додай матеріал та отримай оцінку, пояснення й джерела." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CheckPage,
});

const modes = [
  { id: "text", title: "Текст", icon: FileText },
  { id: "link", title: "Посилання", icon: Link2 },
  { id: "image", title: "Зображення", icon: ImageIcon },
] as const;
const verdicts = { supported: "Підтверджено джерелами", false: "Спростовано джерелами", mixed: "Суперечлива інформація", unverified: "Недостатньо доказів" };

function CheckPage() {
  const analyze = useServerFn(analyzeInformation);
  const [mode, setMode] = useState<AnalysisInput["mode"]>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [depth, setDepth] = useState<CheckDepth>("deep");
  const [submittedText, setSubmittedText] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  async function selectFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Обери JPG, PNG або WEBP."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Зображення завелике. Максимум — 5 МБ."); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") { setImage(reader.result); setFilename(file.name); setReport(null); } };
    reader.onerror = () => setError("Не вдалося прочитати файл. Обери його ще раз.");
    reader.readAsDataURL(file);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const input = analysisInputSchema.safeParse({ mode, ...(mode === "text" ? { depth } : {}), content: mode === "text" ? text : mode === "link" ? url : image });
    if (!input.success) { setError(input.error.issues[0]?.message ?? "Додай матеріал для перевірки."); return; }
    setError(""); setReport(null); setBusy(true);
    try {
      const response = await analyze({ data: input.data });
      if (response.ok) {
        setSubmittedText(input.data.mode === "text" ? input.data.content : "");
        setReport(response.report);
        requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }));
      } else setError(response.error);
    } catch { setError("Не вдалося отримати результат. Перевір з’єднання і спробуй пізніше."); }
    finally { setBusy(false); }
  }

  return <div className="min-h-screen bg-page font-sans text-foreground">
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:py-6">
      <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-bold sm:text-xl"><img src={mascot} alt="" width={40} height={40} className="h-10 w-10" />FactGuard</Link>
      <nav className="flex items-center gap-5 text-sm font-semibold">
        <Link to="/check" className="hidden border-b-2 border-primary py-2 text-primary sm:block">Перевірити</Link>
        <ThemeToggle /><Button asChild variant="outline" className="glass rounded-full"><Link to="/"><ArrowLeft /> <span className="hidden sm:inline">Про проєкт</span><span className="sm:hidden">Назад</span></Link></Button>
      </nav>
    </header>

    <main className="mx-auto max-w-6xl px-5 pb-14">
      <ToolsNav />
      <section className="relative pb-6 pt-7 sm:pt-10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-positive-soft px-4 py-2 text-xs font-semibold text-positive-foreground"><Sparkles className="h-4 w-4" /> Більше фактів — менше маніпуляцій</span>
          <h1 className="mt-5 max-w-xl font-display text-3xl font-bold leading-snug sm:text-4xl lg:text-5xl">FactGuard —<br />перевіряй, перш ніж <span className="text-gradient">поширити</span></h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">Новина, допис чи підозріле фото? Відділи факти від маніпуляцій.</p>
        </div>
        <img src={mascot} alt="Маскот FactGuard зі щитом" width={1024} height={1024} className="animate-floaty absolute right-0 top-1 hidden w-[34%] max-w-sm lg:block" />

        <form onSubmit={submit} className="glass relative z-10 mt-7 max-w-3xl overflow-hidden rounded-3xl p-3 sm:p-4">
          <DepthPicker value={mode === "text" ? depth : "deep"} onChange={setDepth} disabled={busy} textMode={mode === "text"} />
          <div role="tablist" aria-label="Тип матеріалу" className="flex border-b border-border">
            {modes.map((item) => <Button key={item.id} id={`tab-${item.id}`} aria-controls="analysis-input" role="tab" aria-selected={mode === item.id} type="button" variant="ghost" disabled={busy} onClick={() => { setMode(item.id); setError(""); setReport(null); }} className={`h-11 flex-1 rounded-none border-b-2 px-2 text-xs hover:bg-secondary hover:text-primary sm:flex-none sm:px-5 sm:text-sm ${mode === item.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}><item.icon />{item.title}</Button>)}
          </div>
          <div id="analysis-input" role="tabpanel" aria-labelledby={`tab-${mode}`} className="pt-4">
            {mode === "text" && <><label htmlFor="check-text" className="sr-only">Текст для перевірки</label><textarea id="check-text" value={text} onChange={(event) => setText(event.target.value)} disabled={busy} maxLength={12000} placeholder="Встав текст, який хочеш перевірити…" className="min-h-28 w-full resize-y rounded-2xl border border-input bg-background/80 p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring disabled:opacity-60" /><p className="mt-1 text-right text-xs text-muted-foreground">{text.length.toLocaleString("uk-UA")} / 12 000</p></>}
            {mode === "link" && <><label htmlFor="check-url" className="sr-only">Посилання на статтю</label><input id="check-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} disabled={busy} placeholder="https://…" className="h-14 w-full rounded-2xl border border-input bg-background/80 px-4 text-sm outline-none focus:ring-2 focus:ring-ring" /></>}
            {mode === "image" && <div onDragOver={(event) => { event.preventDefault(); if (!busy) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); if (!busy) void selectFile(event.dataTransfer.files[0]); }} className={`flex min-h-32 items-center justify-center rounded-2xl border border-dashed p-4 ${dragging ? "border-primary bg-secondary" : "border-input bg-background/60"}`}>
              <input ref={fileInput} aria-label="Завантажити зображення" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={busy} onChange={(event) => void selectFile(event.target.files?.[0])} />
              {image ? <div className="flex w-full items-center gap-4"><img src={image} alt="Зображення для перевірки" className="h-24 w-24 rounded-lg object-contain" /><div className="min-w-0 flex-1"><p className="break-all text-sm font-semibold">{filename}</p><p className="mt-1 text-xs text-muted-foreground">Готове до перевірки</p></div><Button title="Прибрати зображення" aria-label="Прибрати зображення" type="button" variant="ghost" size="icon" disabled={busy} onClick={() => { setImage(""); setFilename(""); if (fileInput.current) fileInput.current.value = ""; }}><X /></Button></div>
                : <div className="text-center"><Button type="button" variant="secondary" disabled={busy} onClick={() => fileInput.current?.click()}><Upload /> Обрати зображення</Button><p className="mt-3 text-xs text-muted-foreground">JPG, PNG, WEBP · до 5 МБ</p></div>}
            </div>}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4" /> Звіти зберігаються лише за твоїм вибором</span>
            <Button type="submit" disabled={busy || !(mode === "text" ? text.trim() : mode === "link" ? url.trim() : image)} className="h-12 w-full rounded-full bg-positive px-6 font-bold text-positive-foreground shadow-soft hover:bg-positive/80 sm:w-auto">{busy ? <LoaderCircle className="animate-spin" /> : <Sparkles />}{busy ? "Перевіряємо…" : "Аналізувати"}{!busy && <ArrowRight />}</Button>
          </div>
          {error && <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-destructive-soft p-3 text-sm text-destructive"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
        </form>
      </section>

      <section ref={resultRef} aria-live="polite" aria-busy={busy} className="scroll-mt-6 py-5">
        {busy ? <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center"><BrainCircuit className="h-9 w-9 animate-pulse text-primary" /><h2 className="font-display text-lg font-bold">Шукаємо факти за словами</h2><p className="text-sm text-muted-foreground">Аналізуємо матеріал і звіряємо доступні джерела…</p></div>
          : report ? <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><h2 className="font-display text-2xl font-bold">Результат перевірки</h2><span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${report.verdict === "supported" ? "bg-positive-soft text-positive-foreground" : report.verdict === "false" ? "bg-destructive-soft text-destructive" : "bg-secondary text-primary"}`}>{report.verdict === "supported" ? <Check className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}{verdicts[report.verdict]}</span></div>
            <div className="grid gap-8 py-7 md:grid-cols-[220px_1fr]">
              <div><p className="text-sm font-semibold text-muted-foreground">Маніпулятивні ознаки</p><p className="my-3 font-display text-5xl font-bold text-primary">{report.risk === null ? "—" : `${report.risk}%`}</p>{report.risk !== null && <progress aria-label="Індикатор маніпулятивності" className="analysis-progress" value={report.risk} max={100} />}<p className="mt-3 text-xs leading-relaxed text-muted-foreground">Орієнтовна оцінка AI, не ймовірність правди. Висновок може бути помилковим.</p></div>
              <div><div className="text-base leading-relaxed"><AnalysisText>{report.summary}</AnalysisText></div><div className="mt-5 space-y-4">{report.findings.map((finding, index) => <div key={index} className="border-l-2 border-primary/30 pl-4"><h3 className="text-sm font-bold">{finding.title}</h3><div className="mt-1 text-sm leading-relaxed text-muted-foreground"><AnalysisText>{finding.explanation}</AnalysisText></div></div>)}</div></div>
            </div>
            <div className="border-y border-border py-5"><h3 className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-primary" />Що варто зробити</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{report.recommendation}</p></div>
            <div className="pt-5"><h3 className="text-sm font-bold">Знайдені джерела (не всі є доказами)</h3>{report.sources.length ? <ul className="mt-3 grid gap-3 sm:grid-cols-2">{report.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 break-words text-sm text-primary underline-offset-4 hover:underline"><Link2 className="mt-0.5 h-4 w-4 shrink-0" />{source.title}</a></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">Немає доступних посилань на джерела. Цей результат не є незалежним підтвердженням фактів.</p>}</div>
            <ReportTools report={report} original={submittedText} />
          </div>
          : <div className="flex flex-col items-center justify-center gap-3 border-y border-border py-10 text-center"><Search className="h-8 w-8 text-primary/60" /><h2 className="font-display text-xl font-bold">Що перевіримо сьогодні?</h2><p className="max-w-lg text-sm text-muted-foreground">Не все, що звучить переконливо, є правдою.</p></div>}
      </section>
      <p className="pt-6 text-center text-xs leading-relaxed text-muted-foreground">AI допомагає критично оцінити матеріал, але не замінює перевірку першоджерел.</p>
    </main>
    <footer className="border-t border-border"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />FactGuard · Разом за правдиву інформацію</span><Link to="/" className="hover:text-primary">Про проєкт <span aria-hidden="true">↗</span></Link></div></footer>
  </div>;
}