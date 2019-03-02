import 'isomorphic-fetch'

const request = async (apiURL, method, uri, options = {}, headers) => {
  const additionalHeaders = headers ? headers() : {}
  if (options.body) {
    options.body = JSON.stringify(options.body)
  }
  options.headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
    ...(options.headers || {})
  }
  options = {method, ...options}
  const res = await fetch(apiURL + encodeURI(uri), options)
  const content = await res.json()
  if (Math.floor(res.status / 100) !== 2) {
    throw content
  }
  return {
    data: content,
    status: res.status,
    headers: res.headers
  }
}

const find = async (api, uri, where = false, options = {}) => {
  const {offset, limit, sort} = options
  let query = []
  if (offset) query.push('offset=' + offset)
  if (limit) query.push('limit=' + limit)
  if (sort) query.push('sort=' + sort)
  if (where) query.push('where=' + JSON.stringify(where))
  query = query.join('&')
  query = query ? '?' + query : ''
  const res = await api.get(uri + query)
  return {
    items: res.data,
    total: parseInt(res.headers.get('Content-Total'))
  }
}

const collection = (api, uri) => ({
  find: async (where, opts) => find(api, uri, where, opts),
  related: async (id, field, where, opts) =>
    find(api, uri + '/' + id + '/' + field, where, opts),
  one: async id => {
    const {data} = await api.get(uri + '/' + id)
    return data
  },
  add: async data => {
    const res = await api.post(uri, data)
    return res.data
  },
  edit: async (id, data) => {
    const res = await api.put(uri + '/' + id, data)
    return res.data
  },
  destroy: async id => {
    const {data} = await api.delete(uri + '/' + id)
    return data
  }
})

/**
 * Creates a REST API client.
 *
 * @param  {String}   apiURL
 * @param  {Function} getHeaders gets additional headers for the request.
 * @return {Object}
 */
export const createAPI = (apiURL, getHeaders) => {
  const client = {
    get: async (uri, options) =>
      request(apiURL, 'GET', uri, options, getHeaders),
    put: async (uri, body, options = {}) =>
      request(apiURL, 'PUT', uri, {body, ...options}, getHeaders),
    post: async (uri, body, options = {}) =>
      request(apiURL, 'POST', uri, {body, ...options}, getHeaders),
    delete: async (uri, body, options = {}) =>
      request(apiURL, 'DELETE', uri, {body, ...options}, getHeaders)
  }
  client.collection = uri => collection(client, uri)
  client.URL = apiURL
  return client
}

/**
 * Creates a REST API client mock to be used on tests.
 *
 * @return {Object}
 */
export const mockAPI = () => {
  const responses = {
    get: {},
    post: {},
    put: {},
    delete: {}
  }

  const requests = []

  const respond = async (method, uri, body) => {
    requests.push([method, uri, body])
    let res = responses[method][uri] || responses[method]['*']
    if (!res) throw `API client mock sends unknown request ${method} ${uri}`
    if (Object.prototype.toString.call(res) == '[object Function]')
      res = res(body)
    if (res.status && Math.floor(res.status / 100) !== 2) throw res.data
    return res
  }

  const client = {
    addResponse: (method, uri, res) => (responses[method][uri] = res),
    clearResponses: () => {
      responses.get = {}
      responses.put = {}
      responses.post = {}
      responses.delete = {}
      return client
    },
    sentRequests: () => requests,
    clearRequests: () => {
      requests.splice(0)
      return client
    },
    get: async uri => respond('get', uri),
    put: async (uri, body) => respond('put', uri, body),
    post: async (uri, body) => respond('post', uri, body),
    delete: async (uri, body) => respond('delete', uri, body)
  }
  client.collection = uri => collection(client, uri)
  return client
}
