const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)

  const rules: string[] = []
  const updates: number[][] = []

  lines.forEach(line => {
    if(line === '') return
    if(line.includes('|')) rules.push(line)
    if(line.includes(',')) updates.push(line.split(',').map(cell => parseInt(cell)))
  })

  return {rules, updates}
}

const buildRuleSet = (rules: string[]) => {
  const ruleSet = {} as {[key: number]: number[]}

  rules.forEach(rule => {
    const [first, second] = rule.split('|').map(cell => parseInt(cell))
    if (!ruleSet[second]) ruleSet[second] = [first]
    else ruleSet[second].push(first)
  })

  return ruleSet
}

const checkValidity = (
  ruleSet: {[key: number]: number[]},
  updates: number[][]
) => {
  const res: {valids: number[][], invalids: number[][]} = {valids: [], invalids: []}
  updates.forEach(line => {
    const pastNumbers: number[] = []
    let isValid = true

    const cpy = [...line]
    cpy.reverse()

    cpy.forEach(update => {
      if(!isValid) return

      if(ruleSet[update] && pastNumbers.filter(value => ruleSet[update].includes(value)).length) {
        isValid = false
      }
      pastNumbers.push(update)
    })

    if(isValid) res.valids.push(line)
    else res.invalids.push(line)
  })
  return res
}

const computeMedianSum = (validUpdates: number[][]) => {
  let res = 0
  validUpdates.forEach(update => {
    res  += update[Math.floor(update.length / 2)]
  })
  return res
}


// =========================================================
//                         PART 2
// =========================================================

const bubbleSort = (
  ruleSet: {[key: number]: number[]},
  array: number[]
) => {
  const arr = Array.from(array);
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i; j++) {
      if (ruleSet[arr[j]] && ruleSet[arr[j]].includes(arr[j+1])) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
};

const reorderInvalides = (
  ruleSet: {[key: number]: number[]},
  invalidUpdates: number[][]
) => {
  const res: number[][] = []
  invalidUpdates.forEach(update => {
    update = bubbleSort(ruleSet, update)
    res.push(update)
  })
  return res
}


readFile('example.txt').then(({rules, updates}) => {
  console.log('------------EXAMPLE------------')
  const ruleSet = buildRuleSet(rules)
  const sortedUpdates = checkValidity(ruleSet, updates)
  console.log(computeMedianSum(sortedUpdates.valids))
})

readFile('input.txt').then(({rules, updates}) => {
  console.log('------------INPUT------------')
  const ruleSet = buildRuleSet(rules)
  const sortedUpdates = checkValidity(ruleSet, updates)
  console.log(computeMedianSum(sortedUpdates.valids))
})


readFile('example.txt').then(({rules, updates}) => {
  console.log('------------[P2] EXAMPLE------------')
  const ruleSet = buildRuleSet(rules)
  const sortedUpdates = checkValidity(ruleSet, updates)
  const reorderedInvalids = reorderInvalides(ruleSet, sortedUpdates.invalids)
  console.log(computeMedianSum(reorderedInvalids))
})

readFile('input.txt').then(({rules, updates}) => {
  console.log('------------[P2] INPUT------------')
  const ruleSet = buildRuleSet(rules)
  const sortedUpdates = checkValidity(ruleSet, updates)
  const reorderedInvalids = reorderInvalides(ruleSet, sortedUpdates.invalids)
  console.log(computeMedianSum(reorderedInvalids))
})