import { LocalStorageService } from "./local-storage-service";

export interface IMainStateService {
    viewedAboutTab: boolean;
}

const ViewedAboutTabStorageKey = 'ViewedAboutTab';

export class MainStateService implements IMainStateService {
  private _localStorageService: LocalStorageService;

  public constructor(localStorageService: LocalStorageService) {
    this._localStorageService = localStorageService;
  }

  public get viewedAboutTab(): boolean {
    var result = this._localStorageService.getBoolean(ViewedAboutTabStorageKey);
    return result || false;
  }

  public set viewedAboutTab(value: boolean) {
    this._localStorageService.put(ViewedAboutTabStorageKey, value);
  }

}