# FORGEdb Data Import

The import.js script generates FORGEdb `json` files given a list of rsids and the following datasets:

- [abc.db](https://forge2.altiusinstitute.org/files/abc.db)
- [cato.db](https://forge2.altiusinstitute.org/files/cato.db)
- [closest.refseq.gene.hg19.db](https://forge2.altiusinstitute.org/files/closest.refseq.gene.hg19.db)
- [eqtlgen.db](https://forge2.altiusinstitute.org/files/eqtlgen.db)
- [forge_2.0.db](https://forge2.altiusinstitute.org/files/forge_2.0.db)
- [forge2.tf.fimo.jaspar.1e-5.taipale.1e-5.taipaledimer.1e-5.uniprobe.1e-5.xfac.1e-5.db](https://forge2.altiusinstitute.org/files/forge2.tf.fimo.jaspar.1e-5.taipale.1e-5.taipaledimer.1e-5.uniprobe.1e-5.xfac.1e-5.db)
- [gtex.eqtl.db](https://forge2.altiusinstitute.org/files/gtex.eqtl.db)
- [whole_genome_SNVs.tsv.gz](https://krishna.gs.washington.edu/download/CADD/v1.6/GRCh37/whole_genome_SNVs.tsv.gz)
- [whole_genome_SNVs.tsv.gz.tbi](https://krishna.gs.washington.edu/download/CADD/v1.6/GRCh37/whole_genome_SNVs.tsv.gz.tbi)

Usage:

```sh
# Install dependencies
npm install

# Execute import.js to generate FORGEdb json files within the output folder
# - ./sources.json is a file containing dataset-query mappings (included)
# - ./input refers to the folder containing the datasets above
# - ./output refers to the folder where the json files should be generated
# - ./rsids.txt should contain a list of rsids (one per line)
node import.js \
  --sources ./sources.json \
  --input ./input \
  --output ./output \
  --rsids ./rsids.txt

# Alternatively, use GNU split/parallel for large batches
split -d -n l/32 rsids.txt rsids.txt.

parallel node import.js \
  --sources ./sources.json \
  --input ./input \
  --output ./output \
  --rsids {} ::: ./rsids.txt.*
```

After the FORGEdb `json` files have been generated, they can be imported into a document store or uploaded to object storage and served behind a CDN.

