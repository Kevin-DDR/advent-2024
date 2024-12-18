type Direction = 'N'|'E'|'S'|'W'
type Data = {
  direction: Direction;
  score: number;
  grid: string[][]
  x: number;
  y: number
}

const directionDeltas = {
  N: [0, -1],
  E: [1, 0],
  S: [0, +1],
  W: [-1, 0]
}

const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)

  const data: Data = {
    grid: [],
    score: 0,
    direction: 'E',
    x: -1,
    y: -1
  }
  lines.forEach((line, index) => {
    if(line.trim().length === 0) return
    const cells = line.split('')
    data.grid.push(cells)
    const startIndex = cells.indexOf('S')
    if(startIndex !== -1) {
      data.x = startIndex
      data.y = index
    }
  })

  return data
}

const testBranch = (data: Data, newX: number, newY: number, results: Data[]) => {
  if(newX < 0 || newX > data.grid[0].length ||
    newY < 0 || newY > data.grid.length ||
    data.grid[newY][newX] === '#' ||
    data.grid[newY][newX] === 'X' // visited
  ) {
    return
  }

  if(data.grid[newY][newX] === 'E') {
    // data.score++
    results.push(data)
    return
  }
  data.grid[newY][newX] = 'X'

  Object.keys(directionDeltas).forEach((key, index) => {
    const dataCpy = JSON.parse(JSON.stringify(data))
    if(dataCpy.direction !== key) {
      dataCpy.score += Math.abs(index - Object.keys(directionDeltas).indexOf(dataCpy.direction)) * 1000
      dataCpy.direction = key
    }
    dataCpy.score++
    testBranch(dataCpy,newX + directionDeltas[(key as Direction)][0], newY + directionDeltas[key as Direction][1], results)
  })
}

const partOne = (data: Data) => {
  const results: Data[] = []
  testBranch(data, data.x, data.y, results)
  // results.forEach(res => {
  //   console.log('------------------------------')
  //   console.log(res.score)
  //   displayGrid(res.grid)
  // })
  console.log(findMin(results).score)
}

const findMin = (results: Data[]) => {
  results.sort((a, b) => a.score - b.score)
  return results[0]
}

const displayGrid = (grid: string[][]) => {
  grid.forEach(line => {
    console.log(line.join('').replaceAll('.', ' '))
  })
}



// =========================================================
//                         PART 2
// =========================================================



readFile('example1.txt').then((data) => {
  console.log('------------EXAMPLE 1------------')
  partOne(data)
})

readFile('example2.txt').then((data) => {
  console.log('------------EXAMPLE 2------------')
  partOne(data)
})

readFile('input.txt').then((data) => {
  console.log('------------Input------------')
  partOne(data)
})

// readFile('example3.txt', true).then(({grid, moves}) => {
//   console.log('------------[P2] EXAMPLE 3------------')
//   partTwo(grid, moves)
// })

// readFile('example2.txt', true).then(({grid, moves}) => {
//   console.log('------------[P2] EXAMPLE 2------------')
//   partTwo(grid, moves)
// })

// readFile('input.txt', true).then(({grid, moves}) => {
//   console.log('------------[P2] INPUT 2------------')
//   partTwo(grid, moves)
// })