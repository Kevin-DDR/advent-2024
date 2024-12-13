import nerdamer from 'npm:nerdamer'
import 'npm:nerdamer/Algebra.js'
import 'npm:nerdamer/Calculus.js'
import 'npm:nerdamer/Solve.js'

type Button = {
  x: number;
  y: number;
  price: number
}

type Prize = {
  x: number;
  y: number;
}

type Situation = {
  a: Button,
  b: Button,
  prize: Prize
}

type Solution = {
  nbA: number;
  nbB: number;
  price: number
}

const extractCoord = (line: string) => {
  return line.replaceAll('Prize: ', '').replaceAll('Button A: ', '').replaceAll('Button B: ', '').replaceAll(',', '').replaceAll('X+', '').replaceAll('Y+', '').replaceAll('X=', '').replaceAll('Y=', '').split(' ').map(coord => parseInt(coord))
}

const readFile = async (path: string, partTwo: boolean = false) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g).filter(line => line.trim() !== '')
  const situations: Situation[] = []

  let i  = 0 
  while (i < lines.length) {
    
    let coord = extractCoord(lines[i])
    const a: Button = {x: coord[0], y: coord[1], price: 3}

    coord = extractCoord(lines[i+1])
    const b: Button = {x: coord[0], y: coord[1], price: 1}

    coord = extractCoord(lines[i+2])
    const prize: Prize = {x: coord[0], y: coord[1]}
    if(partTwo) {
       prize.x += 10000000000000
       prize.y += 10000000000000
    }
  
    situations.push({a, b, prize})
    i += 3
  }

  return situations
}

const partTwo = (situations: Situation[]) => {
  let tokens = 0
  situations.forEach(situation => {
    try {
    let sol = nerdamer.solveEquations([`${situation.a.x}a+${situation.b.x}b=${situation.prize.x}`, `${situation.a.y}a+${situation.b.y}b=${situation.prize.y}`])
    if((sol[0][1] % 1 === 0) && (sol[1][1] % 1 === 0 )) {
      tokens += sol[0][1] * situation.a.price + sol[1][1] * situation.b.price
    }
    } catch (_) {}  
  })

  return tokens
}

const partOne = (situations: Situation[]) => {
  let tokens = 0
  situations.forEach(situation => {
    const solutions: Solution[] = []

    for(let i = 0; i <= 100; i++) {
      for(let j = 0; j <= 100; j++) {
        const x = i * situation.a.x + j * situation.b.x
        const y = i * situation.a.y + j * situation.b.y

        if(x === situation.prize.x && y === situation.prize.y) {
          solutions.push({nbA: i, nbB:j, price: i * situation.a.price + j * situation.b.price})
        }
      }
    }
    if(solutions.length) {
      tokens += solutions.reduce((prev, curr) => prev.price < curr.price ? prev : curr).price
    }    
  })

  return tokens
}

readFile('example.txt').then((situations) => {
  console.log('------------EXAMPLE------------')
  console.log(partOne(situations))
})

readFile('input.txt').then((situations) => {
  console.log('------------INPUT------------')
  console.log(partOne(situations))
})

readFile('example.txt', true).then((situations) => {
  console.log('------------[P2] EXAMPLE------------')
  console.log(partTwo(situations))
})

readFile('input.txt', true).then((situations) => {
  console.log('------------[P2] INPUT------------')
  console.log(partTwo(situations))
})