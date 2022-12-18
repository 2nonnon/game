import { createContext, useContext } from 'react'
import { checkWin, generateMine, handleClickBlock, handleClickMine, handleToggleFlag, initMineSweeper } from './helper'
import type { Coordinate, IBlock, ILevel } from './type'
import { BlockType, GameState, Level } from './type'

import useMineSweeper from './useMineSweeper'

const MineSweeperContext = createContext<ReturnType<typeof useMineSweeper> | null>(null)

interface BlockParam {
  block: IBlock
  coordinate: Coordinate
  level: ILevel
}

const Block = ({ block, coordinate, level }: BlockParam) => {
  const { mineSweeper, setMineSweeper, gameState, setGameState, flagCount, setFlagCount } = useContext(MineSweeperContext)!

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (gameState === GameState.PRE) {
      const mines = generateMine(level.size, level.num, coordinate)
      setGameState(GameState.GOING)
      setMineSweeper(handleClickBlock(initMineSweeper(mineSweeper, mines), coordinate))
    }
    else if (gameState === GameState.GOING) {
      if (block.type === BlockType.BLOCK) { setMineSweeper(handleClickBlock(mineSweeper, coordinate)) }

      else if (block.type === BlockType.MINE) {
        setGameState(GameState.FAIL)
        setMineSweeper(handleClickMine(mineSweeper, coordinate))
      }
    }
  }

  const handleRightClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    if (gameState === GameState.PRE) {
      const mines = generateMine(level.size, level.num, coordinate)
      setGameState(GameState.GOING)
      setFlagCount(flagCount + 1)
      setMineSweeper(handleToggleFlag(initMineSweeper(mineSweeper, mines), coordinate))
    }
    else if (gameState === GameState.GOING) {
      if (block.flag) {
        setFlagCount(flagCount - 1)
        setMineSweeper(handleToggleFlag(mineSweeper, coordinate))
      }
      else if (flagCount < level.num) {
        setFlagCount(flagCount + 1)
        const nextState = handleToggleFlag(mineSweeper, coordinate)
        if (checkWin(nextState))
          setGameState(GameState.WIN)
        setMineSweeper(nextState)
      }
    }
  }

  return (
    <>
      <div className='h-5 w-5'>
        {block.hidden
          ? block.flag
            ? <div className='grid place-content-center bg-gray-300 w-full h-full' onContextMenu={handleRightClick}>🚩</div>
            : <div className='cursor-pointer bg-gray-300 w-full h-full' onClick={handleClick} onContextMenu={handleRightClick}></div>
          : <div className='grid place-content-center bg-white w-full h-full'>{block.type === BlockType.BLOCK ? block.content > 0 ? block.content : '' : '💣'}</div>}
      </div>
    </>
  )
}

const MineSweeper = () => {
  const mineSweeperInfo = useMineSweeper(Level.easy.size)

  return (
    <>
      <MineSweeperContext.Provider value={mineSweeperInfo}>
        <div className='grid place-content-center h-screen select-none'>
          <div><span>{mineSweeperInfo.gameState}</span><span>刷新</span></div>
          <div className='grid grid-cols-9 gap-1 w-fit p-1 bg-gray-100'>
            {mineSweeperInfo.mineSweeper.map((row, y) => row.map((block, x) => {
              return (<Block key={y * row.length + x} block={block} coordinate={[y, x]} level={Level.easy}></Block>)
            }))}
          </div>
        </div>
      </MineSweeperContext.Provider>
    </>
  )
}

export default MineSweeper
