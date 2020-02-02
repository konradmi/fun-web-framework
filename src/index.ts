import { User } from './models/User'

const user = new User()

// user.set({ name: 'NAME NAME' })
// user.set({ age: 100 })

// user.save()

user.events.on('change', () => console.log('change'))

user.events.trigger('change')


