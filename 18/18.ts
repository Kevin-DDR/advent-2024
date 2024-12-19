// I'm going to be real, it's getting near my Xmas holidays
// and I can't be asked to reimplement A* on my free time.
import {Grid,Astar} from "npm:fast-astar";

type Data = {
  grid: any;
  width: number;
  height: number;
  lines: string[]
}
const readFile = async (path: string, width: number, height: number) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g).filter(line => line.trim() !== '')

  const data: Data = { grid: [], width, height, lines}

  data.grid = new Grid({col: width, row: height})

  return data
}

const iterate = (data: Data, line: string) => {
  const coords = line.split(',').map(coord => parseInt(coord))
  data.grid.set(coords, 'value', 1)
} 

const partOne = (data: Data, maxIteration: number) => {
  let iteration = 1
  data.lines.forEach(line => {
    if(iteration > maxIteration) return
    iterate(data, line)
    
    iteration++
  })
  const astar = new Astar(data.grid)
  return astar.search([0,0], [data.width - 1, data.height-1], {rightAngle: true})
}

const partTwo = (data: Data) => {
  let iteration = 0
  while(iteration < data.lines.length) {
    iterate(data, data.lines[iteration])
    const astar = new Astar(data.grid)
    const path = astar.search([0,0], [data.width - 1, data.height-1], {rightAngle: true, optimalResult: false})
    if(!path || path.length === 0) return data.lines[iteration]
    iteration++
  }
  return false
}
 
readFile('example.txt', 7, 7).then((data) => {
  console.log('------------EXAMPLE------------')
  const path = partOne(data, 12)
  console.log(path.length -1)
})

readFile('input.txt', 71, 71).then((data) => {
  console.log('------------INPUT------------')
  const path = partOne(data, 1024)
  console.log(path.length -1)  
})

readFile('example.txt', 7, 7).then((data) => {
  console.log('------------[P2] EXAMPLE------------')
  const coords = partTwo(data)
  console.log(coords)
})

readFile('input.txt', 71, 71).then((data) => {
  console.log('------------[P2] INPUT------------')
  const coords = partTwo(data)
  console.log(coords)  
})