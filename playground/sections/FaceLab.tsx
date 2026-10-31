import { useState, type ReactNode } from "react";
import { MARK_NAMES, type MarkName } from "@/draw/mascot-kit";
import { AgentFace, type FaceGestureKind } from "@/face/AgentFace";
import { FaceEngineProvider } from "@/face/FaceEngineProvider";
import { FACE_GLYPHS, PROP_CODES, type FaceState, type PropName } from "@/face/face-codes";
import { AIBO_HATS, AIBO_TINTS, type AiboCharacter, type AiboHat, type AiboTint } from "@/look/aibo-look";
import { EngineView } from "../EngineView";
import { Chip, Field, Section, Toggle, inputClass } from "../ui";

const STATES = Object.keys(FACE_GLYPHS) as FaceState[];
const GESTURES: FaceGestureKind[] = ["wave", "nod", "hop", "spin"];
const PROPS = Object.keys(PROP_CODES) as PropName[];
const CHARACTERS: AiboCharacter[] = ["tofu", "pebble", "block", "flower"];

/** Marks a control whose effect only shows in the engine view. */
function EngineOnly({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      {children}
      <span className="rounded bg-[var(--line)] px-1 py-px text-[10px] uppercase tracking-wide">engine view only</span>
    </span>
  );
}

function Labeled({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="flex flex-col items-center gap-2">
      <div className="rounded-xl border border-[var(--line)] p-2">{children}</div>
      <figcaption className="text-center text-xs text-[var(--muted)]">{caption}</figcaption>
    </figure>
  );
}

export function FaceLab() {
  const [state, setState] = useState<FaceState>("idle");
  const [gesture, setGesture] = useState<{ id: number; kind: FaceGestureKind } | null>(null);
  const [hat, setHat] = useState<AiboHat | null>(null);
  const [prop, setProp] = useState<PropName | null>(null);
  const [mascot, setMascot] = useState<MarkName | null>(null);
  const [sunglasses, setSunglasses] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [amplitude, setAmplitude] = useState(1);
  const [character, setCharacter] = useState<AiboCharacter>("tofu");
  const [tint, setTint] = useState<AiboTint>("clay");

  const look = { state, character, tint, hat, prop, sunglasses, mascot, amplitude, gesture };

  return (
    <div className="flex flex-col gap-4">
      <Section
        title="Face engine"
        note={
          <>
            Left: the real mascot kit, which draws one animated mark chosen by the state, a held prop, or the mark
            override. Right: a playground-only engine view (not from the original) that paints the same shared engine
            as plain shapes, so the inputs the real kit ignores are visible. Engine-only controls are tagged. The
            engine is only driven while Animate is on.
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-4">
            <FaceEngineProvider faceKey="lab">
              <div className="flex flex-wrap justify-center gap-4">
                <Labeled caption="Real mascot kit">
                  <AgentFace agentName="Claude" animate={animate} size={180} eager {...look} />
                </Labeled>
                <Labeled caption="Engine view (debug)">
                  <EngineView size={180} character={character} tint={tint} />
                </Labeled>
              </div>
              <div className="flex items-end gap-3">
                {[24, 32, 48, 64].map((size) => (
                  <AgentFace key={size} agentName="Claude" animate={animate} size={size} eager {...look} />
                ))}
              </div>
            </FaceEngineProvider>
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <AgentFace agentName="Claude" size={48} {...look} gesture={null} /> still (animate=false)
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Field label="State">
              <div className="flex flex-wrap gap-2">
                {STATES.map((name) => (
                  <Chip key={name} active={state === name} onClick={() => setState(name)}>
                    {name}
                  </Chip>
                ))}
              </div>
            </Field>
            <Field label={<EngineOnly>Gesture (plays once per click)</EngineOnly>}>
              <div className="flex flex-wrap gap-2">
                {GESTURES.map((kind) => (
                  <Chip key={kind} onClick={() => setGesture((previous) => ({ id: (previous?.id ?? 0) + 1, kind }))}>
                    {kind}
                  </Chip>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label="Mark override">
                <select className={inputClass} value={mascot ?? ""} onChange={(e) => setMascot((e.target.value || null) as MarkName | null)}>
                  <option value="">from state</option>
                  {MARK_NAMES.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Prop">
                <select className={inputClass} value={prop ?? ""} onChange={(e) => setProp((e.target.value || null) as PropName | null)}>
                  <option value="">none</option>
                  {PROPS.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </Field>
              <Field label={<EngineOnly>Hat</EngineOnly>}>
                <select className={inputClass} value={hat ?? ""} onChange={(e) => setHat((e.target.value || null) as AiboHat | null)}>
                  <option value="">none</option>
                  {AIBO_HATS.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </Field>
              <Field label={<EngineOnly>Character</EngineOnly>}>
                <select className={inputClass} value={character} onChange={(e) => setCharacter(e.target.value as AiboCharacter)}>
                  {CHARACTERS.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </Field>
              <Field label={<EngineOnly>Tint</EngineOnly>}>
                <select className={inputClass} value={tint} onChange={(e) => setTint(e.target.value as AiboTint)}>
                  {AIBO_TINTS.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label={`Amplitude ${amplitude.toFixed(2)}`}>
              <input type="range" min={0} max={1} step={0.05} value={amplitude} onChange={(e) => setAmplitude(Number(e.target.value))} />
            </Field>
            <div className="flex flex-wrap gap-4">
              <Toggle label="Animate" checked={animate} onChange={setAnimate} />
              <Toggle label="Sunglasses (engine view only)" checked={sunglasses} onChange={setSunglasses} />
            </div>
            <p className="text-xs text-[var(--muted)]">
              Things to try: switch states quickly (each holds for its dwell time), add then remove a hat (it drops on,
              then gets flung off), pick a prop while wearing sunglasses (the prop replaces them, and the real kit
              switches to that prop's mark), or play a gesture.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
