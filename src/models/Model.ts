interface ModelAttributes<T> {
    set(update: T): void,
    getAll(): T,
    get<K extends keyof T>(key: K): T[K]
}

interface Sync<T> {
  fetch(id: number): Promise<any>
  save(data: T): Promise<any>
}

interface Events {
  on(eventName: string, callback: () => void): void,
  trigger(eventName: string): void
}

interface HasId {
  id?: number
}

export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

    get on() {
      return this.events.on
    }

    get trigger() {
      return this.events.trigger
    }

    get get() {
      return this.attributes.get
    }

    set(update: T): void {
      this.attributes.set(update)
      this.trigger('change')
    }

    async fetch() {
      const id = this.attributes.get('id')

      if(!id) throw new Error('Cannot fetch without id ')

      const { data } = await this.sync.fetch(id)
      this.set(data)
    }

    async save() {
      await this.sync.save(this.attributes.getAll())
      this.trigger('save')
    }
}
