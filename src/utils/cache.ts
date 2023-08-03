import NodeCache from 'node-cache';
import { NullableType } from './types/nullable.type';

class Cache {
  private static instance: NodeCache | undefined;
  private static readonly config: Record<string, any> = {
    stdTTL: 3600,
    checkperiod: 120,
  };

  static get<T>(key: string): NullableType<T> {
    if (!this.instance) {
      this.instance = new NodeCache(this.config);
    }

    const data = this.instance.get<T>(key);
    return data ?? null;
  }

  static set<T>(key: string, value: T): void {
    if (!this.instance) {
      this.instance = new NodeCache({
        stdTTL: 3600,
        checkperiod: 120,
      });
    }

    this.instance.set<T>(key, value);
  }
}

export default Cache;
