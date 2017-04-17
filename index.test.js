const moment = require('moment')
const MackerelClient = require('./')

const MACKEREL_APIKEY = process.env['MACKEREL_APIKEY']

const client = new MackerelClient({mackerelApiKey: MACKEREL_APIKEY})

test('getHost', () => {
  return client.getHosts()
  .then(hosts => hosts[0].id)
  .then(hostId => client.getHost(hostId))
  .then(host => expect(host).toBeTruthy())
})

test('getHosts', () => {
  return client.getHosts()
  .then(hosts => expect(hosts).toBeTruthy())
})

test('getHostMetricNames', () => {
  return client.getHosts()
  .then(hosts => hosts[0])
  .then(host => {
    client.getHostMetricNames(host.id)
    .then(names => expect(names).toBeTruthy())
  })
})

test('getHostMetrics', () => {
  let now = moment().unix()

  return client.getHosts()
  .then(hosts => hosts[0])
  .then(host => {
    client.getHostMetrics(host.id, 'loadavg5', now - 3600, now)
    .then(metrics => expect(metrics).toBeTruthy())
  })
})

test('getLatestMetrics', () => {
  return client.getHosts()
  .then(hosts => hosts.map(host => host.id))
  .then(hostIds => {
    client.getLatestMetrics(hostIds, ['loadavg5', 'cpu.user.percentage', 'memory.used'])
    .then(metrics => expect(metrics).toBeTruthy())
  })
})

test('getAlerts', () => {
  return client.getAlerts()
  .then(alerts => expect(alerts).toBeTruthy())
})

test('getUsers', () => {
  return client.getUsers()
  .then(users => expect(users).toBeTruthy())
})

test('getOrganization', () => {
  return client.getOrganization()
  .then(org => expect(org).toBeTruthy())
})
