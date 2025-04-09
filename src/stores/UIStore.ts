import { makeAutoObservable } from 'mobx'

import type { RootStore } from './RootStore'

export class UIStore {
  rootStore: RootStore

  // UI state
  isCollapseOpen: boolean = true
  isButtonFetching: boolean = false
  isStartFetching: boolean = false
  isModalOpen: boolean = false

  // For creating new reports
  newReportName: string = ''

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  setCollapseOpen(isOpen: boolean) {
    this.isCollapseOpen = isOpen
  }

  setButtonFetching(isFetching: boolean) {
    this.isButtonFetching = isFetching
  }

  setStartFetching(isFetching: boolean) {
    this.isStartFetching = isFetching
  }

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen
  }

  setNewReportName(name: string) {
    this.newReportName = name
  }
}
