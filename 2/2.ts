

const getReportsFromFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n|\r|\n/g)

  const reportLists: number[][]  = []
  lines.forEach(line => {
    const reports = line.split(' ').map(cell => parseInt(cell))
    reportLists.push(reports)
  })
  return reportLists
}

const reportIsSafe = (reportList: number[], minStep = 1, maxStep = 3) => {
  let isSafeAsc = true
  let isSafeDesc = true

  let lastElem: number | undefined = undefined
  reportList.forEach(report => {
    if(!isSafeAsc && !isSafeDesc) return

    if(lastElem === undefined) {
      lastElem = report
      return
    }

    const difference  = Math.abs(report - lastElem)

    if (difference > maxStep || difference < minStep) {
      isSafeAsc = false
      isSafeDesc = false
    }

    // 5 4 3 2 1
    if(lastElem > report) {
      isSafeAsc = false
    }

    // 1 2 3 4 5
    if(lastElem < report) {
      isSafeDesc = false
    }

    lastElem = report
  })

  return isSafeAsc || isSafeDesc
}

const countSafeReports = (reportLists: number[][]) => {
  let safeCount = 0

  reportLists.forEach(reportList => {
    let canBeSafe = false
    for (let i = 0; i < reportList.length; i++) {
      const arrayCopy = reportList.slice()
      arrayCopy.splice(i, 1)
      canBeSafe = canBeSafe || reportIsSafe(arrayCopy)
    }

    if (canBeSafe) safeCount++
  })
  return safeCount
}

getReportsFromFile('example.txt').then((reportLists) => {
  console.log(countSafeReports(reportLists))
})

getReportsFromFile('input.txt').then((reportLists) => {
  console.log(countSafeReports(reportLists))
})