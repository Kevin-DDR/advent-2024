type Data = {
  a: number;
  b: number;
  c: number;
  program: number[];
}
const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g).filter(line => line.trim() !== '')

  const data: Data = { a: 0, b: 0, c:0, program: []}

  lines.forEach(line => {
    const value = line.split(' ').pop() as string
    if(line.includes('Program')) {
      data.program = value?.split(',').map(cell => parseInt(cell))
    } else {
      if(line.includes('Register A: ')) data.a = parseInt(value)
      if(line.includes('Register B: ')) data.b = parseInt(value)
      if(line.includes('Register C: ')) data.c = parseInt(value)
    }
  })

  return data
}

const dec2bin = (dec: number) => {
  return (dec >>> 0).toString(2)
}

const bitwiseXOr = (firstBinary: string[], secondBinary: string[]) => {
  const bin_res = []
  for(let i = 0; i < Math.max(firstBinary.length, secondBinary.length); i++) {
    let firstBit = 0
    let secondBit = 0
    if(firstBinary[i] && firstBinary[i] === '1') firstBit = 1
    if(secondBinary[i] && secondBinary[i] === '1') secondBit = 1

    if(firstBit === secondBit) bin_res.push(0)
    else bin_res.push(1)
  }
  return parseInt(bin_res.reverse().join(''), 2)
}

const partOne = (data: Data) => {
  let pointer = 0
  const res: string[] = []
  while(pointer < data.program.length) {

    const opcode = data.program[pointer]
    let operand = data.program[pointer+1]
    let jumped = false

    switch(opcode) {
      case 0:
        // division
        operand = getComboOperand(data, operand)
        data.a = Math.floor(data.a / (Math.pow(2, operand)))
        break
      case 1: {
          const bBinary = dec2bin(data.b).split('').reverse()
          const operandBinary = dec2bin(operand).split('').reverse()

          data.b = bitwiseXOr(bBinary, operandBinary)

        }
        break
      case 2: 
        data.b = getComboOperand(data, operand) % 8
        break
      case 3:
        if(data.a !== 0) {
          jumped = true
          pointer = operand
        }
      break
      case 4:
        data.b = bitwiseXOr(dec2bin(data.b).split('').reverse(), dec2bin(data.c).split('').reverse())
        break
      case 5:
        res.push((getComboOperand(data, operand) % 8).toString())
        break
      case 6:
        operand = getComboOperand(data, operand)
        data.b = Math.floor(data.a / (Math.pow(2, operand)))
        break
      case 7:
        operand = getComboOperand(data, operand)
        data.c = Math.floor(data.a / (Math.pow(2, operand)))
        break
    }
    if(!jumped) pointer += 2
  }

  return res.join()
}

const partTwo = (data: Data) => {
  let res = ''
  const goal = data.program.join(',')
  const series = []
  let i = Math.pow(8, data.program.length-1)
  // console.log(data.program.length, data.program, Math.pow(8, data.program.length))
  // let i = 1000
  let dataCpy = JSON.parse(JSON.stringify(data))
  dataCpy.a = i
  res = partOne(dataCpy)
  for(let index = res.length - 1; index >= 0; index--) {
    while(res.split(',')[index] !== goal.split(',')[index]) {
      dataCpy = JSON.parse(JSON.stringify(data))
      i+= Math.pow(8, index)
      dataCpy.a = i
      res = partOne(dataCpy)
    }
  }

  return i

  // let prevStoredValue = '0'
  // let prevStoredIndex = 0
  // while(res !== goal) {
  //   const dataCpy = JSON.parse(JSON.stringify(data))
  //   dataCpy.a = i
  //   res = partOne(dataCpy)
  //   if(res.split(',')[res.split(',').length - 2] !== prevStoredValue) {
  //     prevStoredValue = res.split(',')[res.split(',').length - 2]
  //     console.log(i - prevStoredIndex, prevStoredValue)
  //     prevStoredIndex = i
  //     series.push(prevStoredValue)
  //     console.log(series.join(''))
  //     console.log(res.split(',').length)
  //     console.log('-----------')
  //   }
  //   // console.log(i, res)
  //   i++
  // }
  // return i-1
}

const getComboOperand = (data: Data, operand: number) => {
  if(operand <= 3) return operand
  if(operand === 4) return data.a
  if(operand === 5) return data.b
  if(operand === 6) return data.c

  throw new Error('Operand 7 found')
}


readFile('example.txt').then((data) => {
  console.log('------------EXAMPLE------------')
  console.log(partOne(data))
})

readFile('input.txt').then((data) => {
  console.log('------------INPUT------------')
  console.log(partOne(data))
})

readFile('test.txt').then((data) => {
  console.log('------------TEST------------')
  console.log(partTwo(data))
})

readFile('input.txt').then((data) => {
  console.log('------------[P2] INPUT------------')
  console.log(partTwo(data))
})