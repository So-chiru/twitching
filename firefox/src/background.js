const servers = {
  twitch: undefined,
  workers: 'workers.twitch-relay.wesub.io',
}

browser.webRequest.onBeforeRequest.addListener(
  async details => {
    try {
      const { serverURL } = await browser.storage.local.get('serverURL')

      return new Promise(resolve =>
        resolve({
          redirectUrl: `https://${serverURL}/${details.url.replace(
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
  browser.storage.local.set({
    server: 'workers',
    serverURL: 'workers.twitch-relay.wesub.io',
  })
})
