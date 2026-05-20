import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  LayoutDashboard, 
  Code2, 
  Database, 
  Cpu, 
  Mail, 
  ChevronRight,
  Menu,
  X,
  Phone,
  Wand2,
  ArrowLeft,
  CheckCircle2,
  Copy
} from 'lucide-react';

// --- Dados da Árvore de Decisão do Modal ---
const wizardTree = {
  root: {
    title: "O que vamos construir hoje?",
    options: [
      { label: "SITE", icon: <LayoutDashboard className="mb-2 text-cyan-400" size={32}/>, next: "site_tipo" },
      { label: "SISTEMA WEB", icon: <Database className="mb-2 text-fuchsia-400" size={32}/>, next: "prog_tipo" },
      { label: "JOGO", icon: <Terminal className="mb-2 text-yellow-400" size={32}/>, next: "jogo_tipo" },
      { label: "INDUSTRIAL", icon: <Cpu className="mb-2 text-green-400" size={32}/>, next: "ind_tipo" },
      { label: "DESENVOLVIMENTO", icon: <Code2 className="mb-2 text-blue-400" size={32}/>, next: "dev_tipo" }
    ]
  },
  site_tipo: {
    title: "Qual a finalidade principal do site?",
    options: [
      { label: "Pessoal / Portfólio", next: "site_pessoal_estilo" },
      { label: "Profissional / Empresa", next: "site_prof_estilo" },
      { label: "Vendas (E-commerce / Landing Page)", next: "site_vendas_estilo" },
      { label: "Interativo / App Web", next: "site_prof_estilo" }
    ]
  },
  site_pessoal_estilo: {
    title: "Qual estilo visual mais combina?",
    options: [
      { label: "Intimista / Minimalista", next: "site_objetivo" },
      { label: "Retrô / Pixel Art", next: "site_objetivo" },
      { label: "Moderno / Dark Mode Neon", next: "site_objetivo" }
    ]
  },
  site_prof_estilo: {
    title: "Qual a pegada do design?",
    options: [
      { label: "Sério e Corporativo", next: "site_objetivo" },
      { label: "Inovador e Tecnológico", next: "site_objetivo" },
      { label: "Limpo e Direto", next: "site_objetivo" }
    ]
  },
  site_vendas_estilo: {
    title: "O que você está vendendo?",
    options: [
      { label: "Serviços Exclusivos", next: "site_objetivo" },
      { label: "Produtos Físicos", next: "site_objetivo" },
      { label: "Infoprodutos / Cursos", next: "site_objetivo" }
    ]
  },
  site_objetivo: {
    title: "Qual o objetivo de ouro deste projeto?",
    options: [
      { label: "Mostrar meus serviços e atrair clientes", next: "final" },
      { label: "Receber contatos e orçamentos via WhatsApp", next: "final" },
      { label: "Aumentar autoridade e credibilidade online", next: "final" }
    ]
  },
  ind_tipo: {
    title: "Qual a solução industrial necessária?",
    options: [
      { label: "Dashboard Analítico", next: "ind_dash_foco" },
      { label: "Gestão e Auditoria", next: "ind_dash_foco" },
      { label: "Automação de Processos", next: "ind_dash_foco" }
    ]
  },
  ind_dash_foco: {
    title: "O que será o foco principal?",
    options: [
      { label: "Acompanhamento de Produção / OEE", next: "ind_publico" },
      { label: "Controle de Qualidade", next: "ind_publico" },
      { label: "Mapeamento de Gargalos Logísticos", next: "ind_publico" }
    ]
  },
  ind_publico: {
    title: "Para quem a ferramenta será difundida?",
    options: [
      { label: "Operadores e Chão de Fábrica", next: "final" },
      { label: "Gestores e Supervisores", next: "final" },
      { label: "Diretoria e C-Level", next: "final" }
    ]
  },
  prog_tipo: {
    title: "Qual o foco do Sistema?",
    options: [
      { label: "Gestão Interna (ERP/CRM)", next: "prog_func" },
      { label: "Atendimento ao Cliente", next: "prog_func" },
      { label: "Controle Financeiro / Estoque", next: "prog_func" }
    ]
  },
  prog_func: {
    title: "Qual funcionalidade é indispensável?",
    options: [
      { label: "Geração de Relatórios e Gráficos", next: "prog_publico" },
      { label: "Integração com APIs externas", next: "prog_publico" },
      { label: "Controle de Permissões de Usuários", next: "prog_publico" }
    ]
  },
  prog_publico: {
    title: "Onde o sistema será mais utilizado?",
    options: [
      { label: "Apenas Internamente pela equipe", next: "final" },
      { label: "Por clientes e parceiros externos", next: "final" }
    ]
  },
  jogo_tipo: {
    title: "Qual o estilo do jogo?",
    options: [
      { label: "Puzzle / Raciocínio", next: "jogo_plat" },
      { label: "Ação / Arcade Clássico", next: "jogo_plat" },
      { label: "Jogo Educativo / Treinamento", next: "jogo_plat" }
    ]
  },
  jogo_plat: {
    title: "Onde ele deve rodar de forma nativa?",
    options: [
      { label: "Foco 100% no Navegador Web", next: "jogo_obj" },
      { label: "Foco em Dispositivos Móveis (Touch)", next: "jogo_obj" }
    ]
  },
  jogo_obj: {
    title: "Qual o objetivo da criação do jogo?",
    options: [
      { label: "Entretenimento de usuários", next: "final" },
      { label: "Ação de Marketing / Gamificação", next: "final" }
    ]
  },
  dev_tipo: {
    title: "O que precisamos desenvolver na base?",
    options: [
      { label: "Arquitetura e Banco de Dados", next: "dev_foco" },
      { label: "APIs e Integrações", next: "dev_foco" },
      { label: "Refatoração de código legado", next: "dev_foco" }
    ]
  },
  dev_foco: {
    title: "Qual o principal pilar técnico esperado?",
    options: [
      { label: "Escalabilidade extrema", next: "dev_obj" },
      { label: "Segurança de dados", next: "dev_obj" },
      { label: "Velocidade de processamento", next: "dev_obj" }
    ]
  },
  dev_obj: {
    title: "Qual é o prazo estimado para implantação?",
    options: [
      { label: "Rápido (MVP em semanas)", next: "final" },
      { label: "Longo prazo (Estrutura Robusta)", next: "final" }
    ]
  }
};

