import React, { useState, useEffect } from "react";
import Toolbar from "./ToolBar";
import FormulaBar from "./FormulaBar";
import Grid from "./Grid";
import {
    createEmptySheet,
    updateCellDependencies,
    updateDependentCells,
} from "../utils/cellUtils";
import { evaluateFormula } from "../utils/formulas";

const Spreadsheet = () => {
    const [cellData, setCellData] = useState(() => createEmptySheet());
    const [selectedCell, setSelectedCell] = useState(null);
    const [editingCell, setEditingCell] = useState(false);

    // Handle cell content change
    const handleCellChange = (row, col, value) => {
        const newCellData = [...cellData];

        // Store the raw input as the formula if it starts with =
        if (value.startsWith("=")) {
            newCellData[row][col].formula = value;
        } else {
            newCellData[row][col].formula = "";
        }

        // Update the cell value
        newCellData[row][col].value = value;
        newCellData[row][col].formatted = value;

        setCellData(newCellData);
    };

    // Add row
    const addRow = () => {
        const newCellData = [...cellData];
        const newRow = [];

        for (let j = 0; j < cellData[0].length; j++) {
            newRow.push({
                value: "",
                formula: "",
                formatted: "",
                style: {},
                dependencies: [],
            });
        }

        if (selectedCell) {
            // Add row after the selected cell
            newCellData.splice(selectedCell.row + 1, 0, newRow);
        } else {
            // Add row at the end
            newCellData.push(newRow);
        }

        setCellData(newCellData);
    };

    // Delete row
    const deleteRow = () => {
        if (!selectedCell) return;

        const newCellData = [...cellData];
        newCellData.splice(selectedCell.row, 1);

        // Ensure at least one row exists
        if (newCellData.length === 0) {
            setCellData(createEmptySheet(1, cellData[0].length));
        } else {
            setCellData(newCellData);
        }
    };

    // Add column
    const addColumn = () => {
        const newCellData = [...cellData];

        for (let i = 0; i < newCellData.length; i++) {
            const newCell = {
                value: "",
                formula: "",
                formatted: "",
                style: {},
                dependencies: [],
            };

            if (selectedCell) {
                // Add column after the selected cell
                newCellData[i].splice(selectedCell.col + 1, 0, newCell);
            } else {
                // Add column at the end
                newCellData[i].push(newCell);
            }
        }

        setCellData(newCellData);
    };

    // Delete column
    const deleteColumn = () => {
        if (!selectedCell) return;

        const newCellData = [...cellData];

        for (let i = 0; i < newCellData.length; i++) {
            newCellData[i].splice(selectedCell.col, 1);
        }

        // Ensure at least one column exists
        if (newCellData[0].length === 0) {
            setCellData(createEmptySheet(cellData.length, 1));
        } else {
            setCellData(newCellData);
        }
    };

    // Resize row (placeholder implementation)
    const resizeRow = (rowIndex, height) => {
        console.log(`Resize row ${rowIndex} to height ${height}`);
        // Would implement actual resizing logic here
    };

    // Resize column (placeholder implementation)
    const resizeColumn = (colIndex, width) => {
        console.log(`Resize column ${colIndex} to width ${width}`);
        // Would implement actual resizing logic here
    };

    useEffect(() => {
        // Initialize with some test data
        const initialData = createEmptySheet();

        // Add some sample data
        initialData[0][0].value = "Month";
        initialData[0][1].value = "Sales";
        initialData[0][2].value = "Expenses";
        initialData[0][3].value = "Profit";

        initialData[1][0].value = "January";
        initialData[1][1].value = 1000;
        initialData[1][2].value = 700;
        initialData[1][3].formula = "=B2-C2";
        initialData[1][3].value = 300;

        initialData[2][0].value = "February";
        initialData[2][1].value = 1200;
        initialData[2][2].value = 800;
        initialData[2][3].formula = "=B3-C3";
        initialData[2][3].value = 400;

        initialData[3][0].value = "March";
        initialData[3][1].value = 1500;
        initialData[3][2].value = 900;
        initialData[3][3].formula = "=B4-C4";
        initialData[3][3].value = 600;

        initialData[4][0].value = "Total";
        initialData[4][1].formula = "=SUM(B2:B4)";
        initialData[4][1].value = 3700;
        initialData[4][2].formula = "=SUM(C2:C4)";
        initialData[4][2].value = 2400;
        initialData[4][3].formula = "=SUM(D2:D4)";
        initialData[4][3].value = 1300;

        // Update cell dependencies
        let updatedData = [...initialData];

        // For formulas, update dependencies
        updatedData = updateCellDependencies(updatedData, 1, 3, "=B2-C2");
        updatedData = updateCellDependencies(updatedData, 2, 3, "=B3-C3");
        updatedData = updateCellDependencies(updatedData, 3, 3, "=B4-C4");
        updatedData = updateCellDependencies(updatedData, 4, 1, "=SUM(B2:B4)");
        updatedData = updateCellDependencies(updatedData, 4, 2, "=SUM(C2:C4)");
        updatedData = updateCellDependencies(updatedData, 4, 3, "=SUM(D2:D4)");

        setCellData(updatedData);
    }, []);

    return (
        <div className="spreadsheet">
            <Toolbar
                cellData={cellData}
                selectedCell={selectedCell}
                setCellData={setCellData}
                addRow={addRow}
                deleteRow={deleteRow}
                addColumn={addColumn}
                deleteColumn={deleteColumn}
                resizeRow={resizeRow}
                resizeColumn={resizeColumn}
            />
            <FormulaBar
                cellData={cellData}
                selectedCell={selectedCell}
                onChange={handleCellChange}
            />
            <Grid
                cellData={cellData}
                setCellData={setCellData}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
            />
        </div>
    );
};

export default Spreadsheet;
