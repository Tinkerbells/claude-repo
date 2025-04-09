import type { ReactNode } from 'react'

import React from 'react'

import { RootStore, RootStoreContext } from './RootStore'

interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  // Create store instance only once using React.useState
  const [rootStore] = React.useState(() => new RootStore())

  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  )
}
