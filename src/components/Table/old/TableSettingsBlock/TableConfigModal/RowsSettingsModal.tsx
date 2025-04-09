// import { FC, useEffect, useState } from "react";
// import { Checkbox } from "@tinkerbells/xenon-ui";
// import { useAppDispatch, useAppSelector } from "../../../store/store";
// import { setSelectedTableSettingsRows } from "../../../store/features/tableSettings/tableSettingsSlice";
// import { ButtonTableSettings } from "../../ui/ButtonTableSettings/ButtonTableSettings";
// // import { useAppDispatch, useAppSelector } from "store/store";
// // import { setSelectedTableSettingsRows } from "store/features/tableSettings/tableSettingsSlice";
// // import { ButtonTableSettings } from "components/ui/ButtonTableSettings/ButtonTableSettings";

// type Props = {
//   modalOptions: (string | number)[];
//   name: string;
// };

// export const RowsSettingsModal: FC<Props> = (props) => {
//   const { modalOptions, name } = props;
//   const [checked, setChecked] = useState<(string | number)[]>([]);
//   const selectedOptions = useAppSelector(
//     (state) => state.tableSettings.rows
//   );
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     setChecked(selectedOptions);
//   }, [selectedOptions]);

//   const handleOptionsChange = (option: string | number, isChecked: boolean) => {
//     setChecked((prevChecked) => {
//       if (isChecked) {
//         return [...prevChecked, option];
//       } else {
//         return prevChecked.filter((item) => item !== option);
//       }
//     });
//   };

//   const handleApply = () => {
//     dispatch(setSelectedTableSettingsRows(checked));
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
//                     checked={checked.includes(option) ?? false}
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
