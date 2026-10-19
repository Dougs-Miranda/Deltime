export default function QuemSomos() {
  return (
    <section className="manifesto" id="quem-somos" aria-labelledby="quem-somos-title">
      <div className="shell manifesto-inner quem-somos-content">
        <p className="quem-somos-label">QUEM SOMOS</p>
        <h2 id="quem-somos-title">
          Menos apagar incêndio.
          <br />
          <em>Mais prevenir antes que aconteça.</em>
        </h2>
        <p className="quem-somos-description">
          Somos o time que cuida da sua tecnologia nos bastidores, pra você nunca descobrir um problema pelo cliente. Monitoramento ativo, resposta rápida e clareza em cada relatório.
        </p>
        <a className="button button-light quem-somos-cta" href="#processo">
          Conheça nosso jeito de trabalhar <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="orbit orbit-one" aria-hidden="true" />
      <div className="orbit orbit-two" aria-hidden="true" />
    </section>
  );
}