const generateBriefing = (selections, userName) => {
  const [categoria, subcategoria, detalhe1, detalhe2] = selections;
  const intro = `Olá, me chamo ${userName}! Minha ideia de projeto é a seguinte:\n\n`;
  
  if (categoria === "SITE") {
    return intro + `O projeto ideal levantado é um SITE do tipo ${subcategoria.toUpperCase()}. O visual exigido deve ser focado em um design ${detalhe1.toUpperCase()}, criando uma atmosfera perfeita para atingir o objetivo principal que é: ${detalhe2}. O foco total do desenvolvimento será em apresentar clareza, velocidade e converter visitantes em leads efetivos.`;
  }
  
  if (categoria === "INDUSTRIAL") {
    return intro + `A solução demandada é do setor INDUSTRIAL, caracterizando-se por ser um ${subcategoria.toUpperCase()}. A engenharia de dados do sistema será calibrada com foco primordial em ${detalhe1.toUpperCase()}, e as interfaces serão otimizadas para serem difundidas e operadas facilmente por ${detalhe2.toUpperCase()}. O objetivo é transformar gargalos produtivos em dados visíveis.`;
  }

  if (categoria === "SISTEMA WEB") {
    return intro + `O escopo define a criação de um SISTEMA WEB voltado para ${subcategoria.toUpperCase()}. Como requisito essencial, o software deve garantir ${detalhe1.toUpperCase()}, rodando de forma fluida e segura para o uso focado em ${detalhe2.toUpperCase()}. A prioridade será otimizar as rotinas de gestão e dados.`;
  }

  if (categoria === "JOGO") {
    return intro + `O desafio criativo é desenvolver um JOGO no gênero de ${subcategoria.toUpperCase()}. Ele precisa ser programado e otimizado para ${detalhe1.toUpperCase()}, visando prioritariamente o cenário de ${detalhe2.toUpperCase()}. O pilar principal será a física responsiva, mecânica fluida e interatividade do usuário.`;
  }

  if (categoria === "DESENVOLVIMENTO") {
    return intro + `O projeto de DESENVOLVIMENTO foca pesado em infraestrutura, mais especificamente em ${subcategoria.toUpperCase()}. A arquitetura será montada tendo como pilar técnico primário a ${detalhe1.toUpperCase()}, para suportar o roadmap do cliente que exige um horizonte de implantação do tipo ${detalhe2.toUpperCase()}.`;
  }

  return intro + `O projeto mapeado é focado em ${categoria}, do tipo ${subcategoria}. Os requisitos destacam a importância de ${detalhe1} e como objetivo fundamental: ${detalhe2}.`;
};

