"use client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function About() {
  return (
    <div className="flex-grow-1 bg-light py-4">
      <Container>
        <Row>
          <Col>
            <article>
              <h1 className="fs-1 fw-light">About FORGE<small className="fw-normal">db</small> <small className="fs-3 text-muted fw-normal">(Functional SNP)</small></h1>
              <hr />
              <h2 className="fs-2 fw-light mb-3">FORGEdb scores</h2>
              <p>FORGEdb scores are used for predicting which genetic variants are most likely to be a regulatory variant. FORGEdb scores range between 0 and 10, and are calculated using different regulatory DNA datasets, including data for transcription factor (TF) binding and chromatin accessibility.</p>
              <p>Specifically, FORGEdb scores are computed from the sum of the presence/absence of the following elements:</p>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Expression quantitative trait locus (eQTL)</td>
                    <td>2 points</td>
                  </tr>
                  <tr>
                    <td>Activity-by-contact (ABC) contacts</td>
                    <td>2 points</td>
                  </tr>
                  <tr>
                    <td>Transcription factor (TF) motifs</td>
                    <td>1 point</td>
                  </tr>
                  <tr>
                    <td>Contextual analysis of TF occupancy (CATO) score</td>
                    <td>1 point</td>
                  </tr>
                  <tr>
                    <td>DNase I hotspot</td>
                    <td>2 points</td>
                  </tr>
                  <tr>
                    <td>Histone mark ChIP-seq broadPeak</td>
                    <td>2 points</td>
                  </tr>
                </tbody>
              </table>
              <p>A FORGEdb score of 10 (the highest score) is computed from the presence of</p>
              <ul>
                <li>10 = eQTL + ABC + TF motif + CATO + DNase I hotspot + histone mark ChIP-seq</li>
              </ul>
              <p>A FORGEdb score of 9 (the second highest score) is computed from the presence of:</p>
              
              <ul>
                <li>9 = eQTL + ABC + TF motif + DNase I hotspot + histone mark ChIP-seq<br/>or</li>
                <li>9 = eQTL + ABC + CATO + DNase I hotspot + histone mark ChIP-seq</li>
              </ul>
              
              <p>A more in-depth explanation of specific scores is available <a href="https://youtu.be/1QhgKfSgLZc" target="_blank" rel="noopener noreferer">here</a> (with subtitles).</p>
              <p>To view a specific example of a SNP with a FORGEdb score of 9, the following figure highlights score details for rs1421085:</p>
              <p>Example FORGEdb results for rs1421085</p>
              <figure className="figure">
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/forgedb-example.png`} className="figure-img img-fluid" alt="Example FORGEdb results for rs1421085" />
                <figcaption className="figure-caption">
                  Figure 1: Example FORGEdb results for rs1421085. For this SNP, there is evidence for eQTL associations (with IRX3, shown to be a key target gene by Bell et al. and Smemo et al.), chromatin looping (ABC interactions), overlap with significant TF motifs, DNase I hotspot overlap, as well as overlap with histone mark broadPeaks. The only regulatory dataset that this SNP does not have
                  evidence for is for CATO score (1 point). The resulting FORGEdb score for rs1421085 is therefore 9 = 2 (eQTL) + 2 (ABC) + 1 (TF motif) + 2 (DNase I hotspot) + 2 (histone mark ChIP-seq). Independent experimental analyses by Claussnitzer et al. have demonstrated a regulatory role for this SNP in the regulation of white vs. beige adipocyte proliferation via IRX3/IRX5.
                </figcaption>
              </figure>

              <h2 className="fs-2 fw-light mb-3">References</h2>

              <ul>
                <li>Bell, C. G. et al. Integrated Genetic and Epigenetic Analysis Identifies Haplotype-Specific Methylation in the FTO Type 2 Diabetes and Obesity Susceptibility Locus. PLOS ONE 5, e14040 (2010). </li>
                <li>Claussnitzer, M. et al. FTO Obesity Variant Circuitry and Adipocyte Browning in Humans. N. Engl. J. Med. 373, 895-907 (2015). </li>
                <li>Smemo, S. et al. Obesity-associated variants within FTO form long-range functional connections with IRX3. Nature, (2014).</li>
              </ul>
            </article>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
