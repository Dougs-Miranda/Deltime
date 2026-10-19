"use client";

import Image from "next/image";
import { FormEvent, KeyboardEvent, RefObject, useEffect, useRef, useState } from "react";
import QuemSomos from "@/src/components/QuemSomos";

// TODO: substituir pelo CNPJ real da Deltime
const CNPJ = "00.000.000/0001-00";

type TabKey = "rede" | "endpoints" | "backups";
type PanelStatus = "normal" | "atencao" | "critico";
type ChartPoint = { x: number; y: number };

const navigationItems = [
  { label: "Quem somos", href: "#quem-somos", description: "Conheça a Deltime e nosso jeito de trabalhar." },
  { label: "Serviços", href: "#solucoes", description: "Suporte de TI, infraestrutura e segurança." },
  { label: "Blog", href: "#blog", description: "Novidades e conteúdos de tecnologia da Deltime." },
  { label: "Parcerias", href: "#portfolio", description: "Conheça as empresas parceiras da Deltime." },
  { label: "Contato", href: "#diagnostico", description: "Fale com a equipe e solicite um diagnóstico." },
  { label: "Help Desk", href: "https://get.teamviewer.com/deltime", description: "Acesse o suporte remoto da Deltime." },
];

const tabsData: Record<TabKey, {
  label: string;
  value: string;
  devices: number;
  variation: string;
  status: PanelStatus;
  chartData: ChartPoint[];
  eventPoint?: ChartPoint;
}> = {
  rede: {
    label: "Saúde de rede",
    value: "99.98%",
    devices: 248,
    variation: "+12%",
    status: "normal",
    chartData: [{ x: 0, y: 142 }, { x: 53, y: 122 }, { x: 93, y: 135 }, { x: 141, y: 114 }, { x: 178, y: 100 }, { x: 221, y: 93 }, { x: 269, y: 72 }, { x: 309, y: 84 }, { x: 351, y: 98 }, { x: 391, y: 63 }, { x: 433, y: 42 }, { x: 470, y: 34 }],
    eventPoint: { x: 391, y: 63 },
  },
  endpoints: {
    label: "Saúde dos endpoints",
    value: "97.4%",
    devices: 248,
    variation: "+3%",
    status: "normal",
    chartData: [{ x: 0, y: 130 }, { x: 67, y: 117 }, { x: 126, y: 126 }, { x: 176, y: 116 }, { x: 230, y: 101 }, { x: 276, y: 96 }, { x: 325, y: 88 }, { x: 372, y: 77 }, { x: 424, y: 84 }, { x: 470, y: 57 }],
  },
  backups: {
    label: "Integridade dos backups",
    value: "100%",
    devices: 32,
    variation: "0%",
    status: "atencao",
    chartData: [{ x: 0, y: 132 }, { x: 66, y: 132 }, { x: 132, y: 132 }, { x: 198, y: 131 }, { x: 264, y: 131 }, { x: 330, y: 131 }, { x: 396, y: 131 }, { x: 470, y: 131 }],
  },
};

const statusData: Record<PanelStatus, { label: string; className: string }> = {
  normal: { label: "Operação normal", className: "!bg-[#efc94c]" },
  atencao: { label: "Atenção", className: "!bg-yellow-400" },
  critico: { label: "Instabilidade", className: "!bg-red-500" },
};

function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 900, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, value]);

  return <div ref={ref}>{prefix}{count}{suffix}</div>;
}

