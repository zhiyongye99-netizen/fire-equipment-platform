import Taro from "@tarojs/taro";

const COMPARE_STORAGE_KEY = "FIRE_EQUIPMENT_COMPARE_IDS";
const MAX_COMPARE_COUNT = 4;

type Listener = (ids: string[]) => void;
const listeners: Set<Listener> = new Set();

export function getCompareIds(): string[] {
  try {
    const data = Taro.getStorageSync(COMPARE_STORAGE_KEY);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveCompareIds(ids: string[]) {
  try {
    Taro.setStorageSync(COMPARE_STORAGE_KEY, ids);
  } catch (e) {
    console.error("Failed to save compare ids", e);
  }
  listeners.forEach(fn => fn(ids));
}

export function toggleCompareId(id: string): { success: boolean; message?: string; isAdded: boolean } {
  const current = getCompareIds();
  const index = current.indexOf(id);
  if (index > -1) {
    current.splice(index, 1);
    saveCompareIds(current);
    return { success: true, isAdded: false };
  } else {
    if (current.length >= MAX_COMPARE_COUNT) {
      return { success: false, message: `最多只能同时对比 ${MAX_COMPARE_COUNT} 款装备`, isAdded: false };
    }
    current.push(id);
    saveCompareIds(current);
    return { success: true, isAdded: true };
  }
}

export function clearCompareIds() {
  saveCompareIds([]);
}

export function subscribeCompare(listener: Listener): () => void {
  listeners.add(listener);
  listener(getCompareIds());
  return () => {
    listeners.delete(listener);
  };
}
