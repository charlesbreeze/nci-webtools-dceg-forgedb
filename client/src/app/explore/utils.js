

export function fetchBatch(requests) {
  return Promise.all(requests.map(async (request) => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }));
}

export function getRowFilter(query, schema) {
  return (row) => {
    query = (query.trim() || "").toLowerCase();
    return !query || 
      schema.columns.some(({ defaultValue }) => defaultValue?.toLowerCase().includes(query)) ||
      Object.values(row).some((value) => String(value).toLowerCase().includes(query));
  }
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

