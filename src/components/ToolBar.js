// src/components/Toolbar.js
import React from "react";

const Toolbar = ({
    cellData,
    selectedCell,
    setCellData,
    addRow,
    deleteRow,
    addColumn,
    deleteColumn,
    resizeRow,
    resizeColumn,
}) => {
    // Handle formatting buttons
    const applyFormat = (property, value) => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const newCellData = [...cellData];

        newCellData[row][col].style = {
            ...newCellData[row][col].style,
            [property]: value,
        };

        setCellData(newCellData);
    };

    const toggleBold = () => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const isBold = cellData[row][col].style.bold;

        applyFormat("bold", !isBold);
    };

    const toggleItalic = () => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const isItalic = cellData[row][col].style.italic;

        applyFormat("italic", !isItalic);
    };

    const setFontSize = (e) => {
        applyFormat("fontSize", e.target.value);
    };

    const setTextColor = (e) => {
        applyFormat("color", e.target.value);
    };

    const setCellBgColor = (e) => {
        applyFormat("backgroundColor", e.target.value);
    };

    return (
        <div className="toolbar">
            <div className="toolbar-section">
                <button className="toolbar-button" onClick={toggleBold}>
                    B
                </button>
                <button className="toolbar-button" onClick={toggleItalic}>
                    I
                </button>

                <select className="toolbar-select" onChange={setFontSize}>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="24px">24px</option>
                </select>
            </div>

            <div className="toolbar-section">
                <input type="color" onChange={setTextColor} />
                <input type="color" onChange={setCellBgColor} />
            </div>

            <div className="toolbar-section">
                <button className="toolbar-button" onClick={addRow}>
                    Add Row
                </button>
                <button className="toolbar-button" onClick={deleteRow}>
                    Delete Row
                </button>
                <button className="toolbar-button" onClick={addColumn}>
                    Add Column
                </button>
                <button className="toolbar-button" onClick={deleteColumn}>
                    Delete Column
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
