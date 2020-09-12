import { saveFile } from '../utils/save-file';
import { IHistorySessionDto } from '../model/history-session-dto';

export class FileService {
  public static exportHistory(sessions: IHistorySessionDto[]): void {
    const data = this.historyToData(sessions);
    saveFile(data, 'less-tipsy-history.csv', 'text/csv');
  }

  private static historyToData(sessions: IHistorySessionDto[]): string {
    const data = 'Date,Units,Session Max,Rolling Weekly,Weekly Max\n';
    return data + sessions.map(session => 
      `${session.date},${session.unitsConsumed},${session.sessionMax},${session.rollingWeekly},${session.weeklyMax}`).join('\n');
  }

  private static dataToHistory(data: string): IHistorySessionDto[] {
    const lines = data.split('\n');
    // discard header
    lines.splice(0, 1);
    const historySessions: IHistorySessionDto[] = lines.map(line => {
      const tokens = line.split(',');
      return {
        date: new Date(tokens[0]),
        unitsConsumed: parseFloat(tokens[1]),
        sessionMax: parseFloat(tokens[2]),
        rollingWeekly: parseFloat(tokens[1]),
        weeklyMax: parseFloat(tokens[1]),
      };
    });
    return historySessions;
  }

  public static importHistory(file: File): Promise<IHistorySessionDto[]|void> {
    return file.text().then(text => {
        return this.dataToHistory(text);
      });
  }
}
