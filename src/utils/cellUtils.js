import { letterToColumn, evaluateFormula } from "./formulas";

export { evaluateFormula };

export const createEmptySheet = (rows = 50, cols = 26) => {
    const sheet = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push({
                value: "",
                formula: "",
                formatted: "",
                style: {},
                dependencies: [],
            });
        }
        sheet.push(row);
    }

    return sheet;
};

export const updateCellDependencies = (cellData, row, col, formula) => {
    // Clear existing dependencies
    cellData[row][col].dependencies = [];

    if (!formula.startsWith("=")) {
        return cellData;
    }

    // Find all cell references in the formula
    const cellRefs = formula.match(/[A-Z]+[0-9]+/g) || [];
    const rangeRefs = formula.match(/[A-Z]+[0-9]+:[A-Z]+[0-9]+/g) || [];

    // Add single cell dependencies
    for (const ref of cellRefs) {
        if (!rangeRefs.some((range) => range.includes(ref))) {
            const colIndex = letterToColumn(ref.match(/^[A-Z]+/)[0]);
            const rowIndex = parseInt(ref.match(/[0-9]+$/)[0]) - 1;

            cellData[row][col].dependencies.push({
                row: rowIndex,
                col: colIndex,
            });
        }
    }

    // Add range dependencies
    for (const rangeRef of rangeRefs) {
        const [start, end] = rangeRef.split(":");

        const startCol = letterToColumn(start.match(/^[A-Z]+/)[0]);
        const startRow = parseInt(start.match(/[0-9]+$/)[0]) - 1;

        const endCol = letterToColumn(end.match(/^[A-Z]+/)[0]);
        const endRow = parseInt(end.match(/[0-9]+$/)[0]) - 1;

        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                cellData[row][col].dependencies.push({ row: i, col: j });
            }
        }
    }

    return cellData;
};

export const updateDependentCells = (cellData, row, col) => {
    // Find all cells that depend on this cell
    for (let i = 0; i < cellData.length; i++) {
        for (let j = 0; j < cellData[i].length; j++) {
            const cell = cellData[i][j];

            if (
                cell.dependencies.some(
                    (dep) => dep.row === row && dep.col === col
                )
            ) {
                // Re-evaluate formula
                if (cell.formula.startsWith("=")) {
                    const result = evaluateFormula(cell.formula, cellData);
                    cellData[i][j].value = result;
                    cellData[i][j].formatted = result;

                    // Recursively update cells that depend on this one
                    updateDependentCells(cellData, i, j);
                }
            }
        }
    }

    return cellData;
};
