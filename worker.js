const ALLOWED_VIDEO_ROUTES = [
  'woowakgood',
  'viichan6',
  'gosegugosegu',
  'vo_ine',
  'cotton__123',
  'jingburger',
  'lilpaaaaaa',

  'mawang0216',
]
const ROUTE_VIDEO_REQUEST = true

const WEAVER_HOST_REGEX = /https:\/\/video-weaver\.[A-z0-9]+\.hls\.ttvnw\.net/g
const WEAVER_MANIFEST_NODE_REGEX = /MANIFEST-NODE="(video-weaver\.[A-z0-9]+)"/g

const VIDEO_EDGE_NODE_REGEX = /video-edge-[A-z0-9]+.[A-z0-9]+.abs/g

const VIDEO_HOST_REGEX =
  /https:\/\/video-edge-[A-z0-9]+\.[A-z0-9]+\.abs\.hls\.ttvnw\.net/g

const WEAVER_ROUTE_REGEX =
  /^\/video-weaver\.[A-z0-9]+\/v1\/playlist\/(.+)\.m3u8/g
const EDGE_ROUTE_REGEX =
  /^\/video-edge-[A-z0-9]+\.[A-z0-9]+\.abs\/v1\/segment\/(.+)\.ts/g

const weaverRouteReplacer = (url, text) => {
  const manifestNode = text
    .match(WEAVER_MANIFEST_NODE_REGEX)[0]
    .replace(/MANIFEST-NODE=|"/g, '')

  return text.replace(WEAVER_HOST_REGEX, `${url.origin}/${manifestNode}`)
}

const videoRouteReplacer = (url, text) => {
  const manifestNode = text.match(VIDEO_EDGE_NODE_REGEX)[0]

  return text.replace(VIDEO_HOST_REGEX, `${url.origin}/${manifestNode}`)
}

const rootM3U8Request = async (url, request) => {
  let response = await fetch(
    `http://usher.twitch.tv/api/channel/hls` + url.href.replace(url.origin, ''),
    {
      headers: request.headers,
    }
  )

  if (!ROUTE_VIDEO_REQUEST) {
    response = new Response(response.body, response)
    response.headers.set('Access-Control-Allow-Origin', '*')

    return response
  }

  const text = await response.text()

  response = new Response(weaverRouteReplacer(url, text), response)
  response.headers.set('Access-Control-Allow-Origin', '*')

  return response
}

const weaverM3U8Request = async (url, request) => {
  const [host, version, endpoint, file] = url.pathname.split('/').slice(1)

  try {
    let response = await fetch(
      `https://${host}.hls.ttvnw.net/${version}/${endpoint}/${file}`,
      {
        headers: request.headers,
      }
    )

    const text = await response.text()

    response = new Response(videoRouteReplacer(url, text), response)
    response.headers.set('Access-Control-Allow-Origin', '*')

    return response
  } catch (e) {
    console.log(e)
  }
}

const segmentRequest = async (url, request) => {
  const [host, version, endpoint, file] = url.pathname.split('/').slice(1)

  let response = await fetch(
    `https://${host}.hls.ttvnw.net/${version}/${endpoint}/${file}`,
    {
      headers: request.headers,
    }
  )

  response = new Response(response.body, response)
  response.headers.set('Access-Control-Allow-Origin', '*')

  return response
}

async function handleRequest (request) {
  const url = new URL(request.url)

  if (/^\/([A-z0-9]+\.m3u8)/g.test(url.pathname)) {
    if (
      ALLOWED_VIDEO_ROUTES.length &&
      ALLOWED_VIDEO_ROUTES.map(v => url.pathname === `/${v}.m3u8`).filter(
        v => v === true
      ).length < 1
    ) {
      return new Response(
        '해당 스트리머는 현재 Twitching 엣지 서버에서 지원하지 않습니다. 개인 서버를 구축하여 사용하세요.'
      )
    }

    return rootM3U8Request(url, request)
  } else if (WEAVER_ROUTE_REGEX.test(url.pathname) && ROUTE_VIDEO_REQUEST) {
    return weaverM3U8Request(url, request)
  } else if (EDGE_ROUTE_REGEX.test(url.pathname) && ROUTE_VIDEO_REQUEST) {
    return segmentRequest(url, request)
  }
}

addEventListener('fetch', event =>
  event.respondWith(
    handleRequest(event.request).catch(
      err => new Response(err.stack, { status: 500 })
    )
  )
)
