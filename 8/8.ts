interface Cell {
  cell: string
  antinodes: string
}
const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)

  const grid: Cell[][] = []

  lines.forEach(line => {
    grid.push(
      line.split('').map(cell => {
        return {
        cell: cell, antinodes: ''
      } as Cell
      }
    )
    )
  })

  return grid
}

const findAllAntinodes = (grid: Cell[][], partTwo: boolean = false) => {
  for (let j = 0 ; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if (grid[j][i].cell !== '.'){
        if(!partTwo) grid = findAntinodes(grid, i, j)
        else grid = findAntinodesPartTwo(grid, i, j)
        
      } 
    }
  }

  return grid
}

const displayGrid = (grid: Cell[][]) => {
  for (let j = 0 ; j < grid.length; j++) {
    let str = ''
    for (let i = 0; i < grid[j].length; i++) {
      if (grid[j][i].cell !== '.') str += grid[j][i].cell
      else if(grid[j][i].antinodes.length > 0) str += '#'
      else str += '.'
    }
    console.log(str)
  }
}

const findAntinodes = (grid: Cell[][], cellI: number, cellJ: number) => {
  const cell = grid[cellJ][cellI]

  for (let j = 0 ; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if(grid[j][i].cell === cell.cell) {
        const nodeI = cellI + (cellI - i)
        const nodeJ = cellJ + (cellJ - j)

        // console.log(`cell [${cellI}, ${cellJ}] | ij [${i}, ${j}] | node [${nodeI}, ${nodeJ}]`)

        if( nodeI >= 0 && nodeI < grid[0].length
          && nodeJ >= 0 && nodeJ < grid.length
          && grid[nodeJ][nodeI].cell !== cell.cell
        ) {
          if(! grid[nodeJ][nodeI].antinodes.includes(cell.cell)) grid[nodeJ][nodeI].antinodes += cell.cell
        }

        const nodeI2 = i - (cellI - i)
        const nodeJ2 = j - (cellJ - j)

        if( nodeI2 >= 0 && nodeI2 < grid[0].length
          && nodeJ2 >= 0 && nodeJ2 < grid.length
          && grid[nodeJ2][nodeI2].cell !== cell.cell
        ) {
          if(! grid[nodeJ2][nodeI2].antinodes.includes(cell.cell)) grid[nodeJ2][nodeI2].antinodes += cell.cell
        }
      }
    }
  }

  return grid
}

const countCellsWithAntinodes = (grid: Cell[][]) => {
  let count = 0
  grid.forEach(line => {
    count += line.filter(cell => cell.antinodes.length > 0).length
  })

  return count
}

const findAntinodesPartTwo = (grid: Cell[][], cellI: number, cellJ: number) => {
  const cell = grid[cellJ][cellI]

  for (let j = 0 ; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if(grid[j][i].cell === cell.cell && i !== cellI && j !== cellJ) {
        let di = (cellI - i)
        let dj = (cellJ - j)
        let nodeI = cellI
        let nodeJ = cellJ

        while(
          nodeI >= 0 && nodeI < grid[0].length
          && nodeJ >= 0 && nodeJ < grid.length
        ) {
          if(! grid[nodeJ][nodeI].antinodes.includes(cell.cell)) grid[nodeJ][nodeI].antinodes += cell.cell

          nodeI += di
          nodeJ += dj
        }

        di = (cellI - i)
        dj = (cellJ - j)
        let nodeI2 = i
        let nodeJ2 = j

        while(
          nodeI2 >= 0 && nodeI2 < grid[0].length
          && nodeJ2 >= 0 && nodeJ2 < grid.length
        ) {
          if(! grid[nodeJ2][nodeI2].antinodes.includes(cell.cell)) grid[nodeJ2][nodeI2].antinodes += cell.cell

          nodeI2 -= di
          nodeJ2 -= dj
        }
      }
    }
  }

  return grid
}

readFile('example.txt').then((grid) => {
  console.log('------------EXAMPLE------------')
  const finalGrid = findAllAntinodes(grid)
  // displayGrid(finalGrid)
  console.log(countCellsWithAntinodes(finalGrid))
})

readFile('input.txt').then((grid) => {
  console.log('------------INPUT------------')
  const finalGrid = findAllAntinodes(grid)
  // displayGrid(finalGrid)
  console.log(countCellsWithAntinodes(finalGrid))
})

readFile('example.txt').then((grid) => {
  console.log('------------[P2] EXAMPLE------------')
  const finalGrid = findAllAntinodes(grid, true)
  // displayGrid(finalGrid)
  console.log(countCellsWithAntinodes(finalGrid))
})

readFile('input.txt').then((grid) => {
  console.log('------------[P2] INPUT------------')
  const finalGrid = findAllAntinodes(grid, true)
  // displayGrid(finalGrid)
  console.log(countCellsWithAntinodes(finalGrid))
})