chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == 'install') {
    chrome.storage.local.set({ server: 'workers' })

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              regexSubstitution: 'https://workers.twitch-relay.wesub.io/\\1',
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
})
