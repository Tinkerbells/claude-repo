// import { Button, Select, Typography } from "@tinkerbells/xenon-ui";
// import { useAppDispatch } from "../../../../../store/store";
// //import { CheckedIconOutlined } from "../../../../../assets/Icons";
// import { useState } from "react";
// import {
//   changeAttributesGroupType,
//   resetSelectedAttributes,
// } from "../../../../../store/features/tableConstructor/tableConstructorSlice";
// import {
//   ATTRIBUTES_TYPES,
//   subTableSelectOptions,
// } from "../../../../../consts/pivotTableConsts";
// import { setSwapperPanelActive, setSwapperPanelAttributes, setSwapperPanelType } from "../../../../../store/features/tableConstructor/swapperPanelSlice";
// import { DEFAULT_STATE } from "../../../../../consts/globalConsts";

// export const SwapperAttributesPanel = () => {
//   const [currentSelectType, setCurrentSelectType] = useState("");
//   //const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isButtonActive, setIsButtonActive] = useState(false);

//   // const swapperPanelAttributes = useAppSelector(
//   //   (state) => state.swapperPanel.swapperPanelAttributes
//   // );
//   // const swapperPanelType = useAppSelector(
//   //   (state) => state.swapperPanel.swapperPanelType
//   // );

//   const dispatch = useAppDispatch();

//   // useEffect(() => {
//   //   if (swapperPanelType) {
//   //     setCurrentSelectType(swapperPanelType);
//   //   }
//   // }, [swapperPanelType]);

//   // const handleOptionChange = (option: string) => {
//   //   if (option === swapperPanelType) {
//   //     setIsButtonActive(false);
//   //     setCurrentSelectType(option);
//   //   } else {
//   //     setIsButtonActive(true);
//   //     //console.log(option);
//   //     setCurrentSelectType(option);
//   //   }
//   // };

//   // const handleApply = () => {
//   //   dispatch(
//   //     changeAttributesGroupType({
//   //       type: currentSelectType,
//   //       attributes: swapperPanelAttributes,
//   //     })
//   //   );
//   //   //console.log(currentSelectType);
//   //   dispatch(setSwapperPanelType(currentSelectType));
//   //   setIsButtonActive(false);
//   // };

//   const handleReset = () => {
//     //console.log("clicked");
//     //dispatch(setSwapperPanelResetActive(true));
//     dispatch(setSwapperPanelActive(false));
//     dispatch(setSwapperPanelType(ATTRIBUTES_TYPES.NOT_ASSIGNED));
//     dispatch(resetSelectedAttributes());
//     dispatch(setSwapperPanelAttributes(DEFAULT_STATE.ARRAY))
//     // console.log(swapperPanelAttributes);
//   };

//   return (
//     <div className="table-constructor__actions">
//       <div className="table-constructor__actions-item swapper-panel-text">
//         <Typography textStyle="strong">
//           Выбрано: {swapperPanelAttributes.length}
//         </Typography>
//         <Typography>Выберите, куда поместить атрибуты</Typography>
//       </div>
//       <div className="table-constructor__actions-item swapper-panel__actions">
//         <Select
//           className="swapper-panel__select"
//           value={currentSelectType}
//           options={subTableSelectOptions}
//           onChange={handleOptionChange}
//         />
//         <Button
//           className="swapper-panel__button"
//           disabled={!isButtonActive}
//           onClick={handleApply}
//         >
//           Сохранить
//         </Button>
//         <Button variant="ghost" onClick={handleReset}>
//           Сбросить
//         </Button>
//       </div>
//     </div>
//   );
// };
