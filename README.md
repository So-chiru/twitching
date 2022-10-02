## Twitching

twitch.tv relay on edges for better experience

Chrome Webstore: https://chrome.google.com/webstore/detail/lpanejlgnikpcmhmkbgeiigfahjdnccm

Firefox Addons: https://addons.mozilla.org/en-US/firefox/addon/twitching/

### Warning

> 본 서비스, 클라이언트, 리소스 등을 사용하여 발생하는 일에 대한 책임은 모두 사용자 본인에게 있습니다. 본 개발자는 확장 프로그램을 사용하면서 발생한 문제에 대해 책임을 지지 않습니다.

### 직접 구축하기

#### 1. Workers Edge 구축하기

1. [Cloudflare 계정](https://dash.cloudflare.com/)을 만듭니다.
2. Zone의 Workers 메뉴로 이동하여 서비스 생성 버튼을 누릅니다.
3. 원하는 서비스 이름을 적고 생성 버튼을 누릅니다.
4. 빠른 편집 버튼을 눌러 코드를 입력하는 곳에 아래 코드로 전부 덮어 씌웁니다.

```js
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
    `https://usher.ttvnw.net/api/channel/hls` +
      parsed.href.replace(parsed.origin, ''),
    {
      headers: request.headers,
    }
  )
  response = new Response(response.body, response)
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}
```

5. 저장 및 배포 버튼을 클릭하여 배포합니다.

#### 2. 커스텀 Edge를 사용하도록 하기

1. 브라우저에서 Twitching 확장 프로그램 아이콘을 클릭합니다.
2. 텍스트 입력 칸에 만들어 둔 Worker 주소를 입력합니다. (예시 : test.account.workers.dev)

3. 선택 후 Twitch 페이지를 새로 고칩니다.