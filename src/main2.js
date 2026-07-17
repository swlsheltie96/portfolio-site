import { mount } from 'svelte'
import Home2 from './Home2.svelte'

const app = mount(Home2, {
  target: document.getElementById('app'),
})

export default app
