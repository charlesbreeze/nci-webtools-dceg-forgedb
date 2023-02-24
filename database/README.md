# FORGEdb Data Import

The import.js script generates FORGEdb `json` files given a list of rsids. 

The following datasets are required:

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
# Install dependencies if needed
npm install

# Execute import.js to generate FORGEdb json files within the output folder
node import.js \
  --sources ./sources.json \
  --inputPath ./input \
  --outputPath ./output \
  --rsids ./rsids.txt

# Alternatively, use GNU split/parallel for large batches
split -l 1000000 rsids.txt rsids.txt.

parallel node import.js \
  --sources ./sources.json \
  --inputPath ./input \
  --outputPath ./output \
  --rsids {} ::: ./rsids.txt.*
```