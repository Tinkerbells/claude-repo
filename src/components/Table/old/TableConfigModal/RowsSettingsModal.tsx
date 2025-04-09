// import { FC, useEffect, useState } from "react";
// import { Checkbox } from "@tinkerbells/xenon-ui";
// import { useAppDispatch, useAppSelector } from "store/store";
// import { setSelectedTableRowsPoints } from "store/features/tableRows/tableRowsSlice";
// import { ButtonTableSettings } from "components/ui/ButtonTableSettings/ButtonTableSettings";

// type Props = {
//   modalOptions: string[];
//   name: string;
// };

// export const RowsSettingsModal: FC<Props> = (props) => {
//   const { modalOptions, name } = props;
//   const [checked, setChecked] = useState<string[]>([]);
//   const selectedOptions = useAppSelector(
//     (state) => state.selectedTableRows.value
//   );
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     setChecked(selectedOptions);
//   }, [selectedOptions]);

//   const handleOptionsChange = (option: string, isChecked: boolean) => {
//     setChecked((prevChecked) => {
//       if (isChecked) {
//         return [...prevChecked, option];
//       } else {
//         return prevChecked.filter((item) => item !== option);
//       }
//     });
//   };

//   const handleApply = () => {
//     dispatch(setSelectedTableRowsPoints(checked));
//   };

//   return (
//     <>
//       <ButtonTableSettings name={name} onHandleApply={handleApply}>
//         <ul>
//           {modalOptions?.length > 0 &&
//             modalOptions.map((option) => (
//               <li key={option}>
//                 <div className="check">
//                   <Checkbox
//                     label={option}
//                     checked={checked.includes(option)}
//                     onChange={(e) =>
//                       handleOptionsChange(option, e.target.checked)
//                     }
//                   />
//                 </div>
//                 <div className="check-separator" />
//               </li>
//             ))}
//         </ul>
//       </ButtonTableSettings>
//     </>
//   );
// };
