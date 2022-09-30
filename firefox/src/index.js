const servers = [
  {
    id: 'twitch',
    value: 'Twitch 서버',
  },
  {
    id: 'workers',
    value: 'Cloudflare Workers',
  },
]

const getSelection = () => browser.storage.local.get('server')
const setSelection = server => browser.storage.local.set({ server })

const renderInputs = async () => {
  const list = document.querySelector('#list')

  const { server } = await getSelection()

  servers.forEach(({ id, value }) => {
    const element = document.createElement('div')

    const radioInput = document.createElement('input')
    radioInput.type = 'radio'
    radioInput.name = 'server'
    radioInput.id = id
    radioInput.value = id
    radioInput.checked = server === id

    radioInput.onchange = () => {
      setSelection(id)
      browser.runtime.sendMessage({ server: id })
    }

    const radioLabel = document.createElement('label')
    radioLabel.htmlFor = id
    radioLabel.textContent = value

    element.appendChild(radioInput)
    element.appendChild(radioLabel)

    list.appendChild(element)
  })
}

window.addEventListener('DOMContentLoaded', () => {
  renderInputs()
})
