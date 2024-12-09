const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path)

  return text
}

const writeFirstLine = (text: string) => {
  const arr: string[] = []
  let freeSpace = false
  let id = 0

  text.split('').forEach(cell => {
    if(freeSpace) {
      for(let i = 0; i < parseInt(cell); i++) arr.push( '.')
    } else {
      for(let i = 0; i < parseInt(cell); i++) arr.push( id.toString())
      id++
    }
    freeSpace = !freeSpace
  })
  return arr
}

const reorder = (arr: string[]) => {
  for(let startI = 0; startI < arr.length ; startI++) {
    if(arr[startI] !== '.') continue
    for(let endI = arr.length - 1; endI >= 0; endI--) {
      if(endI <= startI) break
      if(arr[endI]!== '.') {
        arr[startI] = arr[endI]
        arr[endI] = '.'
        break
      }
    }
  }
  return arr
}

const moveBlock = (arr: string[], startI: number, endI: number, newStartI: number) => {
  for(let i = 0; i <= endI - startI; i++) {
    arr[newStartI + i] = arr[startI + i]
    arr[startI + i] = '.'
  }
  return arr
}

const findSpace = (arr: string[], requiredSize: number, maxI: number) => {
  let i = 0
  let size = 0

  while(i < arr.length && i <= maxI && size < requiredSize) {
    if(arr[i] === '.') {
      size++
      if(size === requiredSize) {
        return {
          startI: i+1 - size,
          size: size
        }
      }
    } else {
      size = 0
    }
    i++
  }

  return {
    startI: -1,
    size: 0
  }
}

const reorderPartTwo = (arr: string[]) => {
  let endI = arr.length - 1
  let blockEnd = endI
  let blockStart = endI
  let currentCell = arr[arr.length - 1]

  const doneIds: string[] = []

  while(endI >= 0) {
    if(arr[endI] !== currentCell && !doneIds.includes(currentCell)) {
      const spaceReturn = findSpace(arr,blockEnd - blockStart + 1, endI)
      doneIds.push(arr[blockEnd])
      if(spaceReturn.size) {
        moveBlock(arr, blockStart, blockEnd, spaceReturn.startI)
      }
    }

    if(arr[endI] === '.') {
      endI--
      continue
    }
    if(arr[endI] === currentCell) {
      blockStart = endI
    } else {
      currentCell = arr[endI]
      blockEnd = endI
      blockStart = endI
    }
    endI--
  }
  return arr
}

const computeSum = (arr: string[]) => {
  let sum = 0
  let i = 0

  arr.forEach(cell => {
    if(cell === '.') {
      i++
      return
    }
    sum += parseInt(cell) * i
    i++
  })

  return sum
}

readFile('example.txt').then((text) => {
  console.log('------------EXAMPLE------------')
  const line = writeFirstLine(text)
  const arr = reorder(line)
  console.log(computeSum(arr))
})

readFile('input.txt').then((text) => {
  console.log('------------INPUT------------')
  const line = writeFirstLine(text)
  const arr = reorder(line)
  console.log(computeSum(arr))
})

readFile('example.txt').then((text) => {
  console.log('------------[P2] EXAMPLE------------')
  const line = writeFirstLine(text)
  const arr = reorderPartTwo(line)
  console.log(computeSum(arr))
})

readFile('input.txt').then((text) => {
  console.log('------------[P2] INPUT------------')
  const line = writeFirstLine(text)
  const arr = reorderPartTwo(line)
  console.log(computeSum(arr))
})

readFile('test.txt').then((text) => {
  console.log('------------[P2] TEST------------')
  const line = writeFirstLine(text)
  const arr = reorderPartTwo(line)
  console.log(computeSum(arr))
})