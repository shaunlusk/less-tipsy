import { saveFile } from '../utils/save-file';

export interface IHistoricSessionExportModel {
  unitsConsumed: number;
  sessionMax: number;
  weeklyMax: number;
  rollingWeekly: number;
  date: Date;
}

export class FileService {
  public static exportHistory(sessions: IHistoricSessionExportModel[]): void {
    const data = this.historyToData(sessions);
    saveFile(data, 'less-tipsy-history.csv', 'text/csv');
  }

  private static historyToData(sessions: IHistoricSessionExportModel[]) {
    const data = 'Date,Units,Session Max,Rolling Weekly,Weekly Max\n';
    return data + sessions.map(session => 
      `${session.date},${session.unitsConsumed},${session.sessionMax},${session.rollingWeekly},${session.weeklyMax}`).join('\n');
  }

}
