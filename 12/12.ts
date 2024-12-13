type ResultMap = {
  startI: number;
  startJ: number;
  includes: string[];
  perimeter: number;
}[]

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

const partOne = (grid: string[][]) => {
  const resultMap: ResultMap = []
  for (let j = 0 ; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if(!resultMap.filter(entry => entry.includes.includes(`${i}-${j}`)).length) {
        exploreGarden(grid, i, j, i, j, resultMap)
      }
    }
  }
  return resultMap
}

const exploreGarden = (grid: string[][], startI: number, startJ: number, i: number, j: number, resultMap: ResultMap) => {
  let result = resultMap.find(item => item.startI === startI && item.startJ === startJ)
  if (!result) {
    result = {startI: startI, startJ: startJ, includes: [`${startI}-${startJ}`], perimeter: 0}
    resultMap.push(result)
  }

  [[i,j-1], [i+1,j], [i,j+1], [i-1,j]].forEach(coord => {
    if(coord[0] >= 0 && coord[0] < grid[0].length && coord[1] >= 0 && coord[1] < grid.length) {
      if(result.includes.includes(`${coord[0]}-${coord[1]}`)) {
        return
      }
      if(grid[coord[1]][coord[0]] === grid[j][i]) {
        result.includes.push(`${coord[0]}-${coord[1]}`)
        exploreGarden(grid, startI, startJ, coord[0], coord[1], resultMap)
      } else {
        result.perimeter++
      }
    } else {
      result.perimeter++
    }
  })
}

const computePrice = (resultMap: ResultMap) => {
  let count = 0
  resultMap.forEach(result => count += (result.perimeter * result.includes.length))
  return count
}

const computePricePartTwo = (grid: string[][], resultMap: ResultMap) => {

  resultMap.forEach(result => {
    let corners = 0
    let concaveCorners = 0
    result.includes.forEach(cell => {
      const ij = cell.split('-').map(tmp => parseInt(tmp))
      const i = ij[0]
      const j = ij[1]
      const possibleCorners = [
        [[i, j-1], [i+1, j]],
        [[i+1, j], [i, j+1]],
        [[i, j+1], [i-1, j]],
        [[i-1, j], [i, j-1]]
      ]

      possibleCorners.forEach(coordArr => {
        let isCorner = true
        let numberInArr = 0
        coordArr.forEach(coord => {
          console.log(coord)
          if(coord[0] >= 0 && coord[0] < grid[0].length && coord[1] >= 0 && coord[1] < grid.length && result.includes.includes(`${coord[0]}-${coord[1]}`)) {
            console.log('false')
            isCorner = false
            numberInArr++
          }
        })
        if(numberInArr === 1) concaveCorners++
        if(isCorner) {
          corners++
          console.log('true')
        }
        console.log('---')

      })
      console.log('-------------------------')
    })
    console.log(result, corners, concaveCorners / 2, (corners + (concaveCorners / 2)))
  })
  // let count = 0
  // resultMap.forEach(result => count += (result.perimeter * result.includes.length))
  // return count
}

readFile('example1.txt').then((grid) => {
  console.log('------------EXAMPLE1------------')
  const resultMap = partOne(grid)
  console.log(computePrice(resultMap))
  console.log(computePricePartTwo(grid, resultMap))
})

// readFile('example2.txt').then((grid) => {
//   console.log('------------EXAMPLE2------------')
//   const resultMap = partOne(grid)
//   console.log(computePrice(resultMap))
//   console.log(computePricePartTwo(grid, resultMap))

// })

// readFile('input.txt').then((grid) => {
//   console.log('------------INPut------------')
//   const resultMap = partOne(grid)
//   console.log(computePrice(resultMap))
//   console.log(computePricePartTwo(grid, resultMap))

// })
