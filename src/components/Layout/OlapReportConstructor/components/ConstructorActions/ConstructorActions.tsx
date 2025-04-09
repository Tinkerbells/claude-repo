import type { FC } from 'react'

import { ApplyAttributesPanel } from './ApplyAttributesPanel'
// import { SwapperAttributesPanel } from "./SwapperAttributesPanel";

// import { ApplyAttributesPanel } from "./ApplyAttributesPanel"

interface ConstructorActionsProps {
  pageId: string
}

export const ConstructorActions: FC<ConstructorActionsProps> = ({ pageId }) => {
  // const isSwapperPanelActive = useAppSelector((state) => state.swapperPanel.isSwapperPanelActive);
  // const isSwapperPanelActive=false;
  return (
    <>
      {/* <ApplyAttributesPanel />   */}
      <ApplyAttributesPanel pageId={pageId} />
      {/* {isSwapperPanelActive ? <SwapperAttributesPanel /> : <ApplyAttributesPanel pageId={pageId} />}   */}

    </>

  )
}