// --- Custom Hooks & Animações ---

// Animação de Foco/Desfoque baseada no centro da tela (Ajustada)
const FocusSection = ({ children, className = "" }) => {
  const domRef = useRef();

  useEffect(() => {
    let ticking = false;

    const updateFocus = () => {
      if (!domRef.current) return;
      const rect = domRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const elementCenter = rect.top + rect.height / 2;
      const screenCenter = windowHeight / 2;
      
      const distance = Math.abs(screenCenter - elementCenter);
      
      // Ampliada a Zona Segura (35% da tela focado)
      const focusZone = windowHeight * 0.35; 
      
      let blurValue = 0;
      let opacityValue = 1;
      let scaleValue = 1;

      if (distance > focusZone) {
        const overDistance = distance - focusZone;
        // Transição muito mais longa e suave
        const maxBlurDistance = windowHeight * 0.5; 
        
        const progress = Math.min(1, overDistance / maxBlurDistance);
        
        // Intensidade do Blur reduzida pela metade (Max 6px)
        blurValue = progress * 6; 
        // Opacidade mínima aumentada para 60%
        opacityValue = 1 - (progress * 0.4); 
        // Escala reduzida quase nada
        scaleValue = 1 - (progress * 0.02); 
      }

      domRef.current.style.filter = `blur(${blurValue}px)`;
      domRef.current.style.opacity = opacityValue.toFixed(2);
      domRef.current.style.transform = `scale(${scaleValue.toFixed(3)})`;
      
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateFocus);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(() => window.requestAnimationFrame(updateFocus), 50);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={domRef} className={`will-change-[filter,opacity,transform] ${className}`}>
      {children}
    </div>
  );
};

// Componente da Logo com Animação de Digitação
const TypingLogo = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "Dev.Pro";

  useEffect(() => {
    let timer;
    
    if (!isDeleting && text === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 4000);
    } else if (isDeleting && text === "") {
      timer = setTimeout(() => setIsDeleting(false), 1500);
    } else {
      const speed = isDeleting ? 120 : 240 + Math.random() * 100;
      timer = setTimeout(() => {
        setText(prev => 
          isDeleting 
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting]);

  const renderText = () => {
    if (text.includes('.')) {
      const parts = text.split('.');
      return <>{parts[0]}<span className="text-fuchsia-500">.</span>{parts[1]}</>;
    }
    return <>{text}</>;
  };

  return (
    <a href="#home" className="text-2xl font-bold text-white tracking-tighter flex items-center gap-2 group z-50">
      <span className="flex items-center font-mono">
        <span className="text-cyan-400 mr-2 group-hover:text-fuchsia-500 transition-colors">{'>_'}</span>
        <span className="inline-block min-w-[85px] border-r-[3px] border-cyan-400 animate-[pulse_1s_infinite] pr-1 whitespace-nowrap font-sans">
          {renderText()}
        </span>
      </span>
    </a>
  );
};

// Efeito Laser Ampliado
const LaserDivider = () => {
  const containerRef = useRef(null);
  const bandsRef = useRef([]);

  const laserBands = [
    { height: 150, color: 'bg-gradient-to-r from-cyan-900/10 via-fuchsia-900/20 to-cyan-900/10', speed: 0.1, blur: 'blur-[40px]', top: '50%' },
    { height: 90, color: 'bg-gradient-to-r from-cyan-600/20 via-fuchsia-500/20 to-cyan-600/20', speed: 0.25, blur: 'blur-3xl', top: '48%' },
    { height: 60, color: 'bg-gradient-to-r from-fuchsia-500/30 via-cyan-400/40 to-fuchsia-500/30', speed: 0.4, blur: 'blur-2xl', top: '55%' },
    { height: 35, color: 'bg-gradient-to-r from-cyan-400/50 via-fuchsia-400/60 to-cyan-300/50', speed: 0.6, blur: 'blur-lg', top: '45%' },
    { height: 20, color: 'bg-gradient-to-r from-fuchsia-300/70 via-cyan-300/80 to-fuchsia-300/70', speed: 0.9, blur: 'blur-md', top: '52%' },
    { height: 8, color: 'bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200', speed: 1.5, blur: 'blur-sm', top: '50%' },
    { height: 2, color: 'bg-white', speed: 2.5, blur: 'blur-none', top: '50%' },
  ];

  useEffect(() => {
    let ticking = false;
    const updatePositions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      if (rect.top <= viewportHeight && rect.bottom >= 0) {
        const totalDistance = viewportHeight + rect.height;
        const scrolledDistance = viewportHeight - rect.top;
        const progress = scrolledDistance / totalDistance;
        const baseTranslate = (progress - 0.5) * 400; 
        
        bandsRef.current.forEach((band, index) => {
          if (band) {
            const speed = laserBands[index].speed;
            band.style.transform = `translate3d(${baseTranslate * speed}vw, -50%, 0)`;
          }
        });
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePositions);
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    updatePositions(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[150px] relative flex items-center justify-center pointer-events-none my-8 z-0">
      <div className="absolute w-full h-[1px] bg-slate-800/30"></div>
      {laserBands.map((band, index) => (
        <div 
          key={index}
          ref={el => bandsRef.current[index] = el}
          className={`absolute w-[250vw] rounded-full will-change-transform ${band.color} ${band.blur}`}
          style={{ height: `${band.height}px`, top: band.top }}
        ></div>
      ))}
    </div>
  );
};

const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center">
      <span className="text-cyan-400 mr-2">/</span> {title}
    </h2>
    {subtitle && <p className="text-slate-400 max-w-2xl text-lg">{subtitle}</p>}
  </div>
);

// --- Componentes da Página ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Habilidades', href: '#skills' },
    { name: 'Projetos', href: '#projects' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <TypingLogo />

        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a key={link.name} href={link.href} className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium uppercase tracking-wider">
              {link.name}
            </a>
          ))}
          <a href="#contact" className="px-5 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500 hover:text-slate-900 transition-all font-medium">
            Contato
          </a>
        </div>

        <button className="md:hidden text-slate-300 z-50 relative" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-6 flex flex-col gap-4">
          {links.map(link => (
            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 transition-colors text-lg font-medium">
              {link.name}
            </a>
          ))}
          <a href="#contact" onClick={() => setIsOpen(false)} className="mt-4 text-center px-5 py-3 bg-cyan-500 text-slate-900 rounded-lg font-bold">
            Vamos Conversar
          </a>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900 to-fuchsia-900/10 -z-10"></div>
      
      <FocusSection className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full relative z-10">
        <div>
          <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-semibold mb-6">
            Olá, eu sou o Adans Custódio 👋
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Desenvolvedor <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              Full-Stack
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
            <strong className="text-white font-semibold">Crio sites profissionais do zero</strong> e transformo gargalos operacionais em sistemas eficientes. Desenvolvo soluções web robustas, dashboards analíticos e ferramentas de gestão.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="px-8 py-4 bg-cyan-500 text-slate-900 rounded-lg font-bold hover:bg-cyan-400 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(6,182,212,0.3)] transition-all duration-300 flex items-center gap-2">
              Ver Projetos <ChevronRight size={20} />
            </a>
          </div>
        </div>

        <div className="hidden lg:flex justify-end relative">
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-cyan-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] border border-fuchsia-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            
            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(217,70,239,0.1)] h-full flex flex-col justify-between">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-red-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-yellow-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-green-500 transition-colors"></div>
              </div>
              <div className="font-mono text-sm text-cyan-400 flex-1 flex flex-col justify-center">
                <p className="mb-2"><span className="text-fuchsia-500">const</span> <span className="text-blue-400">developer</span> = {'{'}</p>
                <p className="ml-4 mb-1">name: <span className="text-yellow-300">'Adans Custódio'</span>,</p>
                <p className="ml-4 mb-1">services: [<span className="text-yellow-300">'Sites do Zero'</span>, <span className="text-yellow-300">'Dashboards'</span>],</p>
                <p className="ml-4 mb-1">skills: [<span className="text-yellow-300">'React'</span>, <span className="text-yellow-300">'Node'</span>, <span className="text-yellow-300">'Tailwind'</span>],</p>
                <p className="ml-4 mb-1">isAvailable: <span className="text-fuchsia-400">true</span></p>
                <p>{'};'}</p>
                <p className="mt-4 text-slate-500">{'// Pronto para criar seu próximo projeto'}</p>
                <p className="animate-pulse mt-2 text-fuchsia-500">_</p>
              </div>
            </div>
          </div>
        </div>
      </FocusSection>
    </section>
  );
};

