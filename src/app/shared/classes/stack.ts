export class Stack<T> {
  private items: T[] = [];

  public push(item: T): void {
    this.items.push(item);
  }

  public pop(): T | undefined {
    return this.items.pop();
  }

  public peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public size(): number {
    return this.items.length;
  }

  public clear(): void {
    this.items = [];
  }
}
