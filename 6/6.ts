const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)

  const grid: string[][] = []

  lines.forEach(line => {
    grid.push(line.split(''))
  })

  return grid
}

const getGuardPosition =  (grid: string[][]) => {
  for (let j = 0 ; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if (grid[j][i] === '^') return {i, j}
    }
  }

  return {i: -1, j: -1}
}

const move = (grid: string[][]) => {
  const {i: startI, j: startJ} = getGuardPosition(grid)
  let currentI = startI
  let currentJ = startJ
  let direction = 'N'
  const possibleDirection = ['N', 'E', 'S', 'W']
  let iteration = 0
  const maxIteration = 50000

  while(iteration < maxIteration && 
    currentI >= 0 && currentI < grid[0].length
    && currentJ >= 0 && currentJ < grid.length
  ) {
    iteration++
    grid[currentJ][currentI] = 'X'

    let nextI = - 1
    let nextJ = - 1
    switch (direction) {
      case 'N':
        nextI = currentI
        nextJ = currentJ - 1
        break
      case 'E':
        nextI = currentI + 1
        nextJ = currentJ
        break
      case 'S':
        nextI = currentI
        nextJ = currentJ + 1
        break
      case 'W':
        nextI = currentI - 1
        nextJ = currentJ
        break
    }
    if(
      nextI >= 0 && nextI < grid[0].length
      && nextJ >= 0 && nextJ < grid.length &&
      grid[nextJ][nextI] === '#'
    ) {
      direction = possibleDirection[(possibleDirection.indexOf(direction) + 1) % possibleDirection.length]
    } else {
      currentI = nextI
      currentJ = nextJ
    }
  }

  return {
    grid,
    infinite: iteration >= maxIteration
  }
}

const countX = (grid: string[][]) => {
  let count = 0
  grid.forEach(line => {
    count += line.filter(cell => cell === 'X').length
  })

  return count
}

// Not an elegant solution, but I'm not seeing a nicer way of doing it.
const bruteForce = (grid: string[][]) => {
  let count = 0
  for (let j = 0 ; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if (!['^', 'X', '#'].includes(grid[j][i])) {
        const cpy = JSON.parse(JSON.stringify((grid)))
        cpy[j][i] = '#'
        if(move(cpy).infinite) count++
      }
    }
  }
  return count
}

const displayGrid = (grid: string[][]) => {
  grid.forEach(line => {
    console.log(line.join(''))
  })
}

readFile('example.txt').then((grid) => {
  console.log('------------EXAMPLE------------')
  const finalGrid = move(grid)
  // displayGrid(finalGrid)
  console.log(countX(finalGrid.grid))
})

readFile('input.txt').then((grid) => {
  console.log('------------INPUT------------')
  const finalGrid = move(grid)
  // displayGrid(finalGrid)
  console.log(countX(finalGrid.grid))
})


readFile('example.txt').then((grid) => {
  console.log('------------[P2] EXAMPLE------------')
  console.log(bruteForce(grid))
})

readFile('input.txt').then((grid) => {
  console.log('------------[P2] INPUT------------')
  console.log(bruteForce(grid))
})