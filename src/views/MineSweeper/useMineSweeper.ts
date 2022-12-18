import { useState } from 'react'
import type { IBlock, MineSweeperType } from './type'
import { BlockType, GameState } from './type'

const block: IBlock = {
  content: 0,
  type: BlockType.BLOCK,
  hidden: true,
  flag: false,
}

const useMineSweeper = ([row, col]: [number, number]) => {
  const init = Array.from({ length: row }).map(_ => Array.from({ length: col }).map(_ => ({ ...block })))
  const [gameState, setGameState] = useState(GameState.PRE)
  const [mineSweeper, setMineSweeper] = useState<MineSweeperType>(init)
  const [flagCount, setFlagCount] = useState(0)

  return { gameState, setGameState, mineSweeper, setMineSweeper, flagCount, setFlagCount }
}

export default useMineSweeper
