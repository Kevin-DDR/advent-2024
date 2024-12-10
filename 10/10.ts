interface ResultMap {[key: string]: {i: number, j: number}[]}
interface RatingMap {[key: string]: number}

const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)

  const grid: number[][]  = []
  lines.forEach(line => {
    const cells = line.split('').map(cell => parseInt(cell))
    grid.push(cells)
  })

  return grid
}


const findStarts = (grid: number[][]) => {
  const finalMap: ResultMap = {}
  const ratingMap: RatingMap = {}
  for (let j = 0 ; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {

      if(grid[j][i] === 0) {
        finalMap[`${i}-${j}`] = []
        ratingMap[`${i}-${j}`] = 0
        exploreTrail(grid, i, j, finalMap, i, j, ratingMap)
      } 
    }
  }
  return {score: computeScore(finalMap), rating: computeRating(ratingMap)}
}

const computeScore = (finalMap: ResultMap) => {
  let count = 0
  for (const [_, value] of Object.entries(finalMap)) {
    count += value.length
  }
  return count
}

const computeRating = (ratingMap: RatingMap) => {
  let count = 0
  for (const [_, value] of Object.entries(ratingMap)) {
    count += value
  }
  return count
}

const exploreTrail = (grid: number[][], lastI: number, lastJ: number, finalMap: ResultMap, startI: number, startJ: number, ratingMap: RatingMap) => {
  const coordToCheck = [[lastI, lastJ - 1], [lastI + 1, lastJ], [lastI, lastJ + 1], [lastI - 1, lastJ]]
  coordToCheck.forEach(([i, j]) => {
    if(i >= 0 && j >= 0 && i < grid[0].length && j < grid.length && ((grid[j][i] - grid[lastJ][lastI]) === 1)) {
      if(grid[j][i] === 9) {
        ratingMap[`${startI}-${startJ}`]++
        if(!finalMap[`${startI}-${startJ}`].filter(obj => obj.i === i && obj.j === j).length) {
          finalMap[`${startI}-${startJ}`].push({i,j})
        }
      } else {
        exploreTrail(grid, i, j, finalMap, startI, startJ, ratingMap)
      }
    }
  }) 
}


readFile('example.txt').then((grid) => {
  console.log('------------EXAMPLE------------')
  console.log(findStarts(grid))
})

readFile('input.txt').then((grid) => {
  console.log('------------INPUT------------')
  console.log(findStarts(grid))
})