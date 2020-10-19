import { LocalStorageService } from "./local-storage-service";

export interface IMainStateService {
    viewedAboutTab: boolean;
    acceptedDisclaimer: boolean;
}

const ViewedAboutTabStorageKey = 'ViewedAboutTab';
const AcceptedDisclaimerStorageKey = 'AcceptedDisclaimer';

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

  public get acceptedDisclaimer(): boolean {
    var result = this._localStorageService.getBoolean(AcceptedDisclaimerStorageKey);
    return result || false;
  }

  public set acceptedDisclaimer(value: boolean) {
    this._localStorageService.put(AcceptedDisclaimerStorageKey, value);
  }
}