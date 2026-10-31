import { useState } from "react";
import { channelIconFor, glyphForName, type ChannelIconSource } from "@/channel/channel-icon";
import { ChannelToken } from "@/channel/ChannelToken";
import { Field, Section, inputClass } from "../ui";

const EXAMPLES: ChannelIconSource[] = [
  { id: "c-1", name: "Weekly budget review" },
  { id: "c-2", name: "Trip planning" },
  { id: "c-3", name: "Random chat" },
  { id: "c-4", name: "Anything", color: "rose" },
  { id: "c-5", name: "Saved icon", icon: "proj_heart" },
  { id: "c-6", name: "Line look", icon: "Aibo3_bean_matcha" },
  { id: "c-7", name: "Mascot icon", icon: "Aibo1_tofu_plum_crown" },
];

export function ChannelIconResolver() {
  const [source, setSource] = useState<ChannelIconSource>({ id: "channel-123", name: "Grocery orders", color: "", icon: "" });
  const icon = channelIconFor(source);
  const update = (key: keyof ChannelIconSource) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setSource((previous) => ({ ...previous, [key]: event.target.value }));

  return (
    <div className="flex flex-col gap-4">
      <Section
        title="channelIconFor"
        note="Glyph comes from the icon token, else from keywords in the name, else from sha256(id). Tint comes from the token or color, else from sha256(id)."
      >
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="id">
            <input className={inputClass} value={source.id} onChange={update("id")} />
          </Field>
          <Field label="name">
            <input className={inputClass} value={source.name} onChange={update("name")} />
          </Field>
          <Field label="color">
            <input className={inputClass} value={source.color ?? ""} onChange={update("color")} placeholder="e.g. rose" />
          </Field>
          <Field label="icon token">
            <input className={inputClass} value={source.icon ?? ""} onChange={update("icon")} placeholder="e.g. proj_music" />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <ChannelToken icon={icon} size={56} />
          <pre className="text-sm">{JSON.stringify({ ...icon, glyphFromName: glyphForName(source.name) ?? null }, null, 2)}</pre>
        </div>
      </Section>
      <Section title="Examples">
        <ul className="flex flex-col gap-2">
          {EXAMPLES.map((example) => {
            const resolved = channelIconFor(example);
            return (
              <li key={example.id} className="flex items-center gap-3 text-sm">
                <ChannelToken icon={resolved} size="lg" />
                <span className="w-44">{example.name}</span>
                <code className="text-xs text-[var(--muted)]">
                  {JSON.stringify({ color: example.color, icon: example.icon })} → {resolved.glyph} · {resolved.tint}
                </code>
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}
