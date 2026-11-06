import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Command,
  FileText,
  Menu,
  MessageCircle,
  MessageSquareText,
  Plus,
  Sparkles,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import {
  clearConversationHistory,
  getConversations,
  sendMessage,
  type Conversation,
} from "./lib/chat";

const suggestions = [
  { icon: WandSparkles, label: "Me ajude com uma ideia" },
  { icon: FileText, label: "Escreva um texto criativo" },
  { icon: Zap, label: "Organize minha rotina" },
];

const features = [
  {
    number: "01",
    icon: Sparkles,
    title: "Ideias sem bloqueio",
    description:
      "Do primeiro rascunho até aquela ideia que ainda não tem nome. Comece por onde estiver.",
  },
  {
    number: "02",
    icon: Command,
    title: "Mais tempo para o que importa",
    description:
      "Automatize tarefas, organize pensamentos e tire o peso da lista de coisas por fazer.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Feita para conversar",
    description:
      "Uma parceira de raciocínio que entende seu contexto e acompanha cada novo passo.",
  },
];

const plans = [
  {
    name: "Essencial",
    description: "Para experimentar novas possibilidades.",
    monthly: 0,
    yearly: 0,
    features: ["20 mensagens por dia", "Respostas inteligentes", "Histórico de conversas"],
    action: "Começar grátis",
    featured: false,
  },
  {
    name: "Criador",
    description: "Para transformar ideias em projetos.",
    monthly: 39,
    yearly: 29,
    features: [
      "Mensagens ilimitadas",
      "Respostas mais avançadas",
      "Histórico completo",
      "Acesso antecipado a novidades",
    ],
    action: "Experimentar 7 dias grátis",
    featured: true,
  },
  {
    name: "Equipe",
    description: "Para quem cria melhor em conjunto.",
    monthly: 79,
    yearly: 59,
    features: [
      "Tudo do Criador",
      "Até 5 pessoas",
      "Espaço de trabalho compartilhado",
      "Suporte prioritário",
    ],
    action: "Falar com a gente",
    featured: false,
  },
];

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark${small ? " brand-mark-small" : ""}`}>
      <Sparkles size={small ? 17 : 19} strokeWidth={2.2} />
    </span>
  );
}

function App() {
  const queryClient = useQueryClient();
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [yearly, setYearly] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: ({ conversation, conversations: updated }) => {
      setActiveConversation(conversation);
      setMessage("");
      queryClient.setQueryData(["conversations"], updated);
    },
  });
  const clearMutation = useMutation({
    mutationFn: clearConversationHistory,
    onSuccess: () => {
      setActiveConversation(null);
      queryClient.setQueryData(["conversations"], []);
      setHistoryOpen(false);
    },
  });

  const visibleMessages = activeConversation?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [visibleMessages.length, sendMutation.isPending]);

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate({
      conversationId: activeConversation?.id ?? null,
      message: trimmed,
    });
  }

  function startNewChat() {
    setActiveConversation(null);
    setMessage("");
  }

  function selectConversation(conversation: Conversation) {
    setActiveConversation(conversation);
    setHistoryOpen(false);
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  }

  function useSuggestion(label: string) {
    setMessage(label === "Me ajude com uma ideia" ? "Me ajude a tirar uma ideia do papel" : label);
    document.getElementById("chat-input")?.focus();
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="NeuralAI, início">
          <BrandMark />
          <span>neural<span className="brand-light">ai</span></span>
        </a>
        <nav className={`main-nav${mobileMenuOpen ? " main-nav-open" : ""}`}>
          <a href="#recursos" onClick={() => setMobileMenuOpen(false)}>Recursos</a>
          <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)}>Como funciona</a>
          <a href="#planos" onClick={() => setMobileMenuOpen(false)}>Planos</a>
        </nav>
        <div className="header-actions">
          <button className="header-login" onClick={() => setHistoryOpen(true)}>
            Entrar
          </button>
          <a className="button button-light header-cta" href="#demo">
            Começar grátis <ArrowUpRight size={15} />
          </a>
        </div>
        <button
          className="mobile-menu-button"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <section className="hero section-shell">
        <div className="hero-copy">
          <motion.div
            className="announcement"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="announcement-dot" />
            <span>Conheça sua nova parceira criativa</span>
            <ArrowRight size={13} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            Ideias que vão
            <br />
            <span className="gradient-text">mais longe.</span>
          </motion.h1>
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            Uma inteligência artificial para pensar junto, criar sem limites e
            tirar seus planos do papel. O próximo passo começa com uma conversa.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.27 }}
          >
            <a className="button button-primary" href="#demo">
              Experimente agora <ArrowRight size={16} />
            </a>
            <a className="text-link" href="#como-funciona">
              Descubra como funciona <ArrowDown size={14} />
            </a>
          </motion.div>
          <motion.div
            className="social-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <div className="avatar-stack" aria-hidden="true">
              <span>J</span><span>M</span><span>A</span><span>L</span>
            </div>
            <p><strong>+12 mil pessoas</strong><br />já estão criando com a NeuralAI</p>
            <span className="proof-divider" />
            <span className="rating"><span>★★★★★</span> 4,9/5</span>
          </motion.div>
        </div>

        <motion.div
          className="demo-wrap"
          id="demo"
          initial={{ opacity: 0, y: 22, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.22, ease: "easeOut" }}
        >
          <div className="demo-glow" />
          <div className="chat-card">
            <div className="chat-topbar">
              <div className="chat-brand">
                <BrandMark small />
                <div>
                  <strong>NeuralAI</strong>
                  <span><i /> Online agora</span>
                </div>
              </div>
              <div className="chat-top-actions">
                <button
                  className="icon-button"
                  aria-label="Nova conversa"
                  title="Nova conversa"
                  onClick={startNewChat}
                >
                  <Plus size={17} />
                </button>
                <button
                  className="history-button"
                  onClick={() => setHistoryOpen(true)}
                >
                  <Clock3 size={14} /> Histórico
                  {conversations.length > 0 && (
                    <span className="history-count">{conversations.length}</span>
                  )}
                </button>
              </div>
            </div>

            <div className="chat-content" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                {visibleMessages.length === 0 ? (
                  <motion.div
                    className="welcome-message"
                    key="welcome"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="assistant-avatar"><Sparkles size={16} /></div>
                    <div className="message-body">
                      <div className="message-meta"><strong>NeuralAI</strong><span>agora</span></div>
                      <p>Oi! Que bom ter você aqui. ✨<br />O que vamos criar juntos hoje?</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="conversation-messages"
                    key={activeConversation?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {visibleMessages.map((chatMessage) => (
                      <div
                        className={`chat-message ${chatMessage.role === "user" ? "chat-message-user" : "chat-message-assistant"}`}
                        key={chatMessage.id}
                      >
                        {chatMessage.role === "assistant" && (
                          <div className="assistant-avatar"><Sparkles size={15} /></div>
                        )}
                        <div className="message-body">
                          <div className="message-meta">
                            <strong>{chatMessage.role === "user" ? "Você" : "NeuralAI"}</strong>
                            <span>{formatTime(chatMessage.createdAt)}</span>
                          </div>
                          <p>{chatMessage.content}</p>
                        </div>
                      </div>
                    ))}
                    {sendMutation.isPending && (
                      <div className="chat-message chat-message-assistant">
                        <div className="assistant-avatar"><Sparkles size={15} /></div>
                        <div className="typing-indicator" aria-label="NeuralAI está respondendo">
                          <i /><i /><i />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>
              {sendMutation.isError && (
                <p className="chat-error" role="alert">
                  Não foi possível enviar sua mensagem. Tente novamente.
                </p>
              )}
            </div>

            {visibleMessages.length === 0 && (
              <div className="suggestion-list">
                {suggestions.map(({ icon: Icon, label }) => (
                  <button key={label} onClick={() => useSuggestion(label)}>
                    <Icon size={14} /> {label} <ArrowUpRight size={12} />
                  </button>
                ))}
              </div>
            )}

            <form className="chat-composer" onSubmit={handleSend}>
              <input
                id="chat-input"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Pergunte qualquer coisa..."
                aria-label="Sua mensagem para a NeuralAI"
                disabled={sendMutation.isPending}
              />
              <div className="composer-bottom">
                <span><Sparkles size={12} /> Respostas feitas para você</span>
                <button
                  className="send-button"
                  aria-label="Enviar mensagem"
                  type="submit"
                  disabled={!message.trim() || sendMutation.isPending}
                >
                  <ArrowUp size={17} />
                </button>
              </div>
            </form>
            <p className="chat-disclaimer">A NeuralAI pode cometer erros. Confira informações importantes.</p>
          </div>
          <div className="floating-note floating-note-top">
            <span className="note-icon note-icon-purple"><Sparkles size={15} /></span>
            <span><strong>Ideias brilhantes</strong><small>começam aqui</small></span>
          </div>
          <div className="floating-note floating-note-bottom">
            <span className="note-icon note-icon-green"><Check size={15} /></span>
            <span><strong>Seu próximo passo</strong><small>está mais perto</small></span>
          </div>
        </motion.div>
      </section>

      <section className="trust-strip section-shell">
        <span>UM NOVO JEITO DE FAZER ACONTECER</span>
        <div className="trust-metrics">
          <div><strong>10<span>×</span></strong><small>mais possibilidades</small></div>
          <i />
          <div><strong>∞</strong><small>ideias para explorar</small></div>
          <i />
          <div><strong>24<span>/7</span></strong><small>ao seu lado</small></div>
        </div>
      </section>

      <section className="features-section section-shell" id="recursos">
        <div className="section-heading">
          <span className="eyebrow"><span /> MENOS ATRITO, MAIS CRIAÇÃO</span>
          <h2>Uma ajudinha que muda<br />o jeito de <span className="gradient-text">fazer.</span></h2>
          <p>Não é sobre fazer tudo por você. É sobre abrir espaço para você ir mais longe.</p>
        </div>
        <div className="feature-grid">
          {features.map(({ number, icon: Icon, title, description }, index) => (
            <motion.article
              className="feature-card"
              key={number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <div className="feature-card-top"><span>{number}</span><Icon size={19} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
              <a href="#demo" aria-label={`Experimentar: ${title}`}><ArrowUpRight size={16} /></a>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="workflow-section section-shell" id="como-funciona">
        <div className="workflow-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="orbit-center"><BrandMark /></div>
          <div className="orbit-chip chip-one"><WandSparkles size={16} /></div>
          <div className="orbit-chip chip-two"><MessageSquareText size={16} /></div>
          <div className="orbit-chip chip-three"><Zap size={16} /></div>
          <div className="visual-caption"><span className="pulse-dot" /> Uma ideia puxa a outra</div>
        </div>
        <div className="workflow-copy">
          <span className="eyebrow"><span /> DO SEU JEITO, NO SEU TEMPO</span>
          <h2>A conversa certa<br />muda <span className="gradient-text">tudo.</span></h2>
          <p>
            Sem manual, sem complicação. Conte o que está pensando, peça uma
            mãozinha, mude de ideia. A NeuralAI acompanha seu ritmo.
          </p>
          <div className="steps-list">
            <div><span>1</span><p><strong>Comece com uma pergunta</strong><small>Uma frase, uma ideia ou até um “por onde começo?”.</small></p></div>
            <div><span>2</span><p><strong>Construa a conversa</strong><small>Explore possibilidades, peça ajustes e aprofunde.</small></p></div>
            <div><span>3</span><p><strong>Leve suas ideias adiante</strong><small>Salve tudo e volte quando quiser ao seu histórico.</small></p></div>
          </div>
          <a className="text-link workflow-link" href="#demo">Quero experimentar <ArrowRight size={15} /></a>
        </div>
      </section>

      <section className="pricing-section section-shell" id="planos">
        <div className="section-heading">
          <span className="eyebrow"><span /> PLANOS QUE FAZEM SENTIDO</span>
          <h2>Seu próximo passo.<br /><span className="gradient-text">Seu jeito de chegar.</span></h2>
          <p>Comece de graça. Cresça quando fizer sentido para você.</p>
          <div className="billing-switch" aria-label="Período de cobrança">
            <button className={!yearly ? "selected" : ""} onClick={() => setYearly(false)}>Mensal</button>
            <button className={yearly ? "selected" : ""} onClick={() => setYearly(true)}>
              Anual <span>−25%</span>
            </button>
          </div>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.article
              className={`plan-card${plan.featured ? " plan-featured" : ""}`}
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {plan.featured && <div className="popular-tag"><Sparkles size={12} /> MAIS ESCOLHIDO</div>}
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="plan-price">
                <strong>{plan.monthly === 0 ? "Grátis" : `R$ ${yearly ? plan.yearly : plan.monthly}`}</strong>
                {plan.monthly !== 0 && <span>/ pessoa / mês</span>}
              </div>
              {plan.monthly !== 0 && yearly && <span className="billing-note">Cobrado anualmente</span>}
              <a
                href="#demo"
                className={`button plan-button${plan.featured ? " button-primary" : ""}`}
              >
                {plan.action} <ArrowRight size={15} />
              </a>
              <span className="plan-includes">O que está incluído</span>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}><Check size={15} /> {feature}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
        <p className="pricing-footnote">Sem cartão de crédito para começar. Cancele quando quiser.</p>
      </section>

      <section className="closing-cta section-shell">
        <div className="cta-orb" />
        <div className="cta-content">
          <BrandMark />
          <h2>Tem uma ideia?<br /><span>Vamos nessa.</span></h2>
          <p>A próxima grande coisa pode começar com uma pergunta.</p>
          <a className="button button-light" href="#demo">Conversar com a NeuralAI <ArrowRight size={16} /></a>
        </div>
        <div className="cta-stars" aria-hidden="true">✳ <span>✦</span> · ✳</div>
      </section>

      <footer className="site-footer section-shell">
        <a className="brand" href="#" aria-label="NeuralAI, início"><BrandMark /><span>neural<span className="brand-light">ai</span></span></a>
        <span>Feita para suas ideias irem mais longe. © 2025 NeuralAI</span>
        <a href="#planos">Planos <ChevronDown size={13} /></a>
      </footer>

      <AnimatePresence>
        {historyOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setHistoryOpen(false);
            }}
          >
            <motion.section
              className="history-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="history-title"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
            >
              <div className="modal-heading">
                <div><span className="eyebrow"><span /> SEU ESPAÇO</span><h2 id="history-title">Suas conversas</h2></div>
                <button className="icon-button" aria-label="Fechar histórico" onClick={() => setHistoryOpen(false)}><X size={18} /></button>
              </div>
              <button
                className="new-conversation-button"
                onClick={() => { startNewChat(); setHistoryOpen(false); document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                <Plus size={16} /> Começar uma nova conversa
              </button>
              <div className="history-list">
                {conversations.length ? conversations.map((conversation) => (
                  <button className="history-item" key={conversation.id} onClick={() => selectConversation(conversation)}>
                    <span className="history-item-icon"><MessageSquareText size={16} /></span>
                    <span className="history-item-copy"><strong>{conversation.title}</strong><small>{conversation.messages.length} mensagens · {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(conversation.updatedAt)}</small></span>
                    <ArrowUpRight size={15} />
                  </button>
                )) : (
                  <div className="history-empty"><Clock3 size={22} /><strong>Seu histórico começa aqui</strong><span>As conversas que você tiver ficam guardadas neste dispositivo.</span></div>
                )}
              </div>
              {conversations.length > 0 && (
                <button
                  className="clear-history-button"
                  onClick={() => clearMutation.mutate()}
                  disabled={clearMutation.isPending}
                >
                  {clearMutation.isPending ? "Limpando..." : "Limpar histórico"}
                </button>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
