import { ToolsNav } from "@/components/factguard-tools";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, FileText, Heart, Image as ImageIcon, Link2, Search, ShieldCheck, Sparkles, Gauge, Users, Zap, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import mascot from "@/assets/mascot.png";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FactGuard — перевіряй інформацію, а не вір на слово" },
      { name: "description", content: "FactGuard — AI-платформа, що аналізує тексти, посилання та зображення на ознаки фейків, маніпуляцій і пропаганди." },
      { property: "og:title", content: "FactGuard — AI-перевірка інформації" },
      { property: "og:description", content: "Дізнайся, чи правдива інформація і наскільки вона маніпулятивна." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const what = [
  { icon: FileText, t: "Тексти", d: "Новини, пости й повідомлення — шукаємо емоційний тиск, неперевірені твердження та підміну фактів." },
  { icon: Link2, t: "Посилання", d: "Аналізуємо статтю та джерело: репутацію сайту, дату, автора й посилання на першоджерела." },
  { icon: ImageIcon, t: "Зображення", d: "Виявляємо ознаки монтажу, генерації AI та фото, вирване з контексту." },
];
const steps = [
  { t: "Обробляємо", d: "AI розбирає матеріал на окремі твердження." },
  { t: "Перевіряємо", d: "Звіряємо факти з надійними джерелами." },
  { t: "Оцінюємо", d: "Рахуємо рівень маніпулятивності від 0 до 100%." },
  { t: "Пояснюємо", d: "Простими словами — чому так і де правда." },
];
const values = [
  { icon: Zap, t: "Швидко", d: "Результат за секунди" },
  { icon: ShieldCheck, t: "Чесно", d: "Тільки перевірені джерела" },
  { icon: Gauge, t: "Зрозуміло", d: "Шкала ризику та пояснення" },
  { icon: Users, t: "Для всіх", d: "Навіть для підлітків" },
];

function Index() {
  return (
    <div className="min-h-screen bg-page font-sans text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <a href="#" className="flex items-center gap-2 font-display text-xl font-bold">
          <img src={mascot} alt="" width={40} height={40} className="h-10 w-10" /> FactGuard
        </a>
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <a href="#about" className="hover:text-primary">Про проєкт</a>
          <a href="#how" className="hover:text-primary">Як це працює</a>
          <a href="#mission" className="hover:text-primary">Місія</a>
        </nav>
        <div className="flex items-center gap-3"><ThemeToggle /><a href="#join" className="glass rounded-full px-5 py-2 text-sm font-semibold">Скоро запуск</a></div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
      <ToolsNav />
        <section className="grid items-center gap-8 py-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"><Sparkles className="h-4 w-4 text-primary" /> AI-платформа для перевірки інформації</span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl">FactGuard — перевіряй інформацію, а не вір <span className="text-gradient italic">на слово</span></h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">Ми створюємо сервіс, який обробляє новини, тексти та зображення і показує: це фейк чи правда, та наскільки матеріал маніпулятивний.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#about" className="bg-cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-primary-foreground shadow-soft transition hover:scale-[1.03]"><Search className="h-5 w-5" /> Дізнатися про проєкт <ArrowRight className="h-4 w-4" /></a>
              <a href="#how" className="font-semibold hover:text-primary">Як це працює →</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-8 rounded-full bg-primary/20 blur-3xl" />
            <img src={mascot} alt="Маскот FactGuard зі щитом" width={1024} height={1024} className="animate-floaty relative w-full" />
          </div>
        </section>

        <section id="about" className="py-14">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Що ми <span className="text-gradient">перевіряємо</span></h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Дезінформація поширюється швидше за правду. FactGuard допоможе зупинитися й подумати перед тим, як повірити чи поширити.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {what.map((w) => (
              <div key={w.t} className="glass rounded-3xl p-7 transition hover:-translate-y-1">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary"><w.icon className="h-6 w-6" /></span>
                <h3 className="mt-5 font-display text-xl font-bold">{w.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="py-14">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Як це <span className="text-gradient">працює</span></h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.t} className="glass relative rounded-3xl p-6">
                <span className="font-display text-5xl font-bold text-primary/25">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="glass mt-6 grid items-center gap-6 rounded-3xl p-7 md:grid-cols-[auto_1fr]">
            <div className="text-center">
              <p className="font-display text-6xl font-bold text-gradient">72%</p>
              <p className="text-sm font-semibold text-destructive">Високий ризик</p>
            </div>
            <div>
              <p className="flex items-center gap-2 font-bold"><BrainCircuit className="h-5 w-5 text-primary" /> Приклад результату</p>
              <p className="mt-2 text-muted-foreground">«У тексті виявлено емоційний тиск, відсутність першоджерел і узагальнення. Ймовірність маніпуляції — висока». Саме так виглядатиме пояснення FactGuard.</p>
            </div>
          </div>
        </section>

        <section id="mission" className="grid gap-6 py-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="glass rounded-3xl p-8">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-3xl font-bold">Наша місія</h2>
            <p className="mt-4 text-muted-foreground">Зробити критичне мислення простим і доступним для кожного. Ми віримо у свідоме суспільство, де люди перевіряють, а не вірять на слово.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.t} className="glass flex items-center gap-4 rounded-3xl p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary text-primary"><v.icon className="h-5 w-5" /></span>
                <div><p className="font-bold">{v.t}</p><p className="text-sm text-muted-foreground">{v.d}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="join" className="py-14">
          <div className="bg-cta rounded-[2rem] p-10 text-center text-primary-foreground shadow-soft md:p-14">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Час перевірити, а не повірити</h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">Маєш підозрілу новину, пост чи фото? Дізнайся, що за ними стоїть.</p>
            <Button asChild className="mt-8 h-auto rounded-full bg-background px-7 py-3.5 font-semibold text-primary hover:bg-secondary">
              <Link to="/check"><Search className="h-5 w-5" /> Затестити FactGuard <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="glass mt-6 rounded-none border-x-0 border-b-0">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-6 text-sm md:flex-row">
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Достовірність</span>
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Сучасні AI-технології</span>
            <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" /> Свідоме суспільство</span>
          </div>
          <span className="font-display italic text-gradient">Будь обізнаним. Перевіряй.</span>
        </div>
      </footer>
    </div>
  );
}
