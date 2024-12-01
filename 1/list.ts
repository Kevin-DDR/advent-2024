const getDistanceFromLists = (la: number[], lb: number[]) => {
  la.sort( (a, b) => a - b)
  lb.sort( (a, b) => a - b)
  let distance = 0

  for (let i = 0; i < la.length; i++) {
    distance += Math.abs(la[i] - lb[i])
  }

  return distance
}

const getListsFromFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)
  const la: number[] = []
  const lb: number[] = []
  lines.forEach(line => {
    const cells = line.replace(' ', '/').split('/')
    la.push(parseInt(cells[0]))
    lb.push(parseInt(cells[1]))
  })

  return [la, lb]
}

const getOccurences = (target: number, list: number[]) => {
  return list.filter(x => x === target).length
}

const getSimilarityFromLists = (la: number[], lb: number[]) => {
  let similarity = 0
  la.forEach(cell => {
    similarity += cell * getOccurences(cell, lb)
  })

  return similarity
}

getListsFromFile('input.txt').then(([la, lb]) => {
  console.log('Distance : ', getDistanceFromLists(la, lb))
  console.log('Similarity : ', getSimilarityFromLists(la, lb))
})