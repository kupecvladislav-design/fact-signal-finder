import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BarChart3, Eye, FileText, Image as ImageIcon, Link2, Mail, ShieldCheck, Sparkles, TriangleAlert, Users, Zap, Send, Youtube, Check } from "lucide-react";
import hero from "@/assets/hero-magnifier.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindGuard — твій цифровий захист від маніпуляцій" },
      { name: "description", content: "Перевіряй новини, тексти та зображення на ознаки дезінформації й маніпуляцій за кілька секунд." },
      { property: "og:title", content: "MindGuard — захист від маніпуляцій" },
      { property: "og:description", content: "Перевіряй новини, тексти та зображення на ознаки дезінформації." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Zap, t: "Швидко", d: "Результат за кілька секунд" },
  { icon: ShieldCheck, t: "Надійно", d: "На основі сучасних алгоритмів аналізу" },
  { icon: BarChart3, t: "Просто", d: "Чітке пояснення та рівень ризику" },
  { icon: Users, t: "Для всіх", d: "Пояснення навіть для підлітків" },
];
const tabs = [
  { id: "text", label: "Текст", icon: FileText, ph: "Вставте текст, який хочете перевірити..." },
  { id: "link", label: "Посилання", icon: Link2, ph: "Вставте посилання на статтю..." },
  { id: "img", label: "Зображення", icon: ImageIcon, ph: "Вставте посилання на зображення..." },
];

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 font-display text-xl font-bold">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Eye className="h-5 w-5" /></span>
      <span>Mind<span className="text-accent">Guard</span></span>
    </a>
  );
}

function Index() {
  const [tab, setTab] = useState("text");
  const cur = tabs.find((x) => x.id === tab)!;
  return (
    <div className="min-h-screen bg-page font-sans text-foreground">
      <div className="mx-auto max-w-7xl px-5">
        <header className="flex items-center justify-between py-6">
          <Logo />
          <nav className="hidden gap-10 text-sm font-medium md:flex">
            <a href="#check" className="border-b-2 border-primary pb-1 text-primary">Перевірити</a>
            <a href="#how" className="hover:text-primary">Історія</a>
            <a href="#how" className="hover:text-primary">Про нас</a>
            <a href="#how" className="hover:text-primary">FAQ</a>
          </nav>
          <button className="flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition"><Mail className="h-4 w-4" /> Увійти</button>
        </header>

        <section className="grid items-center gap-10 py-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">Більше фактів — менше маніпуляцій <Sparkles className="h-4 w-4 text-accent" /></span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">MindGuard — твій цифровий захист <span className="text-accent">від маніпуляцій</span></h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">Перевіряй новини, тексти та зображення на ознаки дезінформації й маніпуляцій за кілька секунд.</p>
            <div id="check" className="glass mt-8 rounded-3xl p-4">
              <div className="flex gap-6 border-b border-border px-2 text-sm">
                {tabs.map((x) => (
                  <button key={x.id} onClick={() => setTab(x.id)} className={`flex items-center gap-2 pb-3 ${tab === x.id ? "border-b-2 border-primary font-semibold text-primary" : "text-muted-foreground"}`}>
                    <x.icon className="h-4 w-4" />{x.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input placeholder={cur.ph} className="min-w-0 flex-1 rounded-2xl bg-background px-5 py-3.5 outline-none ring-primary focus:ring-2" />
                <button className="flex items-center justify-center gap-2 rounded-2xl bg-secondary px-6 py-3.5 font-semibold text-secondary-foreground hover:brightness-95"><Sparkles className="h-4 w-4" /> Аналізувати <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <img src={hero} alt="Лупа над документом" width={1024} height={1024} className="animate-floaty w-full" />
            <span className="absolute left-0 top-10 rounded-2xl bg-primary px-5 py-2 font-display font-bold text-primary-foreground shadow-soft">Фейк?</span>
            <span className="absolute right-0 top-1/3 rounded-2xl bg-primary/80 px-4 py-2 font-semibold text-primary-foreground shadow-soft">Маніпуляція?</span>
            <span className="absolute bottom-16 right-4 flex items-center gap-1 rounded-2xl bg-secondary px-4 py-2 font-semibold text-secondary-foreground shadow-soft">Перевірено <Check className="h-4 w-4" /></span>
          </div>
        </section>

        <section className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={f.t} className="glass flex items-center gap-4 rounded-3xl p-5">
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${i === 2 ? "bg-secondary text-secondary-foreground" : "bg-muted text-primary"}`}><f.icon className="h-6 w-6" /></span>
              <div><p className="font-bold">{f.t}</p><p className="text-sm text-muted-foreground">{f.d}</p></div>
            </div>
          ))}
        </section>

        <section id="how" className="grid gap-6 py-10 lg:grid-cols-[1fr_1.4fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl font-bold">Як це працює?</h2>
            <ol className="mt-6 space-y-4">
              {["Встав текст, посилання або завантаж зображення.", "Запусти аналіз одним кліком.", "Отримай оцінку, пояснення та джерела."].map((s, i) => (
                <li key={s} className="flex items-center gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>{s}</li>
              ))}
            </ol>
            <button className="mt-6 flex items-center gap-2 rounded-full border border-accent px-5 py-2.5 font-semibold hover:bg-secondary">Дізнатися більше <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="glass grid gap-6 rounded-3xl p-6 sm:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-destructive-soft px-3 py-1 text-sm font-semibold text-destructive"><TriangleAlert className="h-4 w-4" /> Високий ризик</span>
              <p className="mt-3 font-display text-6xl font-bold text-primary">85%</p>
              <p className="text-muted-foreground">ймовірність маніпуляції</p>
            </div>
            <div className="sm:border-l sm:border-border sm:pl-6">
              <p className="font-bold">Чому?</p>
              <p className="mt-2 text-sm text-muted-foreground">У тексті виявлено емоційне забарвлення, неперевірені твердження та маніпулятивні загадки.</p>
              <button className="mt-4 flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary">Переглянути деталі <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="bg-cta rounded-3xl p-6 shadow-soft">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl font-bold">Захисти себе від дезінформації!</h3>
            <p className="mt-2 text-sm">Будь поінформованим. Перевіряй. Думай.</p>
            <a href="#check" className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 font-semibold text-secondary-foreground">Перейти до перевірки <ArrowRight className="h-4 w-4" /></a>
          </div>
        </section>
      </div>

      <footer className="mt-6 border-t border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-sm md:flex-row">
          <div className="flex items-center gap-4"><Logo /><span className="text-muted-foreground">Разом за правдиву інформацію ♥</span></div>
          <div className="flex items-center gap-6 text-muted-foreground">
            <a href="#">Політика конфіденційності</a><a href="#">Умови використання</a><a href="#">Контакти</a>
            <Send className="h-5 w-5 text-primary" /><Youtube className="h-5 w-5 text-primary" />
          </div>
        </div>
      </footer>
    </div>
  );
}
