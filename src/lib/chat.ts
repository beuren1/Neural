export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

const STORAGE_KEY = "neuralai-conversations";

function createId() {
  return crypto.randomUUID();
}

export async function getConversations(): Promise<Conversation[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 120));
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved) as Conversation[];
  } catch (error) {
    console.error("Não foi possível carregar o histórico de conversas.", error);
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function createReply(prompt: string) {
  const normalized = prompt.toLocaleLowerCase("pt-BR");

  if (normalized.includes("marketing") || normalized.includes("conteúdo")) {
    return "Claro! Uma boa estratégia começa entendendo quem você quer alcançar. Defina um objetivo, escolha um canal principal e crie conteúdos que resolvam uma dúvida real do seu público. Quer que eu monte um calendário de conteúdo para a sua ideia?";
  }

  if (normalized.includes("ideia") || normalized.includes("começar")) {
    return "Adorei essa vontade de tirar algo do papel. Vamos começar pelo essencial: qual problema você quer resolver e para quem? A partir daí, posso ajudar a validar a ideia, desenhar os próximos passos e transformar tudo em um plano simples de executar.";
  }

  if (normalized.includes("código") || normalized.includes("site")) {
    return "Posso te ajudar com isso! Primeiro, vamos dividir o projeto em partes pequenas: objetivo da página, conteúdo principal e ações que a pessoa poderá realizar. Depois, evoluímos cada seção com calma. Me conta um pouco mais sobre o que você quer construir?";
  }

  return `Ótima pergunta! Vamos explorar isso juntos. ${prompt.trim().replace(/[.!?]+$/, "")} pode ser um excelente ponto de partida. Para chegar a uma resposta prática, eu começaria identificando seu objetivo principal, reunindo o contexto mais importante e transformando as possibilidades em próximos passos claros.`;
}

export async function sendMessage({
  conversationId,
  message,
}: {
  conversationId: string | null;
  message: string;
}): Promise<{ conversation: Conversation; conversations: Conversation[] }> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));
  const conversations = await getConversations();
  const now = Date.now();
  const userMessage: ChatMessage = {
    id: createId(),
    role: "user",
    content: message,
    createdAt: now,
  };
  const assistantMessage: ChatMessage = {
    id: createId(),
    role: "assistant",
    content: createReply(message),
    createdAt: now + 1,
  };

  const previous = conversations.find((item) => item.id === conversationId);
  const conversation: Conversation = previous
    ? {
        ...previous,
        messages: [...previous.messages, userMessage, assistantMessage],
        updatedAt: now,
      }
    : {
        id: createId(),
        title: message.length > 42 ? `${message.slice(0, 42)}…` : message,
        messages: [userMessage, assistantMessage],
        updatedAt: now,
      };

  const updated = [
    conversation,
    ...conversations.filter((item) => item.id !== conversation.id),
  ];
  saveConversations(updated);

  return { conversation, conversations: updated };
}

export async function clearConversationHistory() {
  window.localStorage.removeItem(STORAGE_KEY);
}
