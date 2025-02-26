import React, { useRef, useEffect } from "react";

const Cell = ({
    rowIndex,
    colIndex,
    cellData,
    selected,
    editing,
    onSelect,
    onChange,
    onDoubleClick,
    onBlur,
    onKeyDown,
}) => {
    const cell = cellData[rowIndex][colIndex];
    const cellRef = useRef(null);

    useEffect(() => {
        if (editing && selected && cellRef.current) {
            cellRef.current.focus();
        }
    }, [editing, selected]);

    const handleChange = (e) => {
        onChange(rowIndex, colIndex, e.target.value);
    };

    return (
        <div
            className={`cell ${selected ? "selected" : ""} ${
                editing ? "editing" : ""
            }`}
            onClick={() => onSelect(rowIndex, colIndex)}
            onDoubleClick={() => onDoubleClick(rowIndex, colIndex)}
            style={{
                fontWeight: cell.style.bold ? "bold" : "normal",
                fontStyle: cell.style.italic ? "italic" : "normal",
                fontSize: cell.style.fontSize || "14px",
                color: cell.style.color || "black",
                backgroundColor: cell.style.backgroundColor || "white",
                textAlign: cell.style.align || "left",
            }}
        >
            {editing && selected ? (
                <input
                    ref={cellRef}
                    type="text"
                    value={cell.formula || cell.value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    autoFocus
                />
            ) : (
                <div className="cell-content">
                    {cell.formatted !== undefined ? cell.formatted : cell.value}
                </div>
            )}
        </div>
    );
};

export default Cell;