function LivePanel() {
  const [activeTab, setActiveTab] = useState<TabKey>("rede");
  const [isLoading, setIsLoading] = useState(false);
  const [isEventHovered, setIsEventHovered] = useState(false);
  const transitionTimer = useRef<number | null>(null);
  const panel = tabsData[activeTab];
  const status = statusData[panel.status];
  const variationValue = Number.parseFloat(panel.variation);
  const trend = variationValue < 0 ? "↓" : variationValue > 0 ? "↑" : "→";
  const trendClass = variationValue < 0 ? "text-yellow-400" : "text-[#efc94c]";
  const chartPoints = panel.chartData.map(({ x, y }) => `${x},${y}`).join(" ");

  function handleTabChange(tab: TabKey) {
    if (tab === activeTab || isLoading) return;
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    setIsLoading(true);
    setIsEventHovered(false);
    transitionTimer.current = window.setTimeout(() => {
      setActiveTab(tab);
      setIsLoading(false);
      transitionTimer.current = null;
    }, 400);
  }

  return (
    <section className="live-section shell" id="painel">
      <div className="section-heading"><p className="eyebrow"><span className="pulse" /> Painel ao vivo</p><h2>Veja o que a Deltime<br /><em>enxerga por você.</em></h2></div>
      <div className="live-window">
        <div className="window-chrome"><div className="window-controls" aria-hidden="true"><i /><i /><i /></div><span className="window-title">deltime / live operations</span><span className="window-status"><span className="animate-pulse" /> conectado</span></div>
        <div className="live-summary px-6 py-3 text-xs text-white/60">3 sistemas monitorados · 100% de cobertura</div>
        <div className="live-tabs" role="tablist" aria-label="Áreas monitoradas">{(Object.keys(tabsData) as TabKey[]).map((tab) => <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => handleTabChange(tab)} role="tab" aria-selected={activeTab === tab} disabled={isLoading}>{tab}</button>)}</div>
        <div className={`live-content transition-all duration-300 ${isLoading ? "opacity-50 blur-[2px]" : "opacity-100 blur-0"}`}><div><p className="monitor-top"><span className="live-dot" /> monitoramento contínuo <span className="monitor-time">atualizado agora</span></p><div className="live-title"><span>{panel.label}</span><strong>{panel.value} <span className={`live-trend ${trendClass}`} aria-label={`Variação ${panel.variation}`}>{trend}</span></strong></div><div className="live-chart"><div className="chart-grid" /><svg viewBox="0 0 470 190" role="img" aria-label={`Gráfico de ${panel.label.toLowerCase()}`}><polyline fill="none" stroke="var(--brand-yellow)" strokeWidth="3" points={chartPoints} />{activeTab === "rede" && panel.eventPoint && <circle cx={panel.eventPoint.x} cy={panel.eventPoint.y} r="5" fill="var(--brand-yellow)" tabIndex={0} role="button" aria-label="14:32 — pico identificado e mitigado" onMouseEnter={() => setIsEventHovered(true)} onMouseLeave={() => setIsEventHovered(false)} onFocus={() => setIsEventHovered(true)} onBlur={() => setIsEventHovered(false)}><title>14:32 — pico identificado e mitigado</title></circle>}</svg>{isEventHovered && panel.eventPoint && <span className="chart-event-tooltip absolute z-10 -translate-x-1/2 -translate-y-full rounded border border-white/10 bg-[#0a0a0a] px-2 py-1 text-[10px] text-white/80" style={{ left: `${(panel.eventPoint.x / 470) * 100}%`, top: `${(panel.eventPoint.y / 190) * 100}%` }}>14:32 — pico identificado e mitigado</span>}<span className="chart-label label-one">08:00</span><span className="chart-label label-two">12:00</span><span className="chart-label label-three">agora</span></div></div><div className="live-side"><small>status do ambiente</small><strong><span className={`live-dot ${status.className}`} /> {status.label}</strong><div className="live-side-stat"><span>dispositivos ativos</span><b>{panel.devices}</b></div><div className="live-side-stat"><span>variação hoje <small title="Comparação com o dia anterior">vs. dia anterior</small></span><b>{panel.variation}</b></div></div></div>
      </div>
    </section>
  );
}

