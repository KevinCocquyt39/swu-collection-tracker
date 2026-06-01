// Composable to manage the card collection with localStorage persistence

export interface CardEntry {
  id: string;
  name: string;
  quantity: number;
  addedAt: string;
}

export type SortField = "name" | "quantity" | "addedAt";
export type SortDirection = "asc" | "desc";

const COLLECTION_KEY = "swu_collection";
const SETTINGS_KEY = "swu_settings";

export function useCollection() {
  const cards = useState<CardEntry[]>("cards", () => []);

  const loadFromStorage = () => {
    if (import.meta.client) {
      const raw = localStorage.getItem(COLLECTION_KEY);
      if (raw) {
        try {
          cards.value = JSON.parse(raw);
        } catch {
          cards.value = [];
        }
      }
    }
  };

  const saveToStorage = () => {
    if (import.meta.client) {
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(cards.value));
    }
  };

  const addCard = (name: string, quantity: number) => {
    const existing = cards.value.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cards.value.push({
        id: crypto.randomUUID(),
        name: name.trim(),
        quantity,
        addedAt: new Date().toISOString(),
      });
    }
    saveToStorage();
  };

  const removeCard = (id: string) => {
    cards.value = cards.value.filter((c) => c.id !== id);
    saveToStorage();
  };

  const totalCards = computed(() =>
    cards.value.reduce((sum, c) => sum + c.quantity, 0),
  );

  return { cards, loadFromStorage, addCard, removeCard, totalCards };
}

export function useSettings() {
  const sortField = useState<SortField>("sortField", () => "addedAt");
  const sortDirection = useState<SortDirection>("sortDirection", () => "desc");

  const loadSettings = () => {
    if (import.meta.client) {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        try {
          const s = JSON.parse(raw);
          sortField.value = s.sortField ?? "addedAt";
          sortDirection.value = s.sortDirection ?? "desc";
        } catch {
          /* ignore */
        }
      }
    }
  };

  const saveSettings = () => {
    if (import.meta.client) {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          sortField: sortField.value,
          sortDirection: sortDirection.value,
        }),
      );
    }
  };

  return { sortField, sortDirection, loadSettings, saveSettings };
}
