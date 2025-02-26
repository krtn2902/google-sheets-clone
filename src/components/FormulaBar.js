import React from "react";
import { columnToLetter } from "../utils/formulas";

const FormulaBar = ({ cellData, selectedCell, onChange }) => {
    if (!selectedCell) {
        return (
            <div className="formula-bar">
                <div className="cell-address"></div>
                <input
                    type="text"
                    className="formula-input"
                    placeholder="Formula bar"
                    disabled
                />
            </div>
        );
    }

    const { row, col } = selectedCell;
    const cellAddress = `${columnToLetter(col)}${row + 1}`;
    const cellValue = cellData[row][col].formula || cellData[row][col].value;

    const handleChange = (e) => {
        onChange(row, col, e.target.value);
    };

    return (
        <div className="formula-bar">
            <div className="cell-address">{cellAddress}</div>
            <input
                type="text"
                className="formula-input"
                value={cellValue}
                onChange={handleChange}
                placeholder="Enter formula or data"
            />
        </div>
    );
};

export default FormulaBar;
