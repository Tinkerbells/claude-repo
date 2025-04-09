import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import { DEFAULT_STATE } from '../../../consts/globalConsts'
import { ATTRIBUTES_TYPES } from '../../../consts/pivotTableConsts'
// import { resetSelectedAttributes } from "../tableConstructor/tableConstructorSlice";
// import { DEFAULT_STATE } from "../../../consts/globalConsts";

interface SwapperPanelType {
  swapperPanelType: string
  isSwapperPanelActive: boolean
  swapperPanelAttributes: string[]
  // isSwapperPanelResetActive: boolean;
}

const initialState: SwapperPanelType = {
  swapperPanelType: ATTRIBUTES_TYPES.NOT_ASSIGNED,
  isSwapperPanelActive: false,
  swapperPanelAttributes: DEFAULT_STATE.ARRAY,
  // isSwapperPanelResetActive: false,
}

export const swapperPanelSlice = createSlice({
  name: 'swapperPanel',
  initialState,
  reducers: {

    setSwapperPanelActive: (state, action: PayloadAction<boolean>) => {
      state.isSwapperPanelActive = action.payload
    },

    setSwapperPanelType: (state, action: PayloadAction<string>) => {
      state.swapperPanelType = action.payload
    },

    setSwapperPanelAttributes: (state, action: PayloadAction<string[]>) => {
      state.swapperPanelAttributes = action.payload
    },
  },
  // extraReducers: (builder) => {
  //     builder.addCase(resetSelectedAttributes, (state) => {
  //       state.swapperPanelAttributes = DEFAULT_STATE.ARRAY;
  //     });
  //   },
})

export const {
  setSwapperPanelActive,
  setSwapperPanelType,
  setSwapperPanelAttributes,
} = swapperPanelSlice.actions

export default swapperPanelSlice.reducer
