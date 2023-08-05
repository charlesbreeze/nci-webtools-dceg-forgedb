

export const fetchBatch = (requests) => Promise.all(requests.map((request) => fetch(request).then((res) => res.json())));

export const getRowFilter = query => row => {
  query = (query.trim() || "").toLowerCase();
  return !query || Object.values(row).some((value) => String(value).toLowerCase().includes(query))
}

export function getForgeDbScore(data) {
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

  return Object.values(mapping).reduce((totalScore, { names, score }) => {
    if (data.some(({ name, table }) => names.includes(name) && table?.length > 0)) {
      return totalScore + score;
    }
    return totalScore;
  }, 0);
}