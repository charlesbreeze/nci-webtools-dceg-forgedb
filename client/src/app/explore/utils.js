

export const fetchBatch = (requests) => Promise.all(requests.map((request) => fetch(request).then((res) => res.json())));


export function getForgeDbScore(data) {
  let score = 0;
  const mapping = {
    eqtl: { 
      names: ["eqtlgen", "gtex"],
      score: 2
    },
    abc: {
      names: ["abc"],
      score: 2
    },
    forge2tf: {
      names: ["forge2tf"],
      score: 1
    },
    cato: {
      names: ["cato"],
      score: 1
    },
    forge2DNase: {
      names: ["forge2.erc2-DHS", "forge2.erc", "forge2.encode", "forge2.blueprint"],
      score: 2
    },
    forge2H3: {
      names: ["forge2.erc2-H3-all"],
      score: 2
    }
  }

  // for each mapping, check if any of the datasets are present and have data
  for (const { names, score: mappingScore } of Object.values(mapping)) {
    if (data.some(({ name, table }) => names.includes(name) && table?.length > 0)) {
      score += mappingScore;
    }
  }

  return score;
}