const servers = {
  twitch: undefined,
  workers: 'workers-twitch-relay.wesub.io',
}

browser.webRequest.onBeforeRequest.addListener(
  async details => {
    try {
      const { server } = await browser.storage.local.get('server')

      if (!servers[server]) {
        return details
      }

      return new Promise(resolve =>
        resolve({
          redirectUrl: `https://${servers[server]}/${details.url.replace(
            'https://usher.ttvnw.net/api/channel/hls/',
            ''
          )}`,
        })
      )
    } catch (e) {
      return details
    }
  },
  { urls: ['https://usher.ttvnw.net/api/channel/hls/*'] },
  ['blocking']
)

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ server: 'workers' })
})

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request)
})
