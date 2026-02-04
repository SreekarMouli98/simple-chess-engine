const utils = require('../utils')

describe('Utils helpers', () => {
    const makeEmptyBoard = () => Array.from({ length: 8 }, () => Array(8).fill(0))

    test('color and piece name helpers', () => {
        expect(utils.getColorName(1)).toBe('white')
        expect(utils.getColorName(-1)).toBe('black')
        expect(utils.getColorName(0)).toBe('none')

        expect(utils.getPieceName(6)).toBe('king')
        expect(utils.getPieceName(-5)).toBe('queen')
        expect(utils.getPieceName(0)).toBe('none')
    })

    test('piece value helpers', () => {
        expect(utils.getPieceValByName('rook')).toBe(2)
        expect(utils.getPieceValByName('Knight')).toBe(3)
        expect(utils.getPieceValByName('invalid')).toBe(0)
    })

    test('includesPosition matches coordinates', () => {
        const positions = [
            [0, 0],
            [3, 4],
            [7, 7]
        ]
        expect(utils.includesPosition(positions, [3, 4])).toBe(true)
        expect(utils.includesPosition(positions, [4, 3])).toBe(false)
    })

    test('areSameColor matches only same-color pieces', () => {
        expect(utils.areSameColor(1, 6)).toBe(true)
        expect(utils.areSameColor(-1, -6)).toBe(true)
        expect(utils.areSameColor(1, -1)).toBe(false)
        expect(utils.areSameColor(0, 1)).toBe(false)
    })

    test('getColorValByName handles casing and invalid values', () => {
        expect(utils.getColorValByName('white')).toBe(1)
        expect(utils.getColorValByName('BLACK')).toBe(-1)
        expect(utils.getColorValByName('unknown')).toBe(0)
        expect(utils.getColorValByName()).toBe(0)
    })

    test('getColorByPos reflects board contents', () => {
        const board = makeEmptyBoard()
        utils.setElement(board, [0, 0], 5)
        utils.setElement(board, [7, 7], -3)

        expect(utils.getColorByPos(board, [0, 0])).toBe(1)
        expect(utils.getColorByPos(board, [7, 7])).toBe(-1)
        expect(utils.getColorByPos(board, [3, 3])).toBe(0)
    })

    test('getPositions returns all matching pieces', () => {
        const board = makeEmptyBoard()
        utils.setElement(board, [0, 0], 2)
        utils.setElement(board, [7, 7], 2)
        utils.setElement(board, [3, 4], -2)

        expect(utils.getPositions(board, 2)).toEqual([
            [0, 0],
            [7, 7]
        ])
        expect(utils.getPositions(board, -2)).toEqual([[3, 4]])
        expect(utils.getPositions(board, 6)).toEqual([])
    })

    test('checkIfSamePosition compares coordinates', () => {
        expect(utils.checkIfSamePosition([0, 1], [0, 1])).toBe(true)
        expect(utils.checkIfSamePosition([0, 1], [1, 0])).toBe(false)
    })

    test('getOffsetPos applies offsets correctly', () => {
        expect(utils.getOffsetPos([4, 4], [1, 2])).toEqual([2, 5])
    })

    test('getElement and setElement ignore invalid positions', () => {
        const board = makeEmptyBoard()
        utils.setElement(board, [0, 0], 4)

        expect(utils.getElement(board, [0, 0])).toBe(4)
        expect(utils.getElement(board, [-1, 0])).toBeUndefined()
        expect(utils.getElement(board, [0, 8])).toBeUndefined()

        utils.setElement(board, [-1, 0], 6)
        utils.setElement(board, [0, 8], 6)
        expect(utils.getElement(board, [0, 0])).toBe(4)
        expect(utils.getElement(board, [0, 1])).toBe(0)
    })
})
