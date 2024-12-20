type Data = {
  patterns : string[]
  goals: string[]
}
const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g).filter(line => line.trim() !== '')

  const data: Data = { patterns: [], goals: []}

  data.patterns = lines.shift()!.split(', ').map(pattern => pattern)

  data.goals = lines.map(line => line)

  return data
}

const partOne = (data: Data) => {
  let count = 0
  const regex = new RegExp(`^(${data.patterns.join('|')})+$`)
  data.goals.forEach(goal => {
    if(regex.test(goal)) count++
  })
  return count
}

const partTwo = (data: Data) => {
  const countObject = {count: 0}
  const cache: {[key: string]: number} = {}
  data.goals.forEach(goal => {
    // const cache: {[key: string]: number} = {}
    const patternCopy = JSON.parse(JSON.stringify(data.patterns)).filter((pattern: string) => goal.includes(pattern))
    patternCopy.forEach((pattern: string) => {
      // const cache: {[key: string]: number} = {}
      testString(goal, pattern, patternCopy, countObject, cache)
    })
  })
  return countObject.count
}

const testString = (str: string, regexStr: string, patterns: string[], countObject: {count: number}, cache: {[key: string]: number}) => {
  const regex = new RegExp(`^${regexStr}`)
  let count = 0
  if(!regex.test(str)) return false
  const strCopy = str.replace(regexStr, '')

  if(strCopy.length === 0) {
    if(!cache[strCopy]) cache[strCopy]  = 0
    cache[strCopy]++
    countObject.count++
    return true
  }

  if(cache[strCopy] !== undefined) {
    countObject.count += cache[strCopy]
    count += cache[strCopy]
    return count
  }

  const patternCopy: string[] = JSON.parse(JSON.stringify(patterns)).filter((pattern: string) => strCopy.includes(pattern))
  patternCopy.forEach(pattern => {
    if(testString(strCopy, pattern, patternCopy, countObject, cache)) {
      count++
    }
  })

  return count
}

readFile('example.txt').then((data) => {
  console.log('------------EXAMPLE------------')
  console.log(partOne(data))
  console.log('------------[P2] EXAMPLE------------')
  console.log(partTwo(data))
})

readFile('input.txt').then((data) => {
  console.log('------------INPUT------------')
  console.log(partOne(data))
  console.log('------------[P2] INPUT------------')
  // console.log(partTwo(data))
})