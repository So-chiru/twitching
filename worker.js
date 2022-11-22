addEventListener('fetch', (event) =>
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  )
)

async function handleRequest(request) {
  const parsed = new URL(request.url)
  let response = await fetch(
    `http://usher.twitch.tv/api/channel/hls` +
      parsed.href.replace(parsed.origin, ''),
    {
      headers: request.headers,
    }
  )
  response = new Response(response.body, response)
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}