const AnimatedStatCard = ({ value, label }) => (
  <div className="relative group h-full">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 z-0"></div>
    <div className="relative w-full h-full rounded-xl p-[2px] overflow-hidden bg-slate-800/40 z-10">
      <div className="absolute w-[250%] h-[250%] top-[-75%] left-[-75%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_35%,#22d3ee_50%,transparent_50%,transparent_85%,#d946ef_100%)] animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative bg-slate-900 rounded-[10px] p-6 h-full flex flex-col justify-center items-center z-20">
        <div className="text-4xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-fuchsia-400 transition-all duration-300">
          {value}
        </div>
        <div className="text-slate-400 text-sm uppercase tracking-wider text-center font-medium">
          {label}
        </div>
      </div>
    </div>
  </div>
);

const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <FocusSection className="max-w-6xl mx-auto px-6">
        <SectionHeading title="Sobre Mim" subtitle="Muito além de apenas escrever linhas de código." />
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
            <p>
              Minha paixão por tecnologia vai além de escrever código; ela está em <strong className="text-white">resolver problemas reais</strong>. Tenho experiência em mapear necessidades complexas de empresas e traduzi-las em sistemas de gestão, dashboards intuitivos e interfaces de alta performance.
            </p>
            <p>
              Acredito que um bom software deve economizar tempo, dinheiro e evitar dores de cabeça para quem o utiliza. Por isso, meu foco é sempre na <span className="text-cyan-400">otimização de processos</span> e na experiência do usuário (UX).
            </p>
            <p>
              Quando não estou otimizando o processo produtivo de um cliente ou construindo arquiteturas de dados, gosto de explorar a lógica criativa desenvolvendo <strong className="text-white">jogos simples para a web</strong>.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 h-fit">
            <AnimatedStatCard value="100%" label="Foco em Soluções" />
            <AnimatedStatCard value="+X" label="Projetos Entregues" />
            <AnimatedStatCard value="24/7" label="Sede de Aprender" />
            <AnimatedStatCard value="UX" label="Design Centrado" />
          </div>
        </div>
      </FocusSection>
    </section>
  );
};

