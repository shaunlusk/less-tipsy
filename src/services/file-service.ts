import { saveFile } from '../utils/save-file';
import { IHistorySessionDto } from '../model/history-session-dto';

const ErrMessage = 'Import csv was not valid.';
const VersionHeader = 'v1.0';
const Header = 'Date,Units,Session Max,Rolling Weekly,Weekly Max';

export class FileService {
  public static exportHistory(sessions: IHistorySessionDto[]): void {
    const data = this.historyToData(sessions);
    saveFile(data, 'less-tipsy-history.csv', 'text/csv');
  }

  private static historyToData(sessions: IHistorySessionDto[]): string {
    const data = `${VersionHeader}\n${Header}\n`;
    return data + sessions.map(session => 
      `${session.date},${session.unitsConsumed},${session.sessionMax},${session.rollingWeekly},${session.weeklyMax}`).join('\n');
  }

  private static dataToHistory(data: string): IHistorySessionDto[] {
    const lines = data.trim().split('\n');
    // discard headers
    if (lines.length < 2 || lines[0] !== VersionHeader || lines[1] !== Header) {
      throw new Error('Invalid csv format.');
    }

    lines.splice(0, 2);
    const historySessions: IHistorySessionDto[] = lines.map(line => {
      const tokens = line.trim().split(',');
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
