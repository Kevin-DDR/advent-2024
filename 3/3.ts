const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  
  return text
}

const getTotal = (text: string) => {
  const regex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g
  const array = [...text.matchAll(regex)]
  let total = 0

  array.forEach(operation => {
    total += getValueFromOperation(operation[0])
  })

  return total
}

const getTotalWithDos = (text: string) => {
  const regex = /(mul\([0-9]{1,3},[0-9]{1,3}\)|do\(\)|don't\(\))/g
  const array = [...text.matchAll(regex)]
  let total = 0
  let enabled = true

  array.forEach(operation => {
    if(operation[0].includes('do(')) enabled = true
    else if(operation[0].includes("don't(")) enabled = false
    else if (enabled) total += getValueFromOperation(operation[0])
  })

  return total
}

const getValueFromOperation = (operation: string) => {
  const numbers = operation.replace('mul(',')').replace(')', '').split(',').map(n => parseInt(n))

  return numbers[0] * numbers[1]
}

readFile('example.txt').then(text => {
  console.log('------------EXAMPLE------------')
  console.log(getTotal(text))
})

readFile('input.txt').then(text => {
  console.log('------------INPUT------------')
  console.log(getTotal(text))
})


readFile('example2.txt').then(text => {
  console.log('------------[P2] EXAMPLE------------')
  console.log(getTotalWithDos(text))
})

readFile('input.txt').then(text => {
  console.log('------------[P2] INPUT------------')
  console.log(getTotalWithDos(text))
})

