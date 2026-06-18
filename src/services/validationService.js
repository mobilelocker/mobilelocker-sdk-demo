import { State } from 'country-state-city'

const US_STATE_CODES = new Set(State.getStatesOfCountry('US').map(s => s.isoCode))

export default {
  required: value => !!value || 'This field is required',

  email: value => {
    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return pattern.test(value) || 'Please enter a valid email address'
  },

  npi: value => {
    if (!value) return true
    return /^\d{10}$/.test(value) || 'NPI must be exactly 10 digits'
  },

  usZipCode: value => {
    if (!value) return true
    return /^\d{5}$/.test(value) || 'Please enter a valid 5-digit ZIP code'
  },

  usPhone: value => {
    if (!value) return true
    const digits = value.replace(/\D/g, '')
    return digits.length === 10 || 'Please enter a valid 10-digit US phone number'
  },

  usState: value => {
    if (!value) return true
    return US_STATE_CODES.has(value) || 'Please select a valid U.S. state'
  },

  radioRequired: value => value !== null || 'Please select an option',
}
