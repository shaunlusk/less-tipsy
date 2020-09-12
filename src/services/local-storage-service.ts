export interface ILocalStorageService {
  put(key: string, value: number | string | boolean): void;
  getString(key: string): string | null;
  getNumber(key: string): number | null;
  getBoolean(key: string): boolean | null;
  getObject<T>(key: string): T | null;
  putObject<T>(key: string, value: T): void;
  remove(key: string): void;
}

export class LocalStorageService implements ILocalStorageService {
  public getString(key: string): string | null {
    return localStorage.getItem(key);
  }

  public getNumber(key: string): number | null {
    const value = localStorage.getItem(key);
    return value ? parseFloat(value) : null;
  }

  public getBoolean(key: string): boolean | null {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return value.toLocaleLowerCase() === "true" ? true : false;
  }

  public put(key: string, value: string | number | boolean): void {
    localStorage.setItem(key, value.toString());
  }

  public getObject<T>(key: string): T | null {
    const valueString = localStorage.getItem(key);
    let value: T | null = null;
    if (valueString) {
      value = JSON.parse(valueString);
    }
    return value;
  }

  public putObject<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }
}
