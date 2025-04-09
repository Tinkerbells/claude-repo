// import { FC, useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../../store/store";
// import { setSelectedTableSettingsColumns } from "../../../store/features/tableSettings/tableSettingsSlice";
// import { ButtonTableSettings } from "../../ui/ButtonTableSettings/ButtonTableSettings";
// import { Checkbox } from "@tinkerbells/xenon-ui";

// // import { ButtonTableSettings } from "components/ui/ButtonTableSettings/ButtonTableSettings";
// // import { Checkbox } from "@tinkerbells/xenon-ui";
// // import { useAppDispatch, useAppSelector } from "store/store";
// // import { setSelectedTableSettingsColumns } from "store/features/tableSettings/tableSettingsSlice";

// type Props = {
//   modalOptions: (string | number)[][];
//   name: string;
// };

// export const ColumnsSettingsModal: FC<Props> = (props) => {
//   const { modalOptions, name } = props;
//   const [checked, setChecked] = useState<(string | number)[][]>([]);
//   const selectedOptions = useAppSelector(
//     (state) => state.tableSettings.columns
//   );
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     setChecked(selectedOptions);
//   }, [selectedOptions]);

//   const handleOptionsChange = (
//     index: number,
//     option: string | number,
//     isChecked: boolean
//   ) => {
//     setChecked((prevChecked) => {
//       const newChecked = [...prevChecked];
//       if (!newChecked[index]) {
//         newChecked[index] = [];
//       }

//       if (isChecked) {
//         newChecked[index] = [...newChecked[index], option];
//       } else {
//         newChecked[index] = newChecked[index].filter((item) => item !== option);
//       }

//       return newChecked;
//     });
//   };

//   const handleApply = () => {
//     dispatch(setSelectedTableSettingsColumns(checked))
//   };

//   return (
//     <>
//       <ButtonTableSettings name={name} onHandleApply={handleApply}>
//         <div>
//           {modalOptions?.length > 0 &&
//             modalOptions.map((optionsArray, index) => (
//               <div key={`columnsRow-${index}`}>
//                 <ul>
//                   {optionsArray.filter((item) => item !=="").map((option) => (
//                     <li key={option}>
//                       <div className="check">
//                         <Checkbox
//                           label={option}
//                           checked={checked[index]?.includes(option) ?? false}
//                           onChange={(e) =>
//                             handleOptionsChange(index, option, e.target.checked)
//                           }
//                         />
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="check-separator" />
//               </div>
//             ))}
//         </div>
//       </ButtonTableSettings>
//     </>
//   );
// };
