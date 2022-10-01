const servers = [
  {
    id: 'twitch',
    value: 'Twitch 선택 (기본)',
    server: undefined,
  },
  {
    id: 'workers',
    value: 'Cloudflare Workers',
    server: 'workers.twitch-relay.wesub.io',
  },
  {
    id: 'custom',
    value: '커스텀',
    server: undefined,
  },
]

const store = {
  get: async key => {
    return new Promise(resolve => {
      browser.storage.local.get(key, result => {
        resolve(typeof key === 'undefined' ? result : result[key])
      })
    })
  },

  set: async (key, value) =>
    new Promise(async resolve => {
      const data = await store.get()

      browser.storage.local.set({ ...data, [key]: value }, resolve)
    }),
}

const updateRule = server => store.set('serverURL', server)

const renderInputs = async () => {
  const list = document.querySelector('#list')

  const serverInStorage = await store.get('server')

  servers.forEach(async ({ id, value, server }) => {
    const element = document.createElement('div')
    element.className = 'radio-option'

    const radioInput = document.createElement('input')
    radioInput.type = 'radio'
    radioInput.name = 'server'
    radioInput.id = id
    radioInput.value = id
    radioInput.checked = serverInStorage === id

    radioInput.onchange = async () => {
      await store.set('server', radioInput.value)

      if (radioInput.value === 'custom') {
        updateRule(document.querySelector('#custom-input').value)
      } else {
        updateRule(server)
      }
    }

    if (id === 'custom') {
      const customInput = document.createElement('input')
      customInput.type = 'text'
      customInput.id = 'custom-input'
      customInput.placeholder = 'your-worker.workers.dev'
      customInput.value = (await store.get('custom')) || ''

      customInput.onchange = () => {
        store.set('server', 'custom')
        store.set('custom', customInput.value)
        updateRule(customInput.value)
      }

      element.appendChild(customInput)
    } else {
      const radioLabel = document.createElement('label')
      radioLabel.htmlFor = id
      radioLabel.textContent = value

      element.appendChild(radioLabel)
    }

    element.appendChild(radioInput)
    list.appendChild(element)
  })
}

window.addEventListener('DOMContentLoaded', () => {
  renderInputs()
})
