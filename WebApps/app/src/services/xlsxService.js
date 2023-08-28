import { saveAs } from "file-saver";
import { write, utils } from "xlsx";

/**
 * Save file as XLSX 
 * @param {Object} data JSON
 * @param {String} fileName 
 */
export const exportToSpreadsheet = (data, fileName = "ExcelNG") => new Promise((resolve, reject) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    // Desired file extesion
    const fileExtension = ".xlsx";
    try {
        let data1 = data[0];
        let _head = Object.keys(data1);
        let _body = data.map(e =>  _head.map(i => e[i]))
        _body.unshift(_head);

        data = _body;

        //Create a new Work Sheet using the data stored in an Array of Arrays.
        const workSheet = utils.aoa_to_sheet(data);
        // Generate a Work Book containing the above sheet.
        const workBook = {
            Sheets: { data: workSheet, cols: [] },
            SheetNames: ["data"],
        };
        // Exporting the file with the desired name and extension.
        const excelBuffer = write(workBook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: fileType });
        resolve(
            saveAs(fileData, fileName + fileExtension)
        )
    } catch (error) {
        reject({ error: true, msg: error })
    }
})
