import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import type { DBTableDatabaseType } from '../../../types/tableForTable'

import { DEFAULT_STATE } from '../../../consts/globalConsts'

interface TableForTablesType {
  dbTableDataset: DBTableDatabaseType
  olapVersionId: number
}

const initialState: TableForTablesType = {
  dbTableDataset: {
    id: DEFAULT_STATE.NUMBER,
    physicalName: DEFAULT_STATE.STRING,
  },

  olapVersionId: DEFAULT_STATE.NUMBER,
}

export const tableForTablesSlice = createSlice({
  name: 'tableForTables',
  initialState,
  reducers: {
    updateSelectedTableDataset: (
      state,
      action: PayloadAction<{ id: number, physicalName: string }>,
    ) => {
      const { id, physicalName } = action.payload
      state.dbTableDataset = { id, physicalName }
    },

    setIdToGetOlap: (state, action: PayloadAction<number>) => {
      state.olapVersionId = action.payload
    },
  },
})

export const { updateSelectedTableDataset, setIdToGetOlap }
  = tableForTablesSlice.actions

export default tableForTablesSlice.reducer
