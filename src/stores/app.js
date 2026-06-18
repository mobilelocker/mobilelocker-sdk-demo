import mobilelocker from '@mobilelocker/javascript-sdk'
import { find, isArray, isObject } from 'lodash'
import { defineStore } from 'pinia'

const fakeUser = {
  name: 'Leo DelPrete',
  first_name: 'Leo',
  last_name: 'DelPrete',
  email: 'leo@mobilelocker.com',
}

export const useAppStore = defineStore('app', {
  state: () => ({
    busy: false,
    initializing: true,
    error: null,
    showExit: true,
    user: null,
  }),
  getters: {
    authenticated: state => isObject(state.user),
    team () {
      if (this.user && this.user.current_team_id && isArray(this.user.teams)) {
        return find(this.user.teams, t => t.id === this.user.current_team_id)
      }
      return null
    },
  },
  actions: {
    async initStore () {
      this.initializing = true
      try {
        await this.getUser()
      } catch (error) {
        throw error
      } finally {
        this.initializing = false
      }
    },
    async getUser () {
      if (mobilelocker.isApp()) {
        try {
          this.user = await mobilelocker.user.get()
          return this.user
        } catch (error) {
          this.user = null
          throw error
        }
      } else {
        this.user = fakeUser
        return fakeUser
      }
    },
  },
})
