import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import type {
  AttributeFilter,
  CheckedFiltersType,
  SubTableModalContentType,
} from '../../../types/tableProps'

import { ATTRIBUTES_TYPES } from '../../../consts/pivotTableConsts'

interface TableConstructorType {
  allAttributes: AttributeFilter[]
  subTableFilters: CheckedFiltersType
  isButtonFetching: boolean
  subTableModal: {
    title: string
    parametrs: SubTableModalContentType[]
    // selectedParametrs: (string | number)[];
  }
}

const initialState: TableConstructorType = {
  allAttributes: [],
  subTableFilters: {
    rows: [],
    columns: [],
    indicator: [],
  },
  // subTableAttributeSelectedParametrs:{},
  isButtonFetching: false,
  subTableModal: {
    title: '',
    parametrs: [],
    // selectedParametrs: [],
  },
}

export const tableConstructorSlice = createSlice({
  name: 'tableConstructor',
  initialState,
  reducers: {
    setTableConstructorAllAttributes: (
      state,
      action: PayloadAction<AttributeFilter[]>,
    ) => {
      state.allAttributes = action.payload
    },

    updateAttributeType: (
      state,
      action: PayloadAction<{
        // id: string | number;
        attribute: string
        type: string
        selectedParametrs: (string | number)[]
      }>,
    ) => {
      const {
        // id,
        attribute,
        type,
        selectedParametrs,
      } = action.payload

      // console.log(selectedParametrs);

      state.allAttributes = state.allAttributes.map(item => ({
        ...item,
        checked: false,
      }))

      state.allAttributes = state.allAttributes.map((item) => {
        if (item.attribute === attribute) {
          return {
            ...item,
            type,
            attributeSelectedParametrs: selectedParametrs,
          }
        }
        return item
      })
    },

    setSubTableFilters: (state, action: PayloadAction<CheckedFiltersType>) => {
      state.subTableFilters = action.payload
    },
    deleteAttributeFromSubBlock: (state, action: PayloadAction<string>) => {
      state.allAttributes = state.allAttributes.map((item) => {
        if (item.attribute === action.payload) {
          return {
            ...item,
            type: ATTRIBUTES_TYPES.NOT_ASSIGNED,
            checked: false,
          }
        }
        return item
      })
    },

    setSubTableModalContent: (
      state,
      action: PayloadAction<{ title: string, parametrs: (string | number)[] }>,
    ) => {
      const { title, parametrs } = action.payload
      state.subTableModal.title = title
      state.subTableModal.parametrs = parametrs.map((item, index) => {
        return { parametr: item, id: `${index}-parametr` }
      })
    },

    setAttributeSelectedParametrs: (
      state,
      action: PayloadAction<{ attribute: string, selectedParametrs: (string | number)[] }>,
    ) => {
      const { attribute, selectedParametrs } = action.payload
      state.allAttributes = state.allAttributes.map((item) => {
        if (item.attribute === attribute) {
          return { ...item, attributeSelectedParametrs: selectedParametrs }
        }
        else {
          return item
        }
      })
    },

    setIsButtonFetching: (state, action: PayloadAction<boolean>) => {
      state.isButtonFetching = action.payload
    },

    changeAttributesGroupType: (
      state,
      action: PayloadAction<{ type: string, attributes: string[] }>,
    ) => {
      const { type, attributes } = action.payload

      state.allAttributes = state.allAttributes.map((attr) => {
        if (attributes.includes(attr.attribute)) {
          return {
            ...attr,
            type,
            checked: true,
          }
        }
        else {
          return {
            ...attr,
            checked: false,
          }
        }
      })
    },

    resetSelectedAttributes: (state) => {
      state.allAttributes = state.allAttributes.map((item) => {
        return { ...item, checked: false }
      })
      // state.swapperPanelAttributes = DEFAULT_STATE.ARRAY
    },
  },
})

export const {
  setTableConstructorAllAttributes,
  updateAttributeType,
  deleteAttributeFromSubBlock,
  setSubTableFilters,
  setSubTableModalContent,
  setAttributeSelectedParametrs,
  setIsButtonFetching,
  changeAttributesGroupType,
  resetSelectedAttributes,
} = tableConstructorSlice.actions

export default tableConstructorSlice.reducer