const faqItems = [
  ["Qual o prazo de implantação?", "Após o diagnóstico inicial, apresentamos um plano e um cronograma sob medida. Em operações menores, os primeiros indicadores podem estar ativos em poucos dias."],
  ["Vocês trabalham com contrato mensal ou avulso?", "Os dois formatos existem. Podemos atuar em uma demanda pontual ou acompanhar sua operação continuamente, conforme a necessidade."],
  ["Qual é o SLA de resposta?", "Nosso tempo médio de primeira resposta é inferior a 15 minutos para ambientes monitorados. O SLA final é definido no plano contratado."],
  ["Existe atendimento fora do horário comercial?", "Sim. O monitoramento funciona 24/7 e os níveis de atendimento fora do horário são combinados de acordo com a criticidade da operação."],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return <section className="faq-section shell" id="faq"><div className="faq-heading"><p className="eyebrow">Dúvidas frequentes</p><h2>Clareza para<br /><em>decidir melhor.</em></h2></div><div className="faq-list">{faqItems.map(([question, answer], index) => <div className={`faq-item ${open === index ? "open" : ""}`} key={question}><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><span>{question}</span><b>{open === index ? "×" : "+"}</b></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></section>;
}

const partners = [
  { name: "Dell", logo: "/resources/Dell_Logo.png", description: "A Dell é uma das maiores empresas de tecnologia do mundo, reconhecida mundialmente pela fabricação, venda e suporte de computadores, notebooks, servidores, monitores e soluções de TI. Tornou-se pioneira no modelo de venda direta ao consumidor, permitindo a personalização dos computadores antes da compra." },
  { name: "Microsoft", logo: "/resources/Microsoft-Logo.png", description: "A Microsoft é uma das maiores fabricantes de soluções de tecnologia do mundo. Cerca de 90 mil pessoas trabalham em mais de 100 países, proporcionando não somente investimentos em tecnologia como também na ampliação do seu acesso." },
  { name: "Fortinet", logo: "/resources/Fortinet-Logo.png", description: "A Fortinet é um fornecedor mundial de appliances de segurança de rede e um líder de mercado no gerenciamento unificado de ameaças (UTM). Oferece proteção ampla, integrada e de alto desempenho contra ameaças de segurança dinâmica, simplificando a infraestrutura de segurança de TI." },
  { name: "Hylink", logo: "/resources/Hylink-azul.png", description: "A Hylink é uma integradora de TI brasileira, com sede em São Paulo, especializada em soluções B2B de infraestrutura, cloud, cibersegurança e conectividade. Ela atua como consultora estratégica (Trusted Advisor), oferecendo serviços gerenciados, suporte 24/7 (NOC/SOC) e IoT, visando à transformação digital e à continuidade de negócios de empresas." },
  { name: "iungo", logo: "/resources/iungo.png", description: "A iungo é uma operadora licenciada pela Anatel, especializada em comunicação empresarial com foco em PABX virtual e atendimento multicanal." },
  { name: "Net2phone", logo: "/resources/net2phone.png", description: "A Net2phone é um dos líderes em comunicação na nuvem para seu negócio. PABX na nuvem, software de contact center, SIP Trunk, VoIP e muito mais." },
  { name: "Lenovo", logo: "/resources/lenovo.png", description: "A história da Lenovo sempre esteve associada ao desenvolvimento da inteligência informática para criar um mundo melhor. Com o maior portfólio do mundo de produtos tecnológicos, concretizamos a nossa visão de “Tecnologia mais inteligente para todos”." },
  { name: "SAP", logo: "/resources/sap.png", description: "Como líder global em aplicações e IA empresariais, a SAP ajuda empresas de todos os portes e setores a atingirem o seu máximo desempenho. A seguir, mostramos como você pode otimizar suas operações, tomar decisões mais inteligentes e alcançar seus objetivos." },
  { name: "AWS", logo: "/resources/aws.png", description: "A Amazon Web Services oferece serviços de computação em nuvem confiáveis, escaláveis e acessíveis. A inscrição é gratuita, você paga apenas pelo que usar." },
];

function Portfolio() {
  const partnersRef = useRef<HTMLDivElement>(null);

  function scrollPartners(direction: -1 | 1) {
    if (!partnersRef.current) return;
    partnersRef.current.scrollBy({ left: direction * partnersRef.current.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section className="portfolio-section shell" id="portfolio" aria-labelledby="partners-title">
      <div className="partners-heading">
        <div className="section-heading">
          <p className="eyebrow">Parcerias</p>
          <h2 id="partners-title">Parcerias que fazem<br /><em>a tecnologia avançar.</em></h2>
        </div>
        <div className="partners-controls" aria-label="Controles dos parceiros">
          <button type="button" onClick={() => scrollPartners(-1)} aria-label="Ver parceiros anteriores">←</button>
          <button type="button" onClick={() => scrollPartners(1)} aria-label="Ver próximos parceiros">→</button>
        </div>
      </div>
      <div className="partner-carousel" ref={partnersRef} role="region" aria-label="Parceiros da Deltime" tabIndex={0}>
        {partners.map((partner) => (
          <article className="partner-card" key={partner.name}>
            <div className="partner-logo">
              <Image
                className={partner.name === "AWS" ? "partner-logo-image-aws" : undefined}
                src={partner.logo}
                alt={`Logo ${partner.name}`}
                width={240}
                height={100}
              />
            </div>
            <div className="partner-card-content">
              <h3>{partner.name}</h3>
              <p>{partner.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatContactValue(value: string) {
  if (value.includes("@") || /[a-z]/i.test(value)) return value;
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function Home() {
  type FormStatus = "idle" | "loading" | "success" | "error";
  type FormErrors = Partial<Record<"company" | "contact" | "devices" | "pain", string>>;
  const painOptions = ["Quedas de rede", "Backup inseguro", "Sem visibilidade", "Outro"];
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [selectedPain, setSelectedPain] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [devices, setDevices] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const companyInputRef = useRef<HTMLInputElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const devicesInputRef = useRef<HTMLInputElement>(null);
  const filledFields = [company.trim(), contact.trim(), devices.trim(), selectedPain].filter(Boolean).length;
  const searchResults = navigationItems.filter(({ label, description }) =>
    `${label} ${description}`.toLocaleLowerCase("pt-BR").includes(searchQuery.trim().toLocaleLowerCase("pt-BR")),
  );

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));

    return () => {
      window.cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  function focusNextField(event: KeyboardEvent<HTMLInputElement>, nextField: RefObject<HTMLInputElement | null>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    nextField.current?.focus();
  }

  function handleSupportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!company.trim()) nextErrors.company = "Preencha este campo";
    if (!contact.trim()) nextErrors.contact = "Preencha este campo";
    if (!devices.trim()) nextErrors.devices = "Preencha este campo";
    if (!selectedPain) nextErrors.pain = "Selecione uma opção";

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      setFormStatus("error");
      return;
    }

    setFormErrors({});
    setFormStatus("loading");
    window.setTimeout(() => setFormStatus("success"), 900);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstResult = searchResults[0];
    if (!firstResult) return;
    if (firstResult.href.startsWith("https://")) {
      window.open(firstResult.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(firstResult.href);
    }
    setIsSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <main>
      <div className="site-nav-slot"><nav className="site-nav shell" aria-label="Navegação principal">
        <a className="brand" href="#top" aria-label="Deltime início">
          <Image className="brand-logo" src="/brand/deltime-logo.png" alt="Deltime" width={749} height={212} sizes="138px" />
        </a>
        <div className={`nav-links ${isMenuOpen ? "nav-links-open" : ""}`} id="primary-navigation">
          {navigationItems.map((item) => (
            <a className={item.href === "#blog" ? "nav-blog-link" : ""} href={item.href} key={item.href} target={item.href.startsWith("https://") ? "_blank" : undefined} rel={item.href.startsWith("https://") ? "noreferrer" : undefined} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="nav-mobile-toggle" type="button" aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={isMenuOpen} aria-controls="primary-navigation" onClick={() => setIsMenuOpen((open) => !open)}>
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
          <button className="nav-search-toggle" type="button" aria-label={isSearchOpen ? "Fechar busca" : "Buscar no site"} aria-expanded={isSearchOpen} aria-controls="site-search" onClick={() => { setIsSearchOpen((open) => !open); setIsMenuOpen(false); }}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.2 4.2" /></svg>
          </button>
        </div>
        {isSearchOpen && (
          <div className="nav-search-panel" id="site-search">
            <form role="search" onSubmit={handleSearchSubmit}>
              <label className="sr-only" htmlFor="site-search-input">Buscar no site</label>
              <div className="nav-search-field">
                <input id="site-search-input" type="search" autoFocus placeholder="O que você procura?" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
                <button type="submit" aria-label="Ir para o primeiro resultado" disabled={searchResults.length === 0}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.2 4.2" /></svg>
                </button>
              </div>
              <p className="nav-search-label">{searchQuery.trim() ? `${searchResults.length} resultado${searchResults.length === 1 ? "" : "s"}` : "Explore o site"}</p>
              {searchResults.length > 0 ? (
                <ul className="nav-search-results">
                  {searchResults.map(({ label, href, description }) => (
                    <li key={href}>
                      <a href={href} target={href.startsWith("https://") ? "_blank" : undefined} rel={href.startsWith("https://") ? "noreferrer" : undefined} onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}>
                        <span>{label}</span>
                        <small>{description}</small>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : <p className="nav-search-empty">Nenhum resultado. Tente outro termo.</p>}
            </form>
          </div>
        )}
      </nav></div>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> Tecnologia que não para</p>
          <h1>Seu negócio em movimento.<br /><em>Sem imprevistos.</em></h1>
          <p className="hero-description">A Deltime cuida da sua tecnologia para você focar no que realmente importa: fazer o seu negócio crescer.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#diagnostico">Quero proteger minha operação <span>↗</span></a>
            <a className="text-link" href="#solucoes">Conheça nossas soluções <span>↓</span></a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Indicadores da operação Deltime">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <svg className="hero-network" viewBox="0 0 520 440" aria-hidden="true">
            <g className="hero-pentagon" fill="none" stroke="rgba(239,201,76,.22)" strokeWidth="1">
              <polygon points="260,34 456,176 381,406 139,406 64,176" />
              <polygon points="260,96 388,189 339,340 181,340 132,189" stroke="rgba(239,201,76,.12)" />
              <path d="M260 34v62M456 176l-68 13M381 406l-42-66M139 406l42-66M64 176l68 13M260 96v244M132 189l128 151M388 189 260 340" stroke="rgba(239,201,76,.14)" />
            </g>
            <g className="hero-network-active" fill="#efc94c"><circle cx="260" cy="34" r="5" /><circle cx="456" cy="176" r="4" /><circle cx="139" cy="406" r="5" /></g>
            <g fill="rgba(255,255,255,.65)"><circle cx="260" cy="96" r="3" /><circle cx="388" cy="189" r="3" /><circle cx="339" cy="340" r="3" /><circle cx="181" cy="340" r="3" /><circle cx="132" cy="189" r="3" /></g>
          </svg>
          <div className="hero-metrics">
            <div className="hero-metric"><strong>99.9%</strong><span>uptime médio</span></div>
            <div className="hero-metric"><strong>&lt; 15min</strong><span>tempo médio de resposta</span></div>
            <div className="hero-metric"><strong>200+</strong><span>dispositivos monitorados</span></div>
          </div>
        </div>
      </section>

      <section className="differences-bar"><div className="shell differences-inner"><p className="eyebrow difference-kicker"><span className="pulse" /> Por que a Deltime</p><div className="difference-grid">
        <article className="difference-card"><span className="difference-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg></span><strong><CountUp value={24} suffix="/7" /></strong><p>Monitoramento contínuo da sua operação.</p></article>
        <article className="difference-card"><span className="difference-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" /><circle cx="12" cy="12" r="8" /></svg></span><strong><CountUp value={15} prefix="&lt; " suffix=" min" /></strong><p>Tempo médio de primeira resposta.</p></article>
        <article className="difference-card"><span className="difference-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-2v-6h4M4 12v5a2 2 0 0 0 2 2h2v-6H4" /></svg></span><strong>Direto ao ponto</strong><p>Sem central de triagem: fala com quem resolve.</p></article>
        <article className="difference-card"><span className="difference-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s7-3.5 7-9V5l-7-2-7 2v7c0 5.5 7 9 7 9Z" /><path d="m9 12 2 2 4-4" /></svg></span><strong>100% remoto</strong><p>Suporte ágil sem depender de visita técnica.</p></article>
      </div></div></section>

      <QuemSomos />

      <section className="solutions shell" id="solucoes">
        <div className="section-heading"><p className="eyebrow">O que fazemos</p><h2>Tecnologia trabalhando<br /><em>a favor do seu negócio.</em></h2></div>
        <div className="solution-grid">
          <article className="solution-card featured"><span className="card-number">01 / 04</span><div className="service-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 13a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-7h4M4 13v4a2 2 0 0 0 2 2h2v-7H4" /><path d="M12 19v2h3" /></svg></div><h3>Suporte que<br />resolve.</h3><p>Atendimento ágil e humano para o seu time nunca ficar parado.</p><a href="#diagnostico" aria-label="Saiba mais sobre suporte que resolve">↗</a></article>
          <article className="solution-card"><span className="card-number">02 / 04</span><div className="service-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="6" rx="1" /><rect x="4" y="14" width="16" height="6" rx="1" /><path d="M8 7h.01M8 17h.01M12 10v4" /></svg></div><h3>Infraestrutura<br />inteligente.</h3><p>Ambientes seguros, organizados e prontos para escalar.</p><a href="#diagnostico" aria-label="Saiba mais sobre infraestrutura inteligente">↗</a></article>
          <article className="solution-card"><span className="card-number">03 / 04</span><div className="service-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s7-3.5 7-9V5l-7-2-7 2v7c0 5.5 7 9 7 9Z" /><path d="m9 12 2 2 4-4" /></svg></div><h3>Segurança<br />sem brechas.</h3><p>Proteção contínua para os seus dados e sua reputação.</p><a href="#diagnostico" aria-label="Saiba mais sobre segurança sem brechas">↗</a></article>
          <article className="solution-card"><span className="card-number">04 / 04</span><div className="service-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 18V6M4 18h16" /><path d="m7 15 4-4 3 2 5-6" /><path d="M16 7h3v3" /></svg></div><h3>Estratégia para<br />avançar.</h3><p>Decisões melhores através de tecnologia que faz sentido.</p><a href="#diagnostico" aria-label="Saiba mais sobre estratégia para avançar">↗</a></article>
        </div>
      </section>

      <section className="process-section shell" id="processo"><div className="section-heading"><p className="eyebrow">Como funciona</p><h2>Da incerteza à<br /><em>operação protegida.</em></h2></div><div className="process-grid">
        <article className="process-step"><span className="process-number">01</span><span className="process-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4M8 10.5h5M10.5 8v5" /></svg></span><h3>Diagnóstico</h3><p>Mapeamos sua infraestrutura atual e os pontos de risco.</p></article>
        <article className="process-step"><span className="process-number">02</span><span className="process-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z" /><path d="M15 3v4h3M9 12h6M9 16h4" /></svg></span><h3>Plano de ação</h3><p>Proposta técnica sob medida, sem pacote engessado.</p></article>
        <article className="process-step"><span className="process-number">03</span><span className="process-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 13 7-9 7 9-7-3-7 3Z" /><path d="M12 11v9M8 20h8" /></svg></span><h3>Implantação</h3><p>Monitoramento e ferramentas ativas sem parar sua operação.</p></article>
        <article className="process-step"><span className="process-number">04</span><span className="process-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7" /><path d="M4 5v5h5M12 8v4l3 2" /></svg></span><h3>Acompanhamento</h3><p>Relatórios periódicos e ajuste contínuo para evoluir.</p></article>
      </div></section>

      <LivePanel />

      <Faq />

      <section className="brand-info-section shell" id="blog">
        <div className="brand-info-card brand-info-card-accent">
          <p className="eyebrow">Blog Deltime</p>
          <h2>Ideias para manter<br /><em>seu negócio em movimento.</em></h2>
          <p>Estamos preparando conteúdos sobre tecnologia, segurança e gestão de TI.</p>
          <span className="coming-soon">Novos conteúdos em breve</span>
        </div>
      </section>

      <Portfolio />

      <section className="support shell" id="diagnostico">
        <div className="support-intro"><p className="eyebrow">Diagnóstico gratuito</p><h2>Comece pela<br /><em>visibilidade.</em></h2><p>Responda algumas perguntas rápidas. Em breve entraremos em contato com um diagnóstico inicial da sua operação.</p></div>
        <div className="support-form-wrap">{formStatus === "success" ? <div className="support-confirmation" role="status"><span aria-hidden="true">✓</span><p>Recebemos sua solicitação! Em breve entraremos em contato com um diagnóstico inicial.</p></div> : <form className="support-form" onSubmit={handleSupportSubmit} noValidate>
          <label>Nome da empresa<input ref={companyInputRef} className={formErrors.company ? "field-error border-red-400" : ""} name="company" type="text" placeholder="Como sua empresa se chama?" value={company} onChange={(event) => { setCompany(event.target.value); setFormErrors((current) => ({ ...current, company: undefined })); }} onKeyDown={(event) => focusNextField(event, contactInputRef)} aria-invalid={Boolean(formErrors.company)} />{formErrors.company && <small className="field-message">{formErrors.company}</small>}</label>
          <label>E-mail ou WhatsApp<input ref={contactInputRef} className={formErrors.contact ? "field-error border-red-400" : ""} name="contact" type="text" inputMode="email" placeholder="Para enviarmos seu diagnóstico" value={contact} onChange={(event) => { setContact(formatContactValue(event.target.value)); setFormErrors((current) => ({ ...current, contact: undefined })); }} onKeyDown={(event) => focusNextField(event, devicesInputRef)} aria-invalid={Boolean(formErrors.contact)} />{formErrors.contact && <small className="field-message">{formErrors.contact}</small>}</label>
          <label>Quantidade de dispositivos<input ref={devicesInputRef} className={formErrors.devices ? "field-error border-red-400" : ""} name="devices" type="number" min="1" placeholder="Ex.: 45" value={devices} onChange={(event) => { setDevices(event.target.value); setFormErrors((current) => ({ ...current, devices: undefined })); }} aria-invalid={Boolean(formErrors.devices)} />{formErrors.devices && <small className="field-message">{formErrors.devices}</small>}</label>
          <fieldset className={`support-pain-field ${formErrors.pain ? "field-error" : ""}`}><legend>Maior dor atual</legend><div className="pain-chips">{painOptions.map((pain) => <button className={selectedPain === pain ? "pain-chip active" : "pain-chip"} key={pain} type="button" onClick={() => { setSelectedPain(pain); setFormErrors((current) => ({ ...current, pain: undefined })); }} aria-pressed={selectedPain === pain}>{pain}</button>)}</div>{formErrors.pain && <small className="field-message">{formErrors.pain}</small>}</fieldset>
          <p className="form-progress">{filledFields} de 4 preenchidos</p>
          <button className="button button-dark form-submit" type="submit" disabled={formStatus === "loading"}>{formStatus === "loading" ? <>Enviando... <svg className="animate-spin" viewBox="0 0 24 24" aria-label="Enviando"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="2" /><path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2" /></svg></> : <>Solicitar diagnóstico <span>↗</span></>}</button>
          <p className="form-note">Sem compromisso · resposta em até 1 dia útil</p>
          <p className="privacy-note"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>Seus dados não serão compartilhados</p>
        </form>}<div className="support-preview rounded-lg border border-white/10 bg-white/5 p-4"><p>O que você recebe</p><ul><li><span>✓</span> Pontos de risco identificados na sua operação</li><li><span>✓</span> Tempo médio de resposta atual da sua infraestrutura</li><li><span>✓</span> Recomendações prioritárias de ação</li></ul></div></div>
      </section>

      <section className="help-desk-section shell">
        <div>
          <p className="eyebrow">Help Desk</p>
          <h2>Precisa de<br /><em>suporte?</em></h2>
          <p>Fale diretamente com a equipe da Deltime pelo canal de atendimento.</p>
        </div>
        <a className="button button-dark" href="https://get.teamviewer.com/deltime" target="_blank" rel="noreferrer">
          Falar com o suporte <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="footer-wrap"><div className="shell footer"><div className="footer-brand"><a className="brand" href="#top"><Image className="brand-logo" src="/brand/deltime-logo.png" alt="Deltime" width={749} height={212} sizes="138px" /><span className="sr-only">Deltime</span></a><p>Tecnologia que mantém sua empresa em movimento.</p><div className="footer-socials"><a className="footer-social-link text-white/50 transition hover:text-[#efc94c]" href="#" aria-label="LinkedIn">{/* TODO: adicionar link real */}<svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5v9M6.5 5.5v.01M10.5 8.5v9m0-5a4 4 0 0 1 8 0v5m-8-9a4 4 0 0 1 8 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg></a><a className="footer-social-link text-white/50 transition hover:text-[#efc94c]" href="#" aria-label="Instagram">{/* TODO: adicionar link real */}<svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg></a></div></div><div className="footer-column"><small>Empresa</small><a className="transition hover:opacity-70" href="#quem-somos">A Deltime</a><a className="transition hover:opacity-70" href="#processo">Como funciona</a><a className="transition hover:opacity-70" href="#faq">Perguntas frequentes</a></div><div className="footer-column"><small>Contato</small><a className="transition hover:opacity-70" href="mailto:contato@deltime.com.br">contato@deltime.com.br</a><a className="transition hover:opacity-70" href="https://wa.me/5511958841805">WhatsApp</a><span>CNPJ: {CNPJ}</span></div><div className="footer-column"><small>Mais</small><a className="transition hover:opacity-70" href="#">Blog</a><a className="transition hover:opacity-70" href="#">Política de privacidade</a><a className="transition hover:opacity-70" href="#">LGPD</a></div></div><div className="shell footer-bottom"><span>© 2025 Deltime Tecnologia</span><span>Feito para manter você em movimento.</span></div></footer>
    </main>
  );
}
