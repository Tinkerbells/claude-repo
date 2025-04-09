// import { Typography } from "@tinkerbells/xenon-ui";
// import { FC } from "react";
// import { RowsSettingsModal } from "./TableConfigModal/RowsSettingsModal";
// import { ColumnsSettingsModal } from "./TableConfigModal/ColumnsSettingsModal";

// type Props = {
//   rows: (string | number)[];
//   columns: (string | number)[][];
// };

// export const TableSettingsBlock: FC<Props> = ({ columns, rows }) => {

//   return (
//     <div style={{display:"flex"}}>
//       <div style={{ marginRight: "388px" }}>
//         <Typography as="p">Настройка строк таблицы</Typography>
//         <RowsSettingsModal modalOptions={rows} name="Настройка строк таблицы" />
//       </div>
//       <div>
//         <Typography as="p">Настройка колонок таблицы</Typography>
//         <ColumnsSettingsModal
//           modalOptions={columns}
//           name="Настройка колонок таблицы"
//         />
//       </div>
//     </div>
//   );
// };
