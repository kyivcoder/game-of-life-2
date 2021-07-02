import React, { useState } from 'react';
import produce from 'immer';
import useInterval from "../../hooks/useInterval";
import './GameGrid.scss';

type Grid = Array<number[]>;

export type GameGridProps = {
    rowsNum?: number;
    columnsNum?: number;
    tickDelay?: number;
};

const DEFAULT_TICK_DELAY = 100;

const NEIGHBORS_OPTIONS = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
];

export const getInitialGrid = (rowsNum: number, columnsNum: number): Grid => {
    const rows = [];
    for (let i = 0; i < rowsNum; i++) {
        rows.push(Array.from(Array(columnsNum), () => Math.random() > 0.7 ? 1 : 0));
    }

    return rows;
};

export const getAliveNeighbors = (grid: Grid, rowIndex: number, columnIndex: number, rowsNum: number, columnsNum: number) => {
    return NEIGHBORS_OPTIONS.reduce((acc, [rowNeighborOption, columnNeighborOption]) => {
        const rowNeighbor = rowIndex + rowNeighborOption;
        const columnNeighbor = columnIndex + columnNeighborOption;
        const isRowNeighborExist = rowNeighbor >= 0 && rowNeighbor < rowsNum;
        const isColumnNeighborExist = columnNeighbor >= 0 && columnNeighbor < columnsNum;

        if (isRowNeighborExist && isColumnNeighborExist) {
            return acc + grid[rowNeighbor][columnNeighbor];
        }

        return acc;
    }, 0);
};

export const getGridAfterTick = (grid: Grid): Grid => {
    return produce(grid, gridCopy => {
        for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
            const rowsNum = grid.length;
            const columnsNum = grid[rowIndex].length;

            for (let columnIndex = 0; columnIndex < columnsNum; columnIndex++) {
                const aliveNeighbors = getAliveNeighbors(grid, rowIndex, columnIndex, rowsNum, columnsNum);

                const isUnderPopulation = aliveNeighbors < 2;
                const isOvercrowding = aliveNeighbors > 3;
                const isReproduction = grid[rowIndex][columnIndex] === 0 && aliveNeighbors === 3;

                if (isUnderPopulation || isOvercrowding) {
                    gridCopy[rowIndex][columnIndex] = 0;
                } else if (isReproduction) {
                    gridCopy[rowIndex][columnIndex] = 1;
                }
            }
        }
    });
};

const getColumn = (column: number, columnIndex: number): JSX.Element => {
    const columnClassName = `column ${column === 1 ? 'column_alive' : 'column_dead'}`;

    return <div key={columnIndex} className={columnClassName} />;
};

const getRow = (row: number[], rowIndex: number): JSX.Element => <div key={rowIndex} className='row'>{row.map(getColumn)}</div>;

const GameGrid = ({ rowsNum = 50, columnsNum = 50, tickDelay = DEFAULT_TICK_DELAY }: GameGridProps): JSX.Element => {
    const [grid, setGrid] = useState(() => getInitialGrid(rowsNum, columnsNum));
    useInterval(() => setGrid(grid => getGridAfterTick(grid)), tickDelay);

    return <div className='game-grid'>{grid.map(getRow)}</div>;
};

export default GameGrid;
