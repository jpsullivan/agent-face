import { useState } from "react";
import { AIBO_TINTS } from "@/look/aibo-look";
import { TileStyleContext, type TileStyle } from "@/tiles/tile-contexts";
import { TASK_TINTS } from "@/tiles/tints";
import { ClayTileSurfaceContext } from "@/tokens/clay-tile-loader";
import { TASK_GLYPHS, parseTaskLook, type TaskLook, type TileGlyph } from "@/tokens/task-look";
import { TaskToken } from "@/tokens/TaskToken";
import { Chip, Field, Section, Toggle } from "../ui";

const GLYPHS: TileGlyph[] = [...TASK_GLYPHS, "clawd", "code"];
const MASCOT_TOKENS = [
  "Aibo1_tofu_clay",
  "Aibo1_pebble_cornflower_crown",
  "Aibo1_block_cactus_partyHat",
  "Aibo1_spark_rose_halo",
  "Aibo1_tofu-flat_plum_wizard",
];

export function TaskTokens() {
  const [style, setStyle] = useState<TileStyle>("tinted");
  const [size, setSize] = useState(28);
  const [neutral, setNeutral] = useState(false);
  const [matte, setMatte] = useState(false);
  const [claySurface, setClaySurface] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <Section
        title="Glyph tiles"
        note="Rows are the task-picker tints. Grey style uses the stand-in theme classes; tinted uses the hex palettes from tints.ts."
      >
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <Field label="Tile style">
            <div className="flex gap-2">
              {(["tinted", "grey"] as const).map((name) => (
                <Chip key={name} active={style === name} onClick={() => setStyle(name)}>
                  {name}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label={`Size ${size}px`}>
            <input type="range" min={16} max={64} value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </Field>
          <Toggle label="Neutral" checked={neutral} onChange={setNeutral} />
          <Toggle label="Matte" checked={matte} onChange={setMatte} />
          <Toggle label="Clay surface (WebGL clay tiles)" checked={claySurface} onChange={setClaySurface} />
        </div>
        <ClayTileSurfaceContext value={claySurface}>
          <TileStyleContext value={style}>
            <div className="overflow-x-auto">
              <table className="border-separate border-spacing-1.5">
                <tbody>
                  {TASK_TINTS.map((tint) => (
                    <tr key={tint}>
                      <th className="pr-2 text-left text-xs font-normal text-[var(--muted)]">{tint}</th>
                      {GLYPHS.map((glyph) => (
                        <td key={glyph} title={`${glyph} · ${tint}`}>
                          <TaskToken
                            look={{ wear: { kind: "glyph", glyph }, tint, setBy: "agent" }}
                            size={size}
                            isNeutral={neutral}
                            isMatte={matte}
                            taskId={`${tint}-${glyph}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TileStyleContext>
        </ClayTileSurfaceContext>
      </Section>

      <Section title="Mascot tokens" note="Aibo1 tokens parsed by parseTaskLook, drawn as still faces by the mascot kit.">
        <div className="flex flex-wrap gap-6">
          {MASCOT_TOKENS.map((token) => {
            const look = parseTaskLook(token, undefined, "user") as TaskLook;
            return (
              <div key={token} className="flex flex-col items-center gap-2">
                <TaskToken look={look} size={48} />
                <code className="text-xs text-[var(--muted)]">{token}</code>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">Valid tints: {AIBO_TINTS.join(", ")}</p>
      </Section>
    </div>
  );
}
