import {assert} from 'chai'
import {createAPI} from './api'

describe('services > api', () => {
  // the HTTP request sent via fetch
  const req = {
    url: '',
    options: {}
  }
  const assertRequest = ({url, options}) => {
    req.options = {body: undefined, ...req.options}
    assert.deepEqual(req, {
      url,
      options: {body: undefined, ...options}
    })
  }

  const mapOf = data => {
    const m = new Map()
    for (const name in data) m.set(name, data[name])
    return m
  }

  const res = {
    // the HTTP response
    headers: mapOf({}),
    status: 200,
    content: {}
  }
  const mockResponse = (content, status = 200, headers = {}) => {
    res.status = status
    res.content = content
    res.headers = mapOf(headers)
  }

  // mocking the fetch function to set the
  // req and return the mock response
  fetch = async (url, opts) => {
    req.url = url
    req.options = opts
    return {
      json: async () => res.content,
      status: res.status,
      headers: res.headers
    }
  }

  const assertAPI = async ({call, sendsReq, receivesRes, returns, throws}) => {
    receivesRes || (receivesRes = {content: {}, status: 200, headers: {}})

    mockResponse(receivesRes.content, receivesRes.status, receivesRes.headers)

    if (sendsReq) {
      const body = sendsReq.body
      sendsReq = {
        url: sendsReq.url,
        options: {
          method: sendsReq.method,
          headers: sendsReq.headers || {
            'Content-Type': 'application/json',
            Authorization: 'Bearer xxx'
          }
        }
      }
      if (body) sendsReq.options.body = JSON.stringify(body)
    }

    if (throws) {
      try {
        await call()
        assert.isTrue(false, 'Should have thrown an error!')
      } catch (error) {
        if (sendsReq) assertRequest(sendsReq)
        assert.deepEqual(error, throws)
      }
    } else {
      const result = await call()
      if (sendsReq) assertRequest(sendsReq)
      if (returns) assert.deepEqual(result, returns)
    }
  }

  const apiURL = 'http://api'
  const api = createAPI(apiURL, () => ({
    Authorization: 'Bearer xxx'
  }))
  const uri = x => apiURL + encodeURI(x)

  it('throws error if response status is not 2xx', async () =>
    assertAPI({
      call: () => api.get('/'),
      receivesRes: {
        status: 500,
        content: {
          error: 'some weird server error'
        }
      },
      throws: {
        error: 'some weird server error'
      }
    }))

  it('returns response status, headers and content if status is 2xx', async () =>
    assertAPI({
      call: () => api.get('/'),
      receivesRes: {
        status: 200,
        content: {numbers: [1, 2, 3]},
        headers: {'Content-Total': 3}
      },
      returns: {
        status: 200,
        data: {numbers: [1, 2, 3]},
        headers: mapOf({'Content-Total': 3})
      }
    }))

  it('sends a GET request', async () =>
    assertAPI({
      call: () => api.get('/some-url'),
      sendsReq: {
        url: uri('/some-url'),
        method: 'GET'
      }
    }))

  it('sends a POST request', async () =>
    assertAPI({
      call: () => api.post('/some-other-url', {foo: 'bar'}),
      sendsReq: {
        url: uri('/some-other-url'),
        method: 'POST',
        body: {foo: 'bar'}
      }
    }))

  it('sends a PUT request', async () =>
    assertAPI({
      call: () => api.put('/an-optional-url', {foo: 'bar'}),
      sendsReq: {
        url: uri('/an-optional-url'),
        method: 'PUT',
        body: {foo: 'bar'}
      }
    }))

  it('sends a DELETE request', async () =>
    assertAPI({
      call: () => api.delete('/something-we-dont-need', {foo: 'bar'}),
      sendsReq: {
        url: uri('/something-we-dont-need'),
        method: 'DELETE',
        body: {foo: 'bar'}
      }
    }))

  it('collection does get a list of items', async () =>
    assertAPI({
      call: () =>
        api
          .collection('/questions')
          .find({answered: false}, {offset: 10, limit: 50, sort: '-createdAt'}),
      sendsReq: {
        url: uri(
          '/questions?offset=10&limit=50&sort=-createdAt&where={"answered":false}'
        ),
        method: 'GET'
      },
      receivesRes: {
        headers: {
          'Content-Total': 100
        },
        content: [1, 2, 3]
      },
      returns: {
        items: [1, 2, 3],
        total: 100
      }
    }))

  it('collection does get one item by id', async () =>
    assertAPI({
      call: () => api.collection('/questions').one('abc123'),
      sendsReq: {
        url: uri('/questions/abc123'),
        method: 'GET'
      },
      receivesRes: {
        content: {foo: 'bar'}
      },
      returns: {foo: 'bar'}
    }))

  it('collection does get related items', async () =>
    assertAPI({
      call: () =>
        api.collection('/questions').related('abc123', 'friends', {
          name: {$regex: '^A', $options: 'i'}
        }),
      sendsReq: {
        url: uri(
          '/questions/abc123/friends?where=' +
            JSON.stringify({name: {$regex: '^A', $options: 'i'}})
        ),
        method: 'GET'
      },
      receivesRes: {
        headers: {
          'Content-Total': 10
        },
        content: [4, 5, 6]
      },
      returns: {
        items: [4, 5, 6],
        total: 10
      }
    }))

  it('collection does add an item', async () =>
    assertAPI({
      call: () => api.collection('/questions').add({foo: 'bar', lorem: 'baz'}),
      sendsReq: {
        url: uri('/questions'),
        method: 'POST',
        body: {foo: 'bar', lorem: 'baz'}
      },
      receivesRes: {
        content: {id: '123abc', foo: 'bar', lorem: 'baz'}
      },
      returns: {id: '123abc', foo: 'bar', lorem: 'baz'}
    }))

  it('collection does edit an item', async () =>
    assertAPI({
      call: () => api.collection('/questions').edit(123, {foo: 'bar'}),
      sendsReq: {
        url: uri('/questions/123'),
        method: 'PUT',
        body: {foo: 'bar'}
      },
      receivesRes: {
        content: {id: 123, foo: 'bar', lorem: 'baz'}
      },
      returns: {id: 123, foo: 'bar', lorem: 'baz'}
    }))

  it('collection does remove an item', async () =>
    assertAPI({
      call: () => api.collection('/questions').destroy(123),
      sendsReq: {
        url: uri('/questions/123'),
        method: 'DELETE',
        body: undefined
      }
    }))
})
