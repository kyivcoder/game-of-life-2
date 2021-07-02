import React from 'react';
import { render } from '@testing-library/react';
import GameGrid, {getAliveNeighbors, getGridAfterTick} from './GameGrid';

describe('GameGrid tests', () => {
    it('Should render without errors', () => {
        const { container } = render(<GameGrid />);

        expect(container.firstChild).toBeInTheDocument();
    });

    describe('getAliveNeighbors tests', () => {
        it('Should not find any alive neighbors', () => {
            const gridMock = [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]
            ];

            expect(getAliveNeighbors(gridMock, 1, 1, 3, 3)).toBe(0);
        });

        it('Should have all alive neighbors', () => {
            const gridMock = [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]
            ];

            expect(getAliveNeighbors(gridMock, 1, 1, 3, 3)).toBe(8);
        });
    });

    describe('getGridAfterTick tests', () => {
        it('Should not be alive due to the under population', () => {
            const gridMock = [
                [0, 0, 0],
                [0, 1, 0],
                [0, 1, 0]
            ];
            const gridAfterTick = getGridAfterTick(gridMock);

            expect(gridAfterTick[1][1]).toBe(0);
        });

        it('Should not be alive due to the overcrowding', () => {
            const gridMock = [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 1]
            ];
            const gridAfterTick = getGridAfterTick(gridMock);

            expect(gridAfterTick[1][1]).toBe(0);
        });

        it('Should become alive due to the reproduction', () => {
            const gridMock = [
                [0, 0, 0],
                [0, 0, 0],
                [1, 1, 1]
            ];
            const gridAfterTick = getGridAfterTick(gridMock);

            expect(gridAfterTick[1][1]).toBe(1);
        });

        it('Should stay alive due to the not overcrowding and underpopulation', () => {
            const gridMock = [
                [0, 0, 0],
                [0, 1, 0],
                [1, 1, 0]
            ];
            const gridAfterTick = getGridAfterTick(gridMock);

            expect(gridAfterTick[1][1]).toBe(1);
        });
    });
});
