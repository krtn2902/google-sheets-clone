import React, { useState } from "react";
import Cell from "./Cell";
import { columnToLetter } from "../utils/formulas";
import {
    updateCellDependencies,
    evaluateFormula,
    updateDependentCells,
} from "../utils/cellUtils";

const Grid = ({
    cellData,
    setCellData,
    selectedCell,
    setSelectedCell,
    editingCell,
    setEditingCell,
}) => {
    const [startSelection, setStartSelection] = useState(null);
    const [endSelection, setEndSelection] = useState(null);

    const handleCellSelect = (rowIndex, colIndex) => {
        setSelectedCell({ row: rowIndex, col: colIndex });
        setEditingCell(false);
    };

    const handleCellDoubleClick = (rowIndex, colIndex) => {
        setSelectedCell({ row: rowIndex, col: colIndex });
        setEditingCell(true);
    };

    const handleCellChange = (rowIndex, colIndex, value) => {
        const newCellData = [...cellData];

        // Store the raw input as the formula if it starts with =
        if (value.startsWith("=")) {
            newCellData[rowIndex][colIndex].formula = value;
        } else {
            newCellData[rowIndex][colIndex].formula = "";
        }

        // Update the cell value
        newCellData[rowIndex][colIndex].value = value;
        newCellData[rowIndex][colIndex].formatted = value;

        setCellData(newCellData);
    };

    const handleCellBlur = () => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const cell = cellData[row][col];

        // If it's a formula, evaluate it
        if (cell.formula && cell.formula.startsWith("=")) {
            // First, update dependencies
            let newCellData = [...cellData];
            newCellData = updateCellDependencies(
                newCellData,
                row,
                col,
                cell.formula
            );

            // Then evaluate the formula
            const result = evaluateFormula(cell.formula, newCellData);

            newCellData[row][col].value = result;
            newCellData[row][col].formatted = result;

            // Update dependent cells
            newCellData = updateDependentCells(newCellData, row, col);

            setCellData(newCellData);
        }

        setEditingCell(false);
    };

    const handleCellKeyDown = (e) => {
        if (e.key === "Enter") {
            handleCellBlur();

            // Move to the cell below
            if (selectedCell.row < cellData.length - 1) {
                setSelectedCell({
                    row: selectedCell.row + 1,
                    col: selectedCell.col,
                });
            }

            e.preventDefault();
        } else if (e.key === "Tab") {
            handleCellBlur();

            // Move to the next cell
            if (selectedCell.col < cellData[0].length - 1) {
                setSelectedCell({
                    row: selectedCell.row,
                    col: selectedCell.col + 1,
                });
            } else if (selectedCell.row < cellData.length - 1) {
                setSelectedCell({
                    row: selectedCell.row + 1,
                    col: 0,
                });
            }

            e.preventDefault();
        } else if (e.key === "Escape") {
            setEditingCell(false);
            e.preventDefault();
        }
    };

    // Handle cell dragging for selection
    const handleMouseDown = (e, rowIndex, colIndex) => {
        setStartSelection({ row: rowIndex, col: colIndex });
        setEndSelection({ row: rowIndex, col: colIndex });

        // Add event listeners for drag
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!startSelection) return;

        // Find the cell under the mouse
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element && element.closest(".cell")) {
            const cell = element.closest(".cell");
            const rowIndex = parseInt(cell.dataset.row);
            const colIndex = parseInt(cell.dataset.col);

            setEndSelection({ row: rowIndex, col: colIndex });
        }
    };

    const handleMouseUp = () => {
        // Remove event listeners
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const isCellSelected = (rowIndex, colIndex) => {
        if (!selectedCell) return false;

        return selectedCell.row === rowIndex && selectedCell.col === colIndex;
    };

    const isCellInSelection = (rowIndex, colIndex) => {
        if (!startSelection || !endSelection) return false;

        const minRow = Math.min(startSelection.row, endSelection.row);
        const maxRow = Math.max(startSelection.row, endSelection.row);
        const minCol = Math.min(startSelection.col, endSelection.col);
        const maxCol = Math.max(startSelection.col, endSelection.col);

        return (
            rowIndex >= minRow &&
            rowIndex <= maxRow &&
            colIndex >= minCol &&
            colIndex <= maxCol
        );
    };

    return (
        <div className="grid">
            <div className="column-headers">
                <div className="header-cell corner-cell"></div>
                {cellData[0].map((_, colIndex) => (
                    <div key={colIndex} className="header-cell">
                        {columnToLetter(colIndex)}
                    </div>
                ))}
            </div>

            <div className="rows">
                {cellData.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        <div className="header-cell row-header">
                            {rowIndex + 1}
                        </div>
                        {row.map((_, colIndex) => (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                cellData={cellData}
                                selected={isCellSelected(rowIndex, colIndex)}
                                editing={
                                    editingCell &&
                                    isCellSelected(rowIndex, colIndex)
                                }
                                onSelect={handleCellSelect}
                                onChange={handleCellChange}
                                onDoubleClick={handleCellDoubleClick}
                                onBlur={handleCellBlur}
                                onKeyDown={handleCellKeyDown}
                                data-row={rowIndex}
                                data-col={colIndex}
                                onMouseDown={(e) =>
                                    handleMouseDown(e, rowIndex, colIndex)
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grid;
