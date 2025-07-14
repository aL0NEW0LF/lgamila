export abstract class Singleton {
  private static instances = new Map<new () => Singleton, Singleton>();

  protected constructor() {}

  static getInstance<T extends Singleton>(this: new () => T): T {
    if (!Singleton.instances.has(this)) {
      Singleton.instances.set(this, new this());
    }
    // biome-ignore lint/style/noNonNullAssertion: hh no
    return Singleton.instances.get(this)! as T;
  }
}
