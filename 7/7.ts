const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)

  return lines
}

const getTotal = (lines: string[], partTwo: boolean = false) => {
  let total = 0
  lines.forEach(line => {
    total += testLine(line, partTwo)
  })

  return total
}

const testLine = (line: string, partTwo: boolean = false) => {
  const array = line.split(':')
  const target = parseInt(array.shift()!)

  const values = array[0].trim().split(' ').map(cell => parseInt(cell))
  const firstValue = values.shift()
  const possibilities: string[] = []

  addOperator(firstValue!.toString(), values, possibilities, partTwo)
  // console.log(possibilities)
  let canBeTrue = false
  possibilities.forEach(possibility => {
    if(canBeTrue) return
    if(computeLine(possibility) === target) canBeTrue = true
  })

  return canBeTrue ? target : 0

}

const computeLine = (line: string) => {
  const cells = line.replaceAll('+', '/+/').replaceAll('*', '/*/').replaceAll('||', '/||/').split('/')
  let total = parseInt(cells[0])

  for(let i = 1; i < cells.length; i++) {
    if(cells[i] === '*') total *= parseInt(cells[i+1])
    if(cells[i] === '+') total += parseInt(cells[i+1])
    if(cells[i] === '||') total = parseInt(total.toString() +  cells[i+1])
  }

  return total
}

const addOperator = (currentString: string, valuesLeft: number[], possibilities: string[], partTwo: boolean = false) => {
  if(!valuesLeft.length) {
    possibilities.push(currentString)
    return
  }
  const cpy = JSON.parse(JSON.stringify(valuesLeft))
  const firstValue = cpy.shift()

  addOperator(currentString + '+' + firstValue, cpy, possibilities, partTwo)
  addOperator(currentString + '*' + firstValue, cpy, possibilities, partTwo)
  if(partTwo) addOperator(currentString + '||' + firstValue, cpy, possibilities, partTwo)

}

readFile('example.txt').then((lines) => {
  console.log('------------EXAMPLE------------')
  const total = getTotal(lines)
  console.log(total)
})


readFile('input.txt').then((lines) => {
  console.log('------------INPUT------------')
  const total = getTotal(lines)
  console.log(total)
})

readFile('example.txt').then((lines) => {
  console.log('------------[P2] EXAMPLE------------')
  const total = getTotal(lines, true)
  console.log(total)
})

readFile('input.txt').then((lines) => {
  console.log('------------[P2] INPUT------------')
  const total = getTotal(lines, true)
  console.log(total)
})
