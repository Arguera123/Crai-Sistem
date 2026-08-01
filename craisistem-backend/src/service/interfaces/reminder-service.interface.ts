export interface IReminderService {
  sendDailyReminders(): Promise<void>;
}