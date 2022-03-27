export default function(url, method = 'GET', body = {}) {
  const opts = { method }
  if (['POST', 'PUT'].includes(method)) {
    opts.headers = {
      'Content-Type': 'application/json'
    }
    opts.body = JSON.stringify(body)
  }
  return fetch(url, opts).then(res => res.json())
}