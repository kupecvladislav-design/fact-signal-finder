import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ToolsNav } from "@/components/factguard-tools";
import mascot from "@/assets/mascot.png";
export function FactGuardPage({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) { return <div className="min-h-screen bg-page font-sans text-foreground"><header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5"><a href="/" className="flex items-center gap-2 font-display text-xl font-bold"><img src={mascot} alt="" className="h-10 w-10"/>FactGuard</a><ThemeToggle/></header><main className="mx-auto max-w-5xl px-5 pb-16"><ToolsNav/><h1 className="mt-8 font-display text-3xl font-bold sm:text-4xl">{title}</h1><p className="mb-8 mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>{children}</main></div>; }
