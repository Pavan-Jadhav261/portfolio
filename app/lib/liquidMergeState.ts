// Shared reactive state manager coordinating the liquid merge between the cursor orb and interactive UI elements

export interface LiquidMergeData {
  targetId: string | null;
  progress: number;    // 0 (free orb) to 1 (fully merged into element)
  entryX: number;      // 0-100% relative X position within target
  entryY: number;      // 0-100% relative Y position within target
  beatEnergy: number;  // Live music transient energy transferred into the element
}

type Listener = (data: LiquidMergeData) => void;

class LiquidMergeManager {
  private current: LiquidMergeData = {
    targetId: null,
    progress: 0,
    entryX: 50,
    entryY: 50,
    beatEnergy: 0,
  };

  private listeners: Set<Listener> = new Set();

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public update(data: Partial<LiquidMergeData>) {
    this.current = { ...this.current, ...data };
    this.listeners.forEach((l) => l(this.current));
  }

  public get(): LiquidMergeData {
    return this.current;
  }
}

export const liquidMergeManager = new LiquidMergeManager();
