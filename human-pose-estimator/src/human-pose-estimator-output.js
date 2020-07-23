/* globals tf */

import { cocoParts, cocoPairs, cocoPairsNetwork } from './human-pose-estimator-coco.js'

const HeatMapCount = 19
const PafMapCount = 38
const MaxPairCount = 17
const DIMFACTOR = 8

const DEFAULTCONFIG = {
  nmsWindowSize: 6,
  nmsThreshold: 0.001,
  localPAFThreshold: 0.141,
  partScoreThreshold: 0.247,
  pafCountThreshold: 4,
  partCountThreshold: 4
}

let cfg = Object.assign({}, DEFAULTCONFIG)

const configuration = function (config) {
  cfg = Object.assign({}, DEFAULTCONFIG, (typeof config === 'object' ? config : {}))
}

const estimatePoses = function (heatmapTensor, pafmapTensor) {
  return tf.tidy(() => {
    const heatmap = heatmapTensor.bufferSync()
    const pafmap = pafmapTensor.bufferSync()

    // compute possible parts candidates
    const partCandidates = computeParts(heatmap)
    // compute possible pairs candidates
    const pairCandidates = computePairs(pafmap, partCandidates)
    // compute possible poses
    const poseCandidates = computePoses(partCandidates, pairCandidates)

    tf.dispose(heatmapTensor)
    tf.dispose(pafmapTensor)
    // create the JSON response (with bodyParts, poseLines, etc)
    return formatResponse(poseCandidates)
  })
}

const computeParts = function (heatmap) {
  const height = heatmap.shape[0]
  const width = heatmap.shape[1]
  const depth = heatmap.shape[2] - 1
  const parts = new Array(depth)

  // extract peak parts from heatmap
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      for (var d = 0; d < depth; d++) {
        if (!parts[d]) {
          parts[d] = []
        }
        const score = heatmap.get(y, x, d)
        if (score > cfg.nmsThreshold && isMaximum(score, y, x, d, heatmap)) {
          parts[d].push([y, x, score])
        }
      }
    }
  }

  return parts
}

const isMaximum = function (score, y, x, d, heatmap) {
  let isMax = true
  const height = heatmap.shape[0]
  const width = heatmap.shape[1]

  const h1 = Math.max(0, y - cfg.nmsWindowSize)
  const h2 = Math.min(height - 1, y + cfg.nmsWindowSize)
  const w1 = Math.max(0, x - cfg.nmsWindowSize)
  const w2 = Math.min(width - 1, x + cfg.nmsWindowSize)

  for (var h = h1; h <= h2; h++) {
    for (var w = w1; w <= w2; w++) {
      if (score < heatmap.get(h, w, d)) {
        isMax = false
        break
      }
    }
    if (!isMax) {
      break
    }
  }

  return isMax
}

const computePairs = function (pafmap, parts) {
  const pairsFinal = new Array(MaxPairCount)
  const pairs = new Array(MaxPairCount)

  cocoPairs.forEach((cocopair, i) => {
    const part1 = parts[cocopair[0]]
    const part2 = parts[cocopair[1]]

    pairs[i] = []
    pairsFinal[i] = []

    // connect the parts, score the connection, and find best matching connections
    for (var p1 = 0; p1 < part1.length; p1++) {
      for (var p2 = 0; p2 < part2.length; p2++) {
        const val = getPairScore(part1[p1][1], part1[p1][0], part2[p2][1], part2[p2][0], pafmap, cocoPairsNetwork[i])
        const score = val.score
        const count = val.count

        if (score > cfg.partScoreThreshold && count >= cfg.pafCountThreshold) {
          let inserted = false

          for (var l = 0; l < MaxPairCount; l++) {
            if (pairs[i][l] && score > pairs[i][l][2]) {
              pairs[i].splice(l, 0, [p1, p2, score])
              inserted = true
              break
            }
          }

          if (!inserted) {
            pairs[i].push([p1, p2, score])
          }
        }
      }
    }

    const added = {}
    for (var m = 0; m < pairs[i].length; m++) {
      const p = pairs[i][m]
      if (!added[`${p[0]}`] && !added[`${p[1]}`]) {
        pairsFinal[i].push(p)
        added[`${p[0]}`] = 1
        added[`${p[1]}`] = 1
      }
    }
  })

  return pairsFinal
}

