export interface E2eSeed {
  arrange(...ids: string[]): Promise<void>;
  clear(): Promise<void>;
}
