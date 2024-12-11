const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);

  const stones = text.split(' ')
  return stones
}

// NOT OPTIMIZED
const iterate = (stones: string[]) => {
  let i = 0
  while(i < stones.length) {
    if(parseInt(stones[i]) === 0) {
      stones[i] = "1"
    } else if((stones[i].length % 2) === 0) {
      const partOne = stones[i].slice(0, stones[i].length / 2)
      const partTwo = stones[i].slice(stones[i].length / 2, stones[i].length)
      stones[i] = partOne
      stones.splice(i+1, 0, parseInt(partTwo).toString()) // To remove trailing 0s
      i++
    } else {
      stones[i] = (parseInt(stones[i]) * 2024).toString()
    }
    i++
  }
  return stones
}

const iterateXtimes = (stones: string[], times: number) => {
  for (let i = 0; i < times; i++) {
    stones = iterate(stones)
  }
  return stones
}

const iteratePartTwo = (stone: string, times: number, cache: {[key: string]: number}) => {
  let iteration = 0
  let length = 1
  while (iteration < times) {
    if(parseInt(stone) === 0) {
      stone = "1"
    } else if((stone.length % 2) === 0) {
      const partOne = stone.slice(0, stone.length / 2)
      const partTwo = stone.slice(stone.length / 2, stone.length)
      stone = partOne
      if (cache[`${partTwo}-${times - iteration - 1}`]) {
        length += cache[`${partTwo}-${times - iteration - 1}`]
      } else {
        const res = iteratePartTwo(parseInt(partTwo).toString(), times - iteration - 1, cache)
        cache[`${partTwo}-${times - iteration - 1}`] = res
        length += res
      }
    } else {
      stone = (parseInt(stone) * 2024).toString()
    }
    iteration++
  }
  // console.log(stone)
  return length
}

const iterateXtimesPartTwo = (stones: string[], times: number) => {
  const cache: {[key: string]: number} = {}
  let count = 0
  stones.forEach(stone => count += iteratePartTwo(stone, times, cache))
  return count
}

readFile('example.txt').then((stones) => {
  console.log('------------EXAMPLE------------')
  const finalStones = iterateXtimes(stones, 25)
  // console.log(finalStones.join(' '))
  console.log(finalStones.length)
})

// readFile('input.txt').then((stones) => {
//   console.log('------------INPUT------------')
//   const finalStones = iterateXtimes(stones, 25)
//   console.log(finalStones.length)
// })

readFile('example.txt').then((stones) => {
  console.log('------------[P2] EXAMPLE------------')
  const length = iterateXtimesPartTwo(stones, 25)
  console.log(length)
})

readFile('input.txt').then((stones) => {
  console.log('------------[P2] INPUT 25 times------------')
  const length = iterateXtimesPartTwo(stones, 25)
  console.log(length)
})

readFile('input.txt').then((stones) => {
  console.log('------------[P2] INPUT 75 times------------')
  const length = iterateXtimesPartTwo(stones, 75)
  console.log(length)
})
