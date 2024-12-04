const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)

  const grid: string[][]  = []
  lines.forEach(line => {
    const cells = line.split('')
    grid.push(cells)
  })

  return grid
}

// Expects to receive the coordinate of an X
const countWordsFromXCoord = (grid: string[][], startI: number, startJ: number) => {
  let wordCount = 0
  const directionsTpCheck = [] as ('N'|'NE'|'E'|'SE'|'S'|'SW'|'W'|'NW')[]

  // N
  if (startJ >= 3) {
    directionsTpCheck.push('N')
  }
  // NE
  if (startJ >= 3 && startI + 3 < grid[startJ].length) {
    directionsTpCheck.push('NE')
  }
  // E
  if (startI + 3 < grid[startJ].length) {
    directionsTpCheck.push('E')
  }
  // SE
  if (startJ + 3 < grid.length && startI + 3 < grid[startJ].length) {
    directionsTpCheck.push('SE')
  }
  // S
  if (startJ + 3 < grid.length) {
    directionsTpCheck.push('S')
  }
  // SW
  if (startJ + 3 < grid.length && startI >= 3) {
    directionsTpCheck.push('SW')
  }
  // W
  if (startI >= 3) {
    directionsTpCheck.push('W')
  }
  // NW
  if (startI >= 3 && startJ >= 3) {
    directionsTpCheck.push('NW')
  }
  
  directionsTpCheck.forEach(direction => {
    if(lookForWord(grid, startI, startJ, direction)) wordCount++
  })

  return wordCount
}

const lookForWord = (grid: string[][], startI: number, startJ: number, direction: 'N'|'NE'|'E'|'SE'|'S'|'SW'|'W'|'NW') => {
  let word: string | undefined = undefined
  switch(direction) {
    case 'N':
      word = grid[startJ][startI] + grid[startJ - 1][startI] + grid[startJ - 2][startI] + grid[startJ - 3][startI]
      break
    case 'NE':
      word = grid[startJ][startI] + grid[startJ - 1][startI + 1] + grid[startJ - 2][startI + 2] + grid[startJ - 3][startI + 3]
      break
    case 'E':
      word = grid[startJ][startI] + grid[startJ][startI + 1] + grid[startJ][startI + 2] + grid[startJ][startI + 3]
      break
    case 'SE':
      word = grid[startJ][startI] + grid[startJ + 1][startI + 1] + grid[startJ + 2][startI + 2] + grid[startJ + 3][startI + 3]
      break
    case 'S':
      word = grid[startJ][startI] + grid[startJ + 1][startI] + grid[startJ + 2][startI] + grid[startJ + 3][startI]
      break
    case 'SW':
      word = grid[startJ][startI] + grid[startJ + 1][startI - 1] + grid[startJ + 2][startI - 2] + grid[startJ + 3][startI - 3]
      break
    case 'W':
      word = grid[startJ][startI] + grid[startJ][startI - 1] + grid[startJ][startI - 2] + grid[startJ][startI - 3]
      break
    case 'NW':
      word = grid[startJ][startI] + grid[startJ - 1][startI - 1] + grid[startJ - 2][startI - 2] + grid[startJ - 3][startI - 3]
      break
  }

  return word === 'XMAS'
}

const countWords = (grid: string[][]) => {
  let count = 0
  for (let j = 0 ; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if (grid[j][i] !== 'X') continue

      count += countWordsFromXCoord(grid, i, j)
    }
  }

  return count
}

// =========================================================
//                         PART 2
// =========================================================

// Expects to receive the coordinate of an A
const isXmasFromACoord = (grid: string[][], startI: number, startJ: number) => {
  let masCount = 0

  if(grid[startJ - 1][startI - 1] === 'M' && grid[startJ + 1][startI + 1] === 'S') masCount++
  if(grid[startJ - 1][startI - 1] === 'S' && grid[startJ + 1][startI + 1] === 'M') masCount++

  if(grid[startJ - 1][startI + 1] === 'M' && grid[startJ + 1][startI - 1] === 'S') masCount++
  if(grid[startJ - 1][startI + 1] === 'S' && grid[startJ + 1][startI - 1] === 'M') masCount++

  return masCount >= 2
}

const countMas = (grid: string[][]) => {
  let count = 0
  for (let j = 1 ; j < grid.length - 1; j++) {
    for (let i = 1; i < grid[j].length - 1; i++) {
      if (grid[j][i] !== 'A') continue

      if(isXmasFromACoord(grid, i, j)) count++
    }
  }

  return count
}

readFile('example.txt').then(grid => {
  console.log('------------EXAMPLE------------')
  console.log(countWords(grid))
})

readFile('input.txt').then(grid => {
  console.log('------------Input------------')
  console.log(countWords(grid))
})


readFile('example.txt').then(grid => {
  console.log('------------[P2] EXAMPLE------------')
  console.log(countMas(grid))
})

readFile('input.txt').then(grid => {
  console.log('------------[P2] INPUT------------')
  console.log(countMas(grid))
})