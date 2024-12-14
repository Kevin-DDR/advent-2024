import { Console } from "node:console";

type Robot = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

type Data = {
  robots: Robot[];
  height: number;
  width: number;
}

const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
}

const extractRobot = (line: string, id: number): Robot => {
  const blocks = line.trim().replaceAll('p=', '').replaceAll('v=', '').split(' ')
  const pos = blocks[0].split(',').map(coord => parseInt(coord))
  const speed = blocks[1].split(',').map(coord => parseInt(coord))
  return {
    id,
    x: pos[0],
    y: pos[1],
    vx: speed[0],
    vy: speed[1]
  }
}

const readFile = async (path: string, width: number, height: number) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g).filter(line => line.trim() !== '')

  const data: Data = {robots: [], height, width}

  let id  = 0 

  lines.forEach(line => {
    data.robots.push(extractRobot(line, id))
    id++
  })

  return data
}

const moveRobots = (data: Data) => {
  data.robots.forEach(robot => {
    robot.x = mod((robot.x + robot.vx), data.width)
    robot.y = mod((robot.y + robot.vy),data.height)
  })
}

const partOne = (data: Data, iterations: number) => {
  for(let i = 0; i < iterations; i++) {
    moveRobots(data)
  }
  // NW NE SE SW
  const results = {NW: 0, NE: 0, SE: 0, SW: 0}
  data.robots.forEach(robot => {
    if(robot.x < Math.floor(data.width / 2) && robot.y < Math.floor(data.height / 2)) results.NW++
    if(robot.x > Math.floor(data.width / 2) && robot.y < Math.floor(data.height / 2)) results.NE++
    if(robot.x > Math.floor(data.width / 2) && robot.y > Math.floor(data.height / 2)) results.SE++
    if(robot.x < Math.floor(data.width / 2) && robot.y > Math.floor(data.height / 2)) results.SW++
  })
  return Object.values(results).reduce((newVal, total) => total * newVal, 1) 
}


const displayGrid = (data: Data) => {
  for (let j = 0; j < data.height; j++) {
    let string = ''
    for (let i = 0; i < data.width; i++) {
      const nbRobots = data.robots.filter(robot => robot.x === i && robot.y === j).length
      string += nbRobots ? nbRobots : ' '
    }
    console.log(string)
  }
}

const partTwo = (data: Data, start: number) => {
  let i = 0
  while(i < start) {
    moveRobots(data)
    i++
  }
  while(prompt("Keep going ? y/n") !== 'n') {
    console.log(`------------ ${i} ------------`)
    displayGrid(data)
    i++
    moveRobots(data)
  }
}

readFile('example.txt', 7, 11).then((data) => {
  console.log('------------EXAMPLE------------')
  console.log(partOne(data, 100))
})

readFile('input.txt', 101, 103).then((data) => {
  console.log('------------INPUT------------')
  console.log(partOne(data, 100))
})

readFile('input.txt', 101, 103).then((data) => {
  console.log('------------[P2] INPUT------------')
  partTwo(data, 5000)
})