const getPairScore = function (x1, y1, x2, y2, pafmap, cpnetwork) {
  let count = 0
  let score = 0

  const dx = x2 - x1
  const dy = y2 - y1
  const normVec = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))

  if (normVec >= 0.0001) {
    const shape = pafmap.shape
    const vx = dx / normVec
    const vy = dy / normVec

    for (var t = 0; t < 10; t++) {
      const tx = Math.round(x1 + (t * dx / 9) + 0.5)
      const ty = Math.round(y1 + (t * dy / 9) + 0.5)

      if (shape[0] > ty && shape[1] > tx) {
        const s = vy * pafmap.get(ty, tx, cpnetwork[1]) +
                vx * pafmap.get(ty, tx, cpnetwork[0])

        if (s > cfg.localPAFThreshold) {
          count++
          score += s
        }
      }
    }
  }

  return {
    score: score,
    count: count
  }
}

const computePoses = function (parts, pairs) {
  const humans = []

  cocoPairs.forEach((cocopair, i) => {
    const p1 = cocopair[0]
    const p2 = cocopair[1]

    pairs[i].forEach((pair, j) => {
      const ip1 = pair[0]
      const ip2 = pair[1]
      let merged = false

      // calculate possible bodies from all pairs found
      for (var k = 0; k < humans.length; k++) {
        const human = humans[k]
        if (ip1 === human.coordsIndexSet[p1] || ip2 === human.coordsIndexSet[p2]) {
          human.coordsIndexSet[p1] = ip1
          human.coordsIndexSet[p2] = ip2

          human.partsList[p1] = partsJSON(p1, parts[p1][ip1])
          human.partsList[p2] = partsJSON(p2, parts[p2][ip2])

          merged = true
          break
        }
      }

      if (!merged) {
        const human = {
          partsList: new Array(18),
          coordsIndexSet: new Array(18)
        }

        human.coordsIndexSet[p1] = ip1
        human.coordsIndexSet[p2] = ip2

        human.partsList[p1] = partsJSON(p1, parts[p1][ip1])
        human.partsList[p2] = partsJSON(p2, parts[p2][ip2])

        humans.push(human)
      }
    })
  })

  return humans
}

const partsJSON = function (id, coords) {
  return {
    x: coords[1] ? coords[1] * DIMFACTOR : coords[1],
    y: coords[0] ? coords[0] * DIMFACTOR : coords[0],
    partName: cocoParts[id],
    partId: id,
    score: coords[2]
  }
}

const formatResponse = function (humans) {
  const humansFinal = []

  for (var i = 0; i < humans.length; i++) {
    let bodyPartCount = 0

    for (let j = 0; j < HeatMapCount - 1; j++) {
      if (humans[i].coordsIndexSet[j]) {
        bodyPartCount += 1
      }
    }

    // only include poses with enough parts
    if (bodyPartCount > cfg.partCountThreshold) {
      const pList = humans[i].partsList
      const poseLines = []

      const cocoPairsRender = cocoPairs.slice(0, cocoPairs.length - 2)
      cocoPairsRender.forEach((pair, idx) => {
        if (pList[pair[0]] && pList[pair[1]]) {
          poseLines.push([pList[pair[0]].x, pList[pair[0]].y, pList[pair[1]].x, pList[pair[1]].y])
        }
      })

      humansFinal.push({
        humanId: i,
        bodyParts: pList,
        poseLines: poseLines
      })
    }
  }

  return humansFinal
}

/**
 * convert model Tensor output to JSON containing body parts and poses lines data
 *
 * @param {Tensor} inferenceResults - the output from running the model
 */
const postprocess = function (inferenceResults) {
  const [heatmapTensor, pafmapTensor] = tf.tidy(() => {
    return inferenceResults.unstack()[0].split([HeatMapCount, PafMapCount], 2)
  })
  return Promise.all([heatmapTensor.array(), pafmapTensor.array()])
    .then(maps => {
      tf.dispose(inferenceResults)
      return Promise.resolve({
        heatMap: maps[0],
        pafMap: maps[1],
        posesDetected: estimatePoses(heatmapTensor, pafmapTensor),
        imageSize: {
          width: heatmapTensor.shape[1] * DIMFACTOR,
          height: heatmapTensor.shape[0] * DIMFACTOR
        }
      })
    })
}

export { postprocess, configuration }
