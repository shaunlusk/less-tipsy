import { saveFile } from '../utils/save-file';
import { IHistorySessionDto } from '../model/history-session-dto';

const ErrMessage = 'Import csv was not valid.';

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
    const lines = data.trim().split('\n');
    // discard header
    lines.splice(0, 1);
    console.log(lines.length);
    const historySessions: IHistorySessionDto[] = lines.map(line => {
      const tokens = line.trim().split(',');
      console.log(tokens.length);
      if (tokens.length === 0) {
        throw new Error(ErrMessage);
      }
      const unitsConsumed = parseFloat(tokens[1]);
      const sessionMax = parseFloat(tokens[2]);
      const rollingWeekly = parseFloat(tokens[3]);
      const weeklyMax = parseFloat(tokens[4]);

      if (isNaN(unitsConsumed) 
        || isNaN(sessionMax)
        || isNaN(rollingWeekly)
        || isNaN(weeklyMax)
      ) {
        throw new Error(ErrMessage);
      }

      return {
        date: new Date(tokens[0]),
        unitsConsumed,
        sessionMax,
        rollingWeekly,
        weeklyMax,
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
