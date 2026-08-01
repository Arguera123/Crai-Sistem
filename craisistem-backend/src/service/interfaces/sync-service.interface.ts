export interface ISyncService {
  syncAllSources(): Promise<void>;
}