const servers = {
  twitch: undefined,
  workers: 'workers.twitch-relay.wesub.io',
}

browser.webRequest.onBeforeRequest.addListener(
  async details => {
    try {
      const { serverURL } = await browser.storage.local.get('serverURL')

      if (!serverURL) {
        return
      }

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

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    const googleProxy = 'www-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url='
    return new Promise(resolve => resolve({
      redirectUrl: `https://${googleProxy}${details.url}`,
    }));
  },
  { urls: ['https://*.abs.hls.ttvnw.net/*'] },
  ['blocking']
);