type Direction = 'N'|'E'|'S'|'W'

const readFile = async (path: string, partTwo: boolean = false) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)

  const grid: string[][]  = []
  let moves: Direction[] = []
  let isGrid = true
  lines.forEach(line => {
    if(line.trim() === '') {
      isGrid = false
      return
    }
    let cells = line.replaceAll('^', 'N').replaceAll('>', 'E').replaceAll('v', 'S').replaceAll('<', 'W')
    if (partTwo) cells = cells.replaceAll('#', '##').replaceAll('O', '[]').replaceAll('.', '..').replaceAll('@', '@.')
    const cellArr = cells.split('')
    if(isGrid) {
      grid.push(cellArr)
    } else {
      moves = moves.concat(cellArr as Direction[]) 
    }
  })

  return {grid, moves}
}

const directionDeltas = {
  N: [0, -1],
  E: [1, 0],
  S: [0, +1],
  W: [-1, 0]
}

const move = (grid: string[][], direction: Direction, startX: number, startY: number) => {
  const [dx, dy] = directionDeltas[direction]
  let x = startX + dx
  let y = startY + dy

  if(x < 0 || x >= grid[0].length
    || y < 0 || y >= grid.length 
    || grid[y][x] === '#' 
  ) {
    return false
  }

  if(grid[y][x] === '.') {
    const tmp = grid[y][x]
    grid[y][x] = grid[startY][startX]
    grid[startY][startX] = tmp
    return true
  }

  if(grid[y][x] === 'O') {
    if(move(grid, direction, x, y)) {
      const tmp = grid[y][x]
      grid[y][x] = grid[startY][startX]
      grid[startY][startX] = tmp
      return true
    }
  }

  return false
}

const computeGPS = (grid: string[][]) => {
  let count = 0
  grid.forEach((line, j) => {
    line.forEach((cell, i) => {
      if(cell === 'O') {
        count += 100 * j + i
      }
      if(cell === '[') {
        count += 100 * j + i
      }
    })
  })
  return count
}

const partOne = (grid: string[][], moves: Direction[]) => {
  
  moves.forEach((nextMove) => {
    const coord = findRobot(grid)
    if(coord === undefined) return
    move(grid, nextMove, coord[0], coord[1])
    console.log(`--------------- ${nextMove}  -------------`)
    displayGrid(grid)
  })
  console.log(computeGPS(grid))
}


// =========================================================
//                         PART 2
// =========================================================


const movePartTwo = (grid: string[][], direction: Direction, startX: number, startY: number) => {
  const [dx, dy] = directionDeltas[direction]
  let x = startX + dx
  let y = startY + dy

  if(x < 0 || x >= grid[0].length
    || y < 0 || y >= grid.length 
    || grid[y][x] === '#' 
  ) {
    return false
  }

  if(grid[y][x] === '.') {
    const tmp = grid[y][x]
    grid[y][x] = grid[startY][startX]
    grid[startY][startX] = tmp
    return true
  }


  if(grid[y][x] === '[') {
    const firstHalf = [x, y]
    const secondHalf = [x+1, y]

    if(moveBox(grid,firstHalf, secondHalf, direction)) {
      const tmp = grid[y][x]
      grid[y][x] = grid[startY][startX]
      grid[startY][startX] = tmp
      return true
    }
  } else if(grid[y][x] === ']') {
    const firstHalf = [x-1, y]
    const secondHalf = [x, y]

    if(moveBox(grid,firstHalf, secondHalf, direction)) {
      const tmp = grid[y][x]
      grid[y][x] = grid[startY][startX]
      grid[startY][startX] = tmp
      return true
    }
  }

  return false

}

