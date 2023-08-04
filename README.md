# FORGEdb

https://doi.org/10.1101/2022.11.14.516365

https://forge2.altiusinstitute.org/


FORGEdb is an online tool designed to interpret genetic variants associated with diseases, focusing on variants found in genome-wide association studies (GWAS). Its purpose is to annotate the regulatory genome to identify relevant variants and target genes.

The platform provides integrated data on individual genetic variants, including associated regulatory elements, transcription factor binding sites, and target genes. This information is derived from a wide range of biological samples to present a thorough regulatory context of each variant at the cellular level. Data forms include Combined Annotation Dependent Depletion (CADD) scores, expression quantitative trait loci (eQTLs), activity-by-contact (ABC) interactions, and transcription factor (TF) motifs.

Notably, FORGEdb introduces a unique scoring system, the FORGEdb score. This score evaluates the functional importance of genetic variants, aiding researchers in prioritizing variants for functional validation. It uses extensive datasets, including those from ENCODE, Roadmap Epigenomics, and BLUEPRINT consortia. With FORGEdb, researchers can expedite their analysis of genetic loci, potentially accelerating discoveries in disease-associated genetic variants.


### Hosting FORGEdb

#### Prerequisites

Building
- git
- node.js

Hosting
- Any static file server


#### Instructions

##### Building and hosting the API
1. `git clone https://github.com/CBIIT/nci-webtools-dceg-forgedb.git`
2. Download source databases from https://forge2.altiusinstitute.org/?download
3. Navigate to the `database` folder and run `npm install`
4. Generate a list of rsids to import as a text file, with one rsid per line
5. Run the `import.js` script. For example: `node import.js --sources sources.json --input $PATH_TO_DATABASES_FOLDER --output $PATH_TO_OUTPUT_FOLDER --rsids $PATH_TO_RSIDS_FILE`. Note that you can specify arbitrary datasets in sources.json (for example, if you are creating modular builds with custom datasets).
6. Upload your output folder to any static file server, ensuring that the files are available under the `/api` path. For example, your `https://your_hostname/api/forge2tf/v1.0/schema.json` should work.

##### Building and hosting the API Client (Website)
1. `git clone https://github.com/CBIIT/nci-webtools-dceg-forgedb.git`
2. Navigate to the `client` folder and run `npm install && npm run build` to generate the `out` folder. If your api is served under a subpath (eg: `https://your_hostname/your_subpath/api/`), specify the subpath as `NEXT_PUBLIC_BASE_PATH` environment variable before building (eg: `export NEXT_PUBLIC_BASE_PATH=/your_subpath`).
3. Upload the `out` folder to your static file server, ensuring that you do not overwrite the contents of the `api` folder.
