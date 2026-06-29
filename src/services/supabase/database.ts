// Database service stub. Replace with Supabase client wiring in Batch 2.

export interface DatabaseService {
  list<T>(table: string): Promise<T[]>;
  get<T>(table: string, id: string): Promise<T | null>;
  insert<T>(table: string, row: Partial<T>): Promise<T>;
  update<T>(table: string, id: string, patch: Partial<T>): Promise<T>;
  remove(table: string, id: string): Promise<void>;
}

const stores = new Map<string, Map<string, unknown>>();
const ensure = (t: string) => {
  if (!stores.has(t)) stores.set(t, new Map());
  return stores.get(t)!;
};

export const databaseService: DatabaseService = {
  async list(table) {
    return Array.from(ensure(table).values()) as never;
  },
  async get(table, id) {
    return (ensure(table).get(id) ?? null) as never;
  },
  async insert(table, row) {
    const id = (row as { id?: string }).id ?? Math.random().toString(36).slice(2);
    const created = { ...row, id };
    ensure(table).set(id, created);
    return created as never;
  },
  async update(table, id, patch) {
    const cur = (ensure(table).get(id) ?? {}) as Record<string, unknown>;
    const next = { ...cur, ...patch, id };
    ensure(table).set(id, next);
    return next as never;
  },
  async remove(table, id) {
    ensure(table).delete(id);
  },
};
