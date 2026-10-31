import { useState } from "react";
import type { IconSize } from "@/external/density";
import { CHANNEL_GLYPHS } from "@/channel/channel-glyphs";
import { CHANNEL_TINTS } from "@/channel/channel-icon";
import { ChannelToken, type ChannelTokenSize } from "@/channel/ChannelToken";
import { AIBO_TINTS } from "@/look/aibo-look";
import { Chip, Field, Section, Toggle } from "../ui";

const SIZES: ChannelTokenSize[] = ["sm", "md", "lg", "xl", 40, 64, "auto"];

export function ChannelTokens() {
  const [size, setSize] = useState<ChannelTokenSize>("lg");
  const [allTints, setAllTints] = useState(false);
  const tints = allTints ? AIBO_TINTS : CHANNEL_TINTS;

  return (
    <div className="flex flex-col gap-4">
      <Section
        title="Channel pictograms"
        note="Real output: line art and fills straight from the bundle. Named sizes pad the art to 22/28; numeric sizes fill the box. clawd and code fall back to a tinted task tile."
      >
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <Field label="Size">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((option) => (
                <Chip key={String(option)} active={size === option} onClick={() => setSize(option)}>
                  {String(option)}
                </Chip>
              ))}
            </div>
          </Field>
          <Toggle label="All 10 tints (default: the 6 channel tints)" checked={allTints} onChange={setAllTints} />
        </div>
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-1.5">
            <tbody>
              {tints.map((tint) => (
                <tr key={tint}>
                  <th className="pr-2 text-left text-xs font-normal text-[var(--muted)]">{tint}</th>
                  <td title="all channels">
                    <ChannelToken allChannels size={size} />
                  </td>
                  {[...CHANNEL_GLYPHS, "clawd" as const, "code" as const].map((glyph) => (
                    <td key={glyph} title={`${glyph} · ${tint}`}>
                      <ChannelToken icon={{ glyph, tint }} size={size} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Sizes side by side">
        <div className="flex flex-wrap items-end gap-4">
          {(["xs", "sm", "md", "lg", "xl"] as IconSize[]).map((named) => (
            <div key={named} className="flex flex-col items-center gap-1">
              <ChannelToken icon={{ glyph: "globe", tint: "cornflower" }} size={named} />
              <span className="text-xs text-[var(--muted)]">{named}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
