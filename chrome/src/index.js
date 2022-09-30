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
]

const getSelection = () => chrome.storage.local.get('server')
const setSelection = server => chrome.storage.local.set({ server })

const updateRule = rid => {
  const option = servers.find(({ id }) => id === rid)

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
  })

  if (!option || !option.server) {
    return
  }

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: 'https://' + option.server + '/\\1',
          },
        },
        condition: {
          regexFilter: '^https://usher.ttvnw.net/api/channel/hls/(.*)',
          resourceTypes: [
            'main_frame',
            'sub_frame',
            'script',
            'object',
            'xmlhttprequest',
            'websocket',
            'webtransport',
            'webbundle',
            'other',
          ],
        },
      },
    ],
  })
}

const checkInitialOpen = () => {}

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
      updateRule(id)
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
  checkInitialOpen()
  renderInputs()
})
