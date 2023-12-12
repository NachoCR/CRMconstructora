import * as XLSX from "xlsx";

// const getFileName = (name?: string) => {
//   let timeSpan = new Date().toISOString();
//   let sheetName = name || "ExportResult";
//   let fileName = `${sheetName}-${timeSpan}`;
//   return {
//     sheetName,
//     fileName
//   };
// };

export class TableUtil {

  static exportTableToExcel(table? : any) {
    
    console.log(table);
    let wb = XLSX.utils.table_to_book(table._data, <XLSX.Table2SheetOpts>{
      sheet: "usuarios"
    });
    XLSX.writeFile(wb, `usuarios.xlsx`);
  }
}
