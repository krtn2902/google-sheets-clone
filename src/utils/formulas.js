export const evaluateFormula = (formula, cellData) => {
    if (!formula.startsWith("=")) {
        return formula;
    }

    try {
        // Remove the equals sign
        let expression = formula.substring(1);

        // Replace cell references with their values
        const cellRefs = formula.match(/[A-Z]+[0-9]+/g) || [];
        for (const ref of cellRefs) {
            const colIndex = letterToColumn(ref.match(/^[A-Z]+/)[0]);
            const rowIndex = parseInt(ref.match(/[0-9]+$/)[0]) - 1;

            // Check if the referenced cell exists
            if (cellData[rowIndex] && cellData[rowIndex][colIndex]) {
                const cellValue = cellData[rowIndex][colIndex].value;
                // Make sure the value is numeric if needed
                const numericValue = isNaN(Number(cellValue))
                    ? `"${cellValue}"`
                    : cellValue;
                expression = expression.replace(ref, numericValue);
            }
        }

        // Handle sum function
        expression = expression.replace(/SUM\((.*?)\)/gi, (match, range) => {
            if (range.includes(":")) {
                const [start, end] = range.split(":");

                const startCol = letterToColumn(start.match(/^[A-Z]+/)[0]);
                const startRow = parseInt(start.match(/[0-9]+$/)[0]) - 1;

                const endCol = letterToColumn(end.match(/^[A-Z]+/)[0]);
                const endRow = parseInt(end.match(/[0-9]+$/)[0]) - 1;

                let sum = 0;
                for (let i = startRow; i <= endRow; i++) {
                    for (let j = startCol; j <= endCol; j++) {
                        if (cellData[i] && cellData[i][j]) {
                            const value = Number(cellData[i][j].value);
                            if (!isNaN(value)) {
                                sum += value;
                            }
                        }
                    }
                }
                return sum;
            }
            return 0;
        });

        // Evaluate the expression
        // eslint-disable-next-line no-eval
        const result = eval(expression);
        return isNaN(result) ? result : Number(result);
    } catch (error) {
        return "#ERROR";
    }
};

export const columnToLetter = (column) => {
    let temp,
        letter = "";
    while (column >= 0) {
        temp = column % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp) / 26 - 1;
    }
    return letter;
};

export const letterToColumn = (letter) => {
    let column = 0;
    for (let i = 0; i < letter.length; i++) {
        column +=
            (letter.charCodeAt(i) - 64) * Math.pow(26, letter.length - i - 1);
    }
    return column - 1; // 0-based index
};
