import { Eventing } from './Eventing'
import { Sync } from './Sync'
import { Attributes } from "./Attributes";

export interface UserProps {
  id?: number
  name?: string
  age?: number
}

const rootUrl = 'http://localhost:3000/users'

export class User {
  public events: Eventing = new Eventing()
  public sync: Sync<UserProps> = new Sync<UserProps>(rootUrl)
  public attributes: Attributes<UserProps>

  constructor(attrs: UserProps) {
    this.attributes = new Attributes<UserProps>(attrs)
  }

   get on() {
    return this.events.on
  }

  get trigger() {
    return this.events.trigger
  }

  get get() {
    return this.attributes.get
  }

  set(update: UserProps): void {
    this.attributes.set(update)
    this.trigger('change')
  }

  async fetch(): void {
    const id = this.attributes.get('id')
    if(!id) throw new Error('Cannot fetch without id ')

    const { data } = await this.sync.fetch(id)
    this.set(data)
  }

  async save(): void {
    await this.sync.save(this.attributes.getAll())
    this.trigger('save')
  }
}
