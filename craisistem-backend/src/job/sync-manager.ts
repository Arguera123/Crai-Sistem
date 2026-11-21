import cron from 'node-cron';
import { SyncService } from '../services/sync.service';

export class SyncManager {
  private syncService: SyncService;

  constructor() {
    this.syncService = new SyncService();
  }

  async startSync() {
    const startTime = new Date();
    console.log(`[${startTime.toISOString()}] Iniciando proceso de sincronización...`);
    
    try {
      await this.syncService.syncAllSources();
      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;
      console.log(`[${endTime.toISOString()}] Sincronización exitosa. Duración: ${duration}s`);
    } catch (error) {
      console.error('CRITICAL ERROR en la sincronización:', error);
    }
  }

  scheduleCron() {
    cron.schedule('0 0 * * *', async () => {
      console.log('Ejecutando sincronización programada...');
      await this.startSync();
    }, { timezone: "America/El_Salvador" });

    console.log('Cron Job programado: Medianoche cada día.');
  }
}