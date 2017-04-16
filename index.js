require('es6-promise').polyfill()
require('isomorphic-fetch')
const clone = require('clone')
const url = require('url')

class MackerelClient {
  /**
   * @constructor
   * @param {Object} args
   */
  constructor (args) {
    let origin = 'https://mackerel.io'
    this.apiKey = ''

    if (args.hasOwnProperty('origin')) {
      origin = args.origin
    }

    this.origin = url.parse(origin, true)

    if (args.hasOwnProperty('mackerelApiKey')) {
      this.apiKey = args.mackerelApiKey
    }

    if (this.apiKey === '') {
      throw new Error('API key is absent.')
    }

    this.headers = {
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    }
  }

  /**
   * @param {string} hostId
   */
  getHost (hostId) {
    let urlObj = clone(this.origin)
    urlObj.pathname = '/api/v0/hosts/' + hostId
    return fetch(url.format(urlObj), {headers: this.headers})
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(json => json.host)
  }

  /**
   * @return {Promise}
   */
  getHosts () {
    let urlObj = clone(this.origin)
    urlObj.pathname = '/api/v0/hosts'
    return fetch(url.format(urlObj), {headers: this.headers})
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(json => json.hosts)
  }

  /**
   * @param {string} hostId
   * @return {Promise}
   */
  getHostMetricNames (hostId) {
    let urlObj = clone(this.origin)
    urlObj.pathname = '/api/v0/hosts/' + hostId + '/metric-names'

    return fetch(url.format(urlObj), {headers: this.headers})
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(json => json.names)
  }

  /**
   * @param {string} hostId
   * @param {string} name
   * @param {number} from
   * @param {number} to
   * @return {Promise}
   */
  getHostMetrics (hostId, name, from, to) {
    let urlObj = clone(this.origin)
    urlObj.pathname = '/api/v0/hosts/' + hostId + '/metrics'
    urlObj.query = {
      name: name,
      from: from,
      to: to
    }

    return fetch(url.format(urlObj), {headers: this.headers})
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(json => json.metrics)
  }

  /**
   * @param {string[]} hostIds
   * @param {string[]} names
   * @return {Promise}
   */
  getLatestMetrics (hostIds, names) {
    let queryStr = ''
    hostIds.forEach(hostId => {
      if (queryStr.length !== 0) {
        queryStr = queryStr + '&'
      }
      queryStr = queryStr + 'hostId=' + hostId
    })
    names.forEach(name => {
      if (queryStr.length !== 0) {
        queryStr = queryStr + '&'
      }
      queryStr = queryStr + 'name=' + name
    })

    let urlObj = clone(this.origin)
    urlObj.pathname = '/api/v0/tsdb/latest'

    return fetch(url.format(urlObj) + '?' + queryStr, {headers: this.headers})
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(json => json.tsdbLatest)
  }
}

module.exports = MackerelClient