const checkMove = (grid: string[][], firstHalf: number[], secondHalf: number[], direction: Direction, shouldMove: boolean = false) => {
  const coordsToCheck: number[][] = []
  switch(direction) {
    case 'N':
    case 'S':
      coordsToCheck.push([firstHalf[0] + directionDeltas[direction][0], firstHalf[1] + directionDeltas[direction][1]])
      coordsToCheck.push([secondHalf[0] + directionDeltas[direction][0], secondHalf[1] + directionDeltas[direction][1]])
      break
    case 'E':
      coordsToCheck.push([secondHalf[0] + directionDeltas[direction][0], secondHalf[1] + directionDeltas[direction][1]])
      break
    case 'W':
      coordsToCheck.push([firstHalf[0] + directionDeltas[direction][0], firstHalf[1] + directionDeltas[direction][1]])
      break
  }
  // console.log(coordsToCheck)

  let canMove = true
  coordsToCheck.forEach(([x, y]) => {
    if(grid[y][x] === '.') return
    if(grid[y][x] === '[') {
      canMove = canMove && checkMove(grid, [x, y], [x+1, y],direction)
      if(shouldMove) moveBox(grid, [x, y], [x+1, y], direction)
      return
    }

    if(grid[y][x] === ']') {
      canMove = canMove && checkMove(grid, [x-1, y], [x, y],direction)
      if(shouldMove) moveBox(grid, [x-1, y], [x, y], direction)
      return
    }
    canMove = false
  })
  return canMove
}

const moveBox = (grid: string[][], firstHalf: number[], secondHalf: number[], direction: Direction) => {
  if(checkMove(grid, firstHalf, secondHalf, direction)) {
    // Move all the needed boxes
    checkMove(grid, firstHalf, secondHalf, direction, true)
    if(['N', 'S'].includes(direction)) {
      let [newX, newY] = [firstHalf[0] + directionDeltas[direction][0], firstHalf[1] + directionDeltas[direction][1]]
      grid[newY][newX] = grid[firstHalf[1]][firstHalf[0]]
      grid[firstHalf[1]][firstHalf[0]] = '.'

      newX = secondHalf[0] + directionDeltas[direction][0]
      newY = secondHalf[1] + directionDeltas[direction][1]

      grid[newY][newX] = grid[secondHalf[1]][secondHalf[0]]
      grid[secondHalf[1]][secondHalf[0]] = '.'
    } else if(direction === 'E') {
      const [newX, newY] = [secondHalf[0] + directionDeltas[direction][0], secondHalf[1] + directionDeltas[direction][1]]
      grid[newY][newX] = grid[secondHalf[1]][secondHalf[0]]
      grid[secondHalf[1]][secondHalf[0]] = grid[firstHalf[1]][firstHalf[0]]
      grid[firstHalf[1]][firstHalf[0]] = '.'
    } else {
      const [newX, newY] = [firstHalf[0] + directionDeltas[direction][0], firstHalf[1] + directionDeltas[direction][1]]
      grid[newY][newX] = grid[firstHalf[1]][firstHalf[0]]
      grid[firstHalf[1]][firstHalf[0]] = grid[secondHalf[1]][secondHalf[0]]
      grid[secondHalf[1]][secondHalf[0]] = '.'
    }
    return true
  }
  return false
}

const findRobot = (grid: string[][]) => {
  for (let j = 0 ; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if(grid[j][i] === '@') {
        return [i, j]
      }
    }
  }
}



const partTwo = (grid: string[][], moves: Direction[]) => {
  moves.forEach((nextMove) => {
    const coord = findRobot(grid)
    if(coord === undefined) return
    movePartTwo(grid, nextMove, coord[0], coord[1])
    // console.log(`--------------- ${nextMove}  -------------`)
    // displayGrid(grid)
  })
  console.log(computeGPS(grid))
}

const displayGrid = (grid: string[][]) => {
  grid.forEach(line => {
    console.log(line.join('').replaceAll('.', ' '))
  })
}


readFile('example1.txt').then(({grid, moves}) => {
  console.log('------------EXAMPLE 1------------')
  partOne(grid, moves)
})

readFile('example2.txt').then(({grid, moves}) => {
  console.log('------------EXAMPLE 2------------')
  partOne(grid, moves)
})

readFile('input.txt').then(({grid, moves}) => {
  console.log('------------Input------------')
  partOne(grid, moves)
})

readFile('example3.txt', true).then(({grid, moves}) => {
  console.log('------------[P2] EXAMPLE 3------------')
  partTwo(grid, moves)
})

readFile('example2.txt', true).then(({grid, moves}) => {
  console.log('------------[P2] EXAMPLE 2------------')
  partTwo(grid, moves)
})

readFile('input.txt', true).then(({grid, moves}) => {
  console.log('------------[P2] INPUT 2------------')
  partTwo(grid, moves)
})