import { checkWin, generateMine, handleClickBlock, handleClickMine, handleToggleFlag, initMineSweeper } from './helper'
import type { Coordinate, IBlock } from './type'
import { BlockType } from './type'

describe('generateMine', () => {
  test('when num is less than or equal (col * row - 9) and greater than or equal 0, should generate num mine(s)', () => {
    const col = 4
    const row = 4
    const num = 1
    const start = [0, 0] as Coordinate
    expect(generateMine([row, col], num, start)).toHaveLength(num)
  })

  test('when num is less than 0 or col / row is less than 4, should generate empty array', () => {
    expect(generateMine([4, 4], -1, [0, 0])).toHaveLength(0)
    expect(generateMine([4, 2], 1, [0, 0])).toHaveLength(0)
    expect(generateMine([2, 4], 1, [0, 0])).toHaveLength(0)
  })

  test('when num is greater than (col * row - 9), should generate [(col * row - 9), (col * row - 4)] mine(s)', () => {
    const col = 4
    const row = 4
    const num = 10
    const start = [0, 0] as Coordinate
    const res = generateMine([row, col], num, start).length
    expect(res).toBeGreaterThanOrEqual(row * col - 9)
    expect(res).toBeLessThanOrEqual(row * col - 4)
  })

  test('[y, x] of mine should be less than or equal [row, col] and greater than or equal 0', () => {
    const col = 10
    const row = 10
    const num = 1
    const start = [0, 0] as Coordinate
    const [[y, x]] = generateMine([row, col], num, start)
    expect(y).toBeLessThanOrEqual(row)
    expect(x).toBeLessThanOrEqual(col)
    expect(y * x).toBeGreaterThanOrEqual(0)
  })

  test('[y, x] of mine should be one block away from start', () => {
    const col = 10
    const row = 10
    const num = 1
    const start = [3, 3] as Coordinate
    const [[y, x]] = generateMine([row, col], num, start)
    expect((Math.abs(y - start[0]) <= 1 && Math.abs(x - start[1]) > 1) || (Math.abs(y - start[0]) > 1 && Math.abs(x - start[1]) <= 1) || (Math.abs(y - start[0]) > 1 && Math.abs(x - start[1]) > 1)).toBeTruthy()
  })

  test('the coordinate of mine should be not repeated', () => {
    const col = 10
    const row = 10
    const num = 5
    const start = [0, 0] as Coordinate
    const res = generateMine([row, col], num, start).map(_ => `${_[0]}${_[1]}`)

    expect(res).toEqual(Array.from(new Set(res)))
  })
})

describe('initMineSweeper', () => {
  test('place mine and calculate number of mine', () => {
    const block: IBlock = {
      content: 0,
      type: BlockType.BLOCK,
      hidden: true,
      flag: false,
    }
    const init = Array.from({ length: 4 }).map(_ => Array.from({ length: 4 }).map(_ => ({ ...block })))
    const mines = [[1, 1]] as Coordinate[]

    expect(initMineSweeper(init, mines)).toMatchInlineSnapshot(`
[
  [
    {
      "content": 1,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 1,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 1,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 0,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
  ],
  [
    {
      "content": 1,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 1,
      "flag": false,
      "hidden": true,
      "type": "mine",
    },
    {
      "content": 1,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 0,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
  ],
  [
    {
      "content": 1,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 1,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 1,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 0,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
  ],
  [
    {
      "content": 0,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 0,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 0,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
    {
      "content": 0,
      "flag": false,
      "hidden": true,
      "type": "block",
    },
  ],
]
`)
  })
})

describe('handleClickMine', () => {
  const block: IBlock = {
    content: 0,
    type: BlockType.BLOCK,
    hidden: true,
    flag: false,
  }
  const init = Array.from({ length: 4 }).map(_ => Array.from({ length: 4 }).map(_ => ({ ...block })))
  const mines = [[1, 1]] as Coordinate[]
  const sweeper = initMineSweeper(init, mines)
  test('when click mine, mine will show', () => {
    expect(handleClickMine(sweeper, mines[0])[1][1].hidden).toBeFalsy()
  })
})

describe('handleClickBlock', () => {
  const block: IBlock = {
    content: 0,
    type: BlockType.BLOCK,
    hidden: true,
    flag: false,
  }
  const init = Array.from({ length: 4 }).map(_ => Array.from({ length: 4 }).map(_ => ({ ...block })))
  const mines = [[1, 1]] as Coordinate[]
  const sweeper = handleToggleFlag(initMineSweeper(init, mines), [0, 3])
  test('when click block whose content is equal 0, block and surrounding block which is block and not be flagged will show', () => {
    const res = handleClickBlock(sweeper, [3, 3])
    expect(res[3][3].hidden).toBeFalsy()
    expect(res[2][2].hidden).toBeFalsy()
    expect(res[0][2].hidden).toBeTruthy()
    expect(res[2][0].hidden).toBeFalsy()
    expect(res[0][3].hidden).toBeTruthy()
    expect(res[3][0].hidden).toBeFalsy()
    expect(res[1][1].hidden).toBeTruthy()
    expect(res[0][1].hidden).toBeTruthy()
    expect(res[1][0].hidden).toBeTruthy()
  })
})

describe('handleToggleFlag', () => {
  const block: IBlock = {
    content: 0,
    type: BlockType.BLOCK,
    hidden: true,
    flag: false,
  }
  const init = Array.from({ length: 4 }).map(_ => Array.from({ length: 4 }).map(_ => ({ ...block })))
  const mines = [[1, 1]] as Coordinate[]
  const sweeper = initMineSweeper(init, mines)
  test('when click block, toggle its flag', () => {
    const res1 = handleToggleFlag(sweeper, [1, 1])
    expect(res1[1][1].flag).toBeTruthy()
    const res2 = handleToggleFlag(res1, [1, 1])
    expect(res2[1][1].flag).toBeFalsy()
  })
})

describe('checkWin', () => {
  const block: IBlock = {
    content: 0,
    type: BlockType.BLOCK,
    hidden: true,
    flag: false,
  }
  const init = Array.from({ length: 4 }).map(_ => Array.from({ length: 4 }).map(_ => ({ ...block })))
  const mines = [[1, 1]] as Coordinate[]
  const sweeper = initMineSweeper(init, mines)
  const sweeperWin = handleToggleFlag(sweeper, [1, 1])
  test('if all mines are flagged, return true, else return false', () => {
    expect(checkWin(sweeper)).toBeFalsy()
    expect(checkWin(sweeperWin)).toBeTruthy()
  })
})
