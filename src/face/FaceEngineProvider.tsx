// Shares one FaceEngine between every AgentFace under it, so the same agent
// shown in several places blinks and gestures in sync.
import { createContext, use, useState, type ReactNode } from "react";
import { FaceEngine } from "./engine";

const FaceEngineContext = createContext<FaceEngine | null>(null);

export interface FaceEngineProviderProps {
  /** A new key starts a fresh engine (e.g. a different agent). */
  faceKey: string;
  children: ReactNode;
}

export function FaceEngineProvider({ faceKey, children }: FaceEngineProviderProps) {
  const [current, setCurrent] = useState(() => ({ faceKey, engine: new FaceEngine() }));
  if (current.faceKey !== faceKey) {
    setCurrent({ faceKey, engine: new FaceEngine() });
  }
  return <FaceEngineContext value={current.engine}>{children}</FaceEngineContext>;
}

export function useSharedFaceEngine(): FaceEngine | null {
  return use(FaceEngineContext);
}
