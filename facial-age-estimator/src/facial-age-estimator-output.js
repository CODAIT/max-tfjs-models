/* globals tf */

const postprocess = function (inferenceResults) {
  return inferenceResults.array()
    .then(ages => ages.map(tensor => tensor[0]));
}

export { postprocess }