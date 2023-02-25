FROM public.ecr.aws/amazonlinux/amazonlinux:2022

RUN dnf -y update \
 && dnf -y install \
    gcc-c++ \
    make \
    nodejs \
    npm \
    parallel \
 && dnf clean all

ENV FORGEDB_FOLDER=/opt/forgedb

RUN mkdir -p ${FORGEDB_FOLDER}

WORKDIR ${FORGEDB_FOLDER}

COPY database/package*.json ${FORGEDB_FOLDER}

RUN npm install

COPY database ${FORGEDB_FOLDER}

RUN chmod +x import.sh

CMD import.sh