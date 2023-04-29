FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
 && dnf -y install \
    awscli \
    pigz \
    tar \
 && dnf clean all

COPY database/import-html.sh /bin/import-html.sh

RUN chmod +x /bin/import-html.sh

CMD /bin/import-html.sh