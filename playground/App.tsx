import { useState } from "react";
import { setReducedMotion, usePrefersReducedMotion } from "./shims/motion";
import { setColorScheme, useColorScheme } from "./shims/theme";
import { ChannelIconResolver } from "./sections/ChannelIconResolver";
import { ChannelTokens } from "./sections/ChannelTokens";
import { FaceLab } from "./sections/FaceLab";
import { TaskTokens } from "./sections/TaskTokens";
import { Chip, Toggle } from "./ui";

const TABS = ["Face lab", "Task tokens", "Channel tokens", "Icon resolver"] as const;
type Tab = (typeof TABS)[number];

export function App() {
  const scheme = useColorScheme();
  const reducedMotion = usePrefersReducedMotion();
  const [tab, setTab] = useState<Tab>("Face lab");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Agent face playground</h1>
          <p className="text-sm text-[var(--muted)]">Converted components from src/, running on playground stand-ins.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Toggle label="Dark" checked={scheme === "dark"} onChange={(dark) => setColorScheme(dark ? "dark" : "light")} />
          <Toggle label="Reduced motion" checked={reducedMotion} onChange={setReducedMotion} />
        </div>
      </header>
      <nav className="flex flex-wrap gap-2">
        {TABS.map((name) => (
          <Chip key={name} active={tab === name} onClick={() => setTab(name)}>
            {name}
          </Chip>
        ))}
      </nav>
      {tab === "Face lab" && <FaceLab />}
      {tab === "Task tokens" && <TaskTokens />}
      {tab === "Channel tokens" && <ChannelTokens />}
      {tab === "Icon resolver" && <ChannelIconResolver />}
    </div>
  );
}
