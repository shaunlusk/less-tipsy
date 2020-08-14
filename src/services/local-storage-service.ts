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
  getString(key: string): string | null {
    return localStorage.getItem(key);
  }

  getNumber(key: string): number | null {
    const value = localStorage.getItem(key);
    return value ? parseFloat(value) : null;
  }

  getBoolean(key: string): boolean | null {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return value.toLocaleLowerCase() === "true" ? true : false;
  }

  put(key: string, value: string | number | boolean): void {
    localStorage.setItem(key, value.toString());
  }

  getObject<T>(key: string): T | null {
    const valueString = localStorage.getItem(key);
    let value: T | null = null;
    if (valueString) {
      value = JSON.parse(valueString);
    }
    return value;
  }

  putObject<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
