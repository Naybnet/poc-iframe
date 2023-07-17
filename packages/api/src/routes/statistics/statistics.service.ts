import { countryStatistics, userStatistics } from '@poc-iframe/data'

export function getCountryStatistics() {
  console.debug('country statistics', countryStatistics)
  return countryStatistics
}

export function getUserStatistics(uid: string) {
  if (uid === 'user-1' || uid === 'user-2')
    return userStatistics[uid]
  throw new Error('unknown user')
}
