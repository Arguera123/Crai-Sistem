import PostgresDataSource from './config/db.config';
import { scheduleReminderJob } from './job/email-reminder.job';
import { SyncManager } from './job/sync-manager';
import server from './server'
import { seedAdminUser } from './utils/admin-user.seed';
import { seedLockers } from './utils/seed.lockers';
import { seedRoles } from './utils/seed.roles';
// import { seedGeneralUsers } from './utils/user.seed';

const port = process.env.BACKEND_PORT || 5000

const syncManager = new SyncManager();

PostgresDataSource.initialize()
  .then(async () => {
    console.log('Base de datos conectada');

    await seedRoles();
    await seedAdminUser();
    await seedLockers();

    server.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });

    scheduleReminderJob()
    syncManager.scheduleCron();
  })
  .catch((err) => {
    console.error('Error al conectar la base de datos:', err);
  });