const Skills = () => {
  const skills = [
    { category: 'Frontend', icon: <Code2 className="text-blue-400" />, items: ['HTML5 & CSS3', 'JavaScript (ES6+)', 'React.js', 'Tailwind CSS'] },
    { category: 'Visualização', icon: <LayoutDashboard className="text-purple-400" />, items: ['Dashboards UI', 'Chart.js / Recharts', 'UX Corporativa', 'Figma'] },
    { category: 'Sistemas & Back', icon: <Database className="text-green-400" />, items: ['Node.js / Python', 'APIs REST', 'Modelagem de Dados', 'Lógica de Jogos'] },
    { category: 'Soft Skills', icon: <Cpu className="text-orange-400" />, items: ['Visão de Negócios', 'Resolução de Gargalos', 'Otimização de Processos', 'Trabalho em Equipe'] },
  ];

  return (
    <section id="skills" className="py-24 bg-slate-800/20 border-y border-white/5 relative">
      <FocusSection className="max-w-6xl mx-auto px-6">
        <SectionHeading title="Habilidades & Ferramentas" subtitle="A stack tecnológica que utilizo para construir soluções robustas e escaláveis." />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skillGroup, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {skillGroup.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{skillGroup.category}</h3>
              <ul className="space-y-3">
                {skillGroup.items.map((item, i) => (
                  <li key={i} className="text-slate-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </FocusSection>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      id: 'dashboard',
      title: 'Dashboard de Desempenho Geral da Fábrica',
      type: 'O Carro-Chefe',
      desc: 'Painel analítico para monitoramento de métricas críticas como Qualidade Acumulada, Quebra Acumulada e Utilização Diária, com comparação em tempo real com metas.',
      tags: ['React', 'Chart.js', 'Tailwind', 'Data Visualization'],
      color: 'from-cyan-900/40 to-slate-900'
    },
    {
      id: 'gestao',
      title: 'Sistema de Gestão e Auditoria (Visão Gestor)',
      type: 'O Solucionador',
      desc: 'Interface gerencial completa para controle de rotinas mensais e anuais, oferecendo acompanhamento detalhado do plano de ação e resultados operacionais.',
      tags: ['React', 'Tailwind', 'UI Corporativa', 'Gestão de Processos'],
      color: 'from-slate-200 to-slate-300'
    }
  ];

  return (
    <section id="projects" className="py-24 relative">
      <FocusSection className="max-w-6xl mx-auto px-6">
        <SectionHeading title="Projetos em Destaque" subtitle="Casos reais de como transformo problemas complexos em soluções simples e elegantes." />
        
        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div key={idx} className="group relative bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-colors duration-500 flex flex-col h-full">
              
              <div className={`h-64 w-full bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden border-b border-slate-700/50 p-4`}>
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-20 pointer-events-none"></div>
                
                <div className="relative z-10 w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out shadow-2xl rounded-md overflow-hidden">
                  
                  {project.id === 'dashboard' ? (
                    <div className="w-full h-full bg-[#0f172a] p-3 flex flex-col font-sans">
                      <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2">
                        <span className="font-bold text-slate-200 text-xs">Geral da Fábrica</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                      </div>
                      <div className="flex gap-3 flex-1">
                        <div className="w-2/5 flex flex-col gap-2">
                          <div className="flex-1 bg-slate-800/80 rounded border border-slate-700 flex flex-col items-center justify-center relative">
                            <span className="text-[8px] text-slate-400 absolute top-2 left-2">OEE Acumulado</span>
                            <div className="relative w-16 h-16 mt-2 flex items-center justify-center">
                              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#334155" strokeWidth="3" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="80.3, 100" className="drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]" />
                              </svg>
                              <span className="absolute font-bold text-white text-[10px]">80.3%</span>
                            </div>
                          </div>
                          <div className="flex gap-2 h-10">
                             <div className="flex-1 bg-slate-800/80 rounded border border-slate-700 flex flex-col justify-center items-center"><span className="text-[7px] text-slate-400">Qualidade</span><span className="text-green-400 font-bold text-xs">100%</span></div>
                             <div className="flex-1 bg-slate-800/80 rounded border border-slate-700 flex flex-col justify-center items-center"><span className="text-[7px] text-slate-400">Perform.</span><span className="text-yellow-400 font-bold text-xs">80%</span></div>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                           <div className="flex-1 bg-slate-800/80 rounded border border-slate-700 p-2 flex flex-col">
                              <span className="text-[7px] text-slate-400 mb-1">Utilização Diária</span>
                              <div className="flex-1 flex items-end gap-1">
                                {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                  <div key={i} className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm opacity-90" style={{ height: `${h}%` }}></div>
                                ))}
                              </div>
                           </div>
                           <div className="flex-1 bg-slate-800/80 rounded border border-slate-700 p-2 flex flex-col overflow-hidden">
                              <span className="text-[7px] text-slate-400 mb-1">Análise de Ofensores</span>
                              <div className="flex-1 relative">
                                <svg viewBox="0 0 100 30" className="absolute inset-0 w-full h-full preserve-3d" preserveAspectRatio="none">
                                   <polyline fill="none" stroke="#d946ef" strokeWidth="2" points="0,25 20,10 40,15 60,5 80,20 100,2" />
                                   <polyline fill="rgba(217,70,239,0.2)" stroke="none" points="0,30 0,25 20,10 40,15 60,5 80,20 100,2 100,30" />
                                </svg>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex flex-col font-sans overflow-hidden border border-slate-300 rounded-md">
                      <div className="h-7 bg-white border-b border-slate-200 flex justify-between items-center px-3 shadow-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center"><LayoutDashboard size={10} className="text-white"/></div>
                            <div className="w-20 h-2.5 bg-slate-200 rounded"></div>
                         </div>
                         <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[8px] border border-blue-200">AC</div>
                      </div>
                      <div className="flex flex-1">
                         <div className="w-12 bg-slate-800 flex flex-col items-center py-3 gap-4 shadow-inner">
                            <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center border border-slate-600"><div className="w-3 h-3 bg-cyan-400 rounded-sm"></div></div>
                            <div className="w-5 h-5 bg-slate-700/50 rounded-md"></div>
                            <div className="w-5 h-5 bg-slate-700/50 rounded-md"></div>
                         </div>
                         <div className="flex-1 p-3 flex flex-col gap-2 bg-slate-100/50">
                            <div className="flex justify-between items-center">
                              <h4 className="text-slate-800 font-bold text-[10px]">Auditorias Mensais</h4>
                              <div className="px-2 py-1 bg-blue-600 text-white text-[7px] font-bold rounded shadow-sm">+ Nova</div>
                            </div>
                            
                            <div className="bg-white rounded-md border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                               <div className="flex bg-slate-50 p-1.5 border-b border-slate-200 font-bold text-slate-500 text-[7px] uppercase tracking-wider">
                                  <div className="flex-1 pl-1">Processo</div>
                                  <div className="w-16 text-center">Status</div>
                                  <div className="w-16 text-center">Ação</div>
                               </div>
                               {[
                                 { p: 'Inspeção Fabril', s: 'Concluído', c: 'bg-green-100 text-green-700 border-green-200', b: 'bg-slate-100' },
                                 { p: 'Controle de Qualidade', s: 'Pendente', c: 'bg-red-100 text-red-700 border-red-200', b: 'bg-blue-600 text-white shadow-sm' },
                                 { p: 'Calibração de L2', s: 'Ressalva', c: 'bg-yellow-100 text-yellow-700 border-yellow-200', b: 'bg-slate-100' },
                               ].map((row, i) => (
                                 <div key={i} className="flex p-1.5 border-b border-slate-100 items-center text-[8px] text-slate-700 hover:bg-slate-50">
                                    <div className="flex-1 truncate font-medium pl-1">{row.p}</div>
                                    <div className="w-16 flex justify-center">
                                       <span className={`px-2 py-0.5 rounded-full border ${row.c} font-bold`}>{row.s}</span>
                                    </div>
                                    <div className="w-16 flex justify-center">
                                       <div className={`h-4 w-10 rounded flex items-center justify-center ${row.b}`}></div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 block">{project.type}</span>
                <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                <p className="text-slate-400 mb-6 flex-1 leading-relaxed">
                  {project.desc}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </FocusSection>
    </section>
  );
};

const Contact = ({ onOpenWizard }) => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-cyan-900/10 blur-[100px] rounded-full w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
      
      <FocusSection className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Pronto para otimizar seu próximo projeto?</h2>
        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Estou sempre aberto a discutir novos projetos, ideias criativas ou oportunidades para fazer parte da sua visão.
        </p>
        
        {/* BOTÃO NOVO E CHAMATIVO PARA O MODAL */}
        <div className="mb-14 flex justify-center">
          <button 
            onClick={onOpenWizard}
            className="group relative inline-flex items-center justify-center px-8 py-5 font-bold text-white transition-all duration-200 bg-slate-900 font-sans rounded-xl hover:scale-105"
          >
            <div className="absolute inset-0 w-full h-full -mt-1 rounded-xl opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></div>
            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 rounded-xl blur opacity-70 group-hover:opacity-100 animate-pulse transition duration-500"></div>
            <div className="relative flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-800 rounded-xl">
              <Wand2 className="text-fuchsia-400 group-hover:rotate-12 transition-transform" />
              <span className="text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-100 to-white">VAMOS TESTAR JUNTOS?</span>
            </div>
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a href="mailto:adans.custodio@gmail.com" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500 text-slate-900 rounded-lg font-bold text-lg hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all duration-300">
            <Mail /> Enviar Email
          </a>
          <a href="https://wa.me/5548999235732" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 border border-slate-700 text-white rounded-lg font-bold text-lg hover:bg-slate-700 hover:border-cyan-500 hover:-translate-y-1 transition-all duration-300">
            <Phone /> WhatsApp
          </a>
        </div>
      </FocusSection>
    </section>
  );
};

// --- Modal Construtor de Projetos ---
const ProjectWizard = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([{ id: 'root', selections: [] }]);
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState('');
  const [nameStep, setNameStep] = useState(true);

  if (!isOpen) return null;

  const currentStepState = history[history.length - 1];
  const isFinal = currentStepState.id === 'final';
  const currentStepDef = isFinal ? null : wizardTree[currentStepState.id];

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setNameStep(false);
    }
  };

  const handleSelect = (option) => {
    const newSelections = [...currentStepState.selections, option.label];
    setHistory([...history, { id: option.next, selections: newSelections }]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    } else if (!nameStep) {
      setNameStep(true);
    }
  };

  const handleReset = () => {
    setHistory([{ id: 'root', selections: [] }]);
    setNameStep(true);
    setUserName('');
  };

  const finalBriefingText = isFinal ? generateBriefing(currentStepState.selections, userName) : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(finalBriefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/80">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(217,70,239,0.15)] flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Header do Modal */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg"><Terminal size={20} className="text-cyan-400" /></div>
            <h3 className="text-xl font-bold text-white">Construtor de Escopo</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-gradient-to-b from-slate-900 to-slate-950">
          
          {nameStep ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-md mx-auto mt-6 mb-6">
              <h4 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center leading-tight">
                Como posso te chamar?
              </h4>
              <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Digite seu nome ou empresa..."
                  className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!userName.trim()}
                  className="p-4 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </form>
            </div>
          ) : isFinal ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6 text-green-400">
                <CheckCircle2 size={32} />
                <h4 className="text-2xl font-bold text-white">Escopo Gerado!</h4>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl relative group">
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {finalBriefingText}
                </p>
                <button 
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2 bg-slate-700/50 text-slate-300 rounded hover:bg-cyan-500 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  {copied ? <span className="text-xs font-bold px-1">COPIADO!</span> : <Copy size={16} />}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <h4 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center leading-tight">
                {currentStepDef.title}
              </h4>
              
              <div className={`grid gap-4 ${currentStepState.id === 'root' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {currentStepDef.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className="p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-cyan-500 hover:bg-slate-800/80 transition-all group flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(6,182,212,0.15)]"
                  >
                    {opt.icon && <div className="group-hover:scale-110 transition-transform duration-300">{opt.icon}</div>}
                    <span className="text-slate-200 font-semibold group-hover:text-white">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer do Modal */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-4">
            {(!nameStep && !isFinal) && (
              <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={16} /> Voltar
              </button>
            )}
            {isFinal && (
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors">
                 Refazer
              </button>
            )}
          </div>
          
          {isFinal && (
             <a 
               href={`https://wa.me/5548999235732?text=${encodeURIComponent(finalBriefingText)}`} 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 text-white rounded-lg font-bold hover:bg-fuchsia-500 transition-colors shadow-lg shadow-fuchsia-600/20"
             >
               Enviar via WhatsApp
             </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="py-8 border-t border-white/10 bg-slate-950 text-center relative z-20">
    <p className="text-slate-500 text-sm">
      © {new Date().getFullYear()} Adans Custódio. Construído com React & Tailwind CSS.
    </p>
  </footer>
);

export default function App() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-100">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>
      
      <div className="relative z-10">
        <Navbar />
        <main className="overflow-x-hidden pt-10 pb-10">
          <Hero />
          <LaserDivider />
          <About />
          <LaserDivider />
          <Skills />
          <LaserDivider />
          <Projects />
          <LaserDivider />
          <Contact onOpenWizard={() => setIsWizardOpen(true)} />
        </main>
        <Footer />
        <ProjectWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
      </div>
    </div>
  );
}