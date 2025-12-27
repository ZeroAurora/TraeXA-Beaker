export const mockDocuments = [
  {
    id: "1",
    title: "React 19 新特性详解",
    source: "jina",
    url: "https://react.dev/blog/2024/04/25/react-19",
    createdAt: new Date("2024-12-20"),
    isAIGenerated: false,
    tags: ["React", "前端", "JavaScript"],
    summary: "React 19 引入了 Actions、use hook、Server Components 等重大更新...",
  },
  {
    id: "2",
    title: "AI Agent 的设计模式",
    source: "rss",
    url: "https://example.com/agent-design-patterns",
    createdAt: new Date("2024-12-18"),
    isAIGenerated: false,
    tags: ["AI", "Agent", "设计模式"],
    summary: "本文探讨了构建 AI Agent 系统时的核心设计模式和最佳实践...",
  },
  {
    id: "3",
    title: "知识图谱构建指南",
    source: "remix",
    url: "",
    createdAt: new Date("2024-12-15"),
    isAIGenerated: true,
    tags: ["知识图谱", "AI", "Remix"],
    summary: "基于多个源文档生成的关于知识图谱构建的综合指南...",
  },
  {
    id: "4",
    title: "Tailwind CSS v4 更新内容",
    source: "jina",
    url: "https://tailwindcss.com/blog/tailwindcss-4",
    createdAt: new Date("2024-12-12"),
    isAIGenerated: false,
    tags: ["CSS", "Tailwind", "前端"],
    summary: "Tailwind CSS v4 带来了全新的引擎架构和更快的构建速度...",
  },
  {
    id: "5",
    title: "RAG 系统优化策略",
    source: "rss",
    url: "https://example.com/rag-optimization",
    createdAt: new Date("2024-12-10"),
    isAIGenerated: false,
    tags: ["RAG", "AI", "检索"],
    summary: "优化 RAG 系统的检索精度和生成质量的实用策略...",
  },
];

export const mockFeeds = [
  {
    id: "1",
    name: "React Blog",
    url: "https://react.dev/blog/rss.xml",
    description: "Official React blog updates",
    lastSync: new Date("2024-12-27T10:00:00"),
    status: "active",
    articleCount: 142,
  },
  {
    id: "2",
    name: "AI Weekly",
    url: "https://example.com/ai-weekly/rss",
    description: "Weekly AI news and insights",
    lastSync: new Date("2024-12-26T08:00:00"),
    status: "active",
    articleCount: 89,
  },
  {
    id: "3",
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    description: "Technology news",
    lastSync: new Date("2024-12-27T09:00:00"),
    status: "active",
    articleCount: 1256,
  },
  {
    id: "4",
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
    description: "Hacker News frontpage",
    lastSync: new Date("2024-12-27T11:00:00"),
    status: "active",
    articleCount: 3421,
  },
];

export const mockChatMessages = [
  {
    id: "1",
    role: "user",
    content: "请帮我总结一下 React 19 和之前版本的主要区别",
    timestamp: new Date("2024-12-27T10:30:00"),
    references: ["1"],
  },
  {
    id: "2",
    role: "assistant",
    content: "根据知识库中的文档，React 19 与之前版本的主要区别包括：\n\n1. **Actions**: 新的 Actions API 简化了异步操作的处理\n2. **use hook**: 新的 use hook 可以在组件外部获取数据\n3. **Server Components**: 默认支持 Server Components\n4. **更快的编译速度**: 优化的编译器带来更好的构建性能",
    timestamp: new Date("2024-12-27T10:30:05"),
    references: ["1"],
  },
  {
    id: "3",
    role: "user",
    content: "那在构建 AI Agent 时，有哪些最佳实践？",
    timestamp: new Date("2024-12-27T10:32:00"),
    references: ["2"],
  },
  {
    id: "4",
    role: "assistant",
    content: "根据《AI Agent 的设计模式》一文，构建 AI Agent 的最佳实践包括：\n\n1. **清晰的职责分离**: 将感知、决策、执行分离\n2. **状态管理**: 使用明确的状态机管理 Agent 生命周期\n3. **工具调用**: 设计可扩展的工具接口\n4. **错误处理**: 实现优雅的失败恢复机制",
    timestamp: new Date("2024-12-27T10:32:10"),
    references: ["2"],
  },
];

export const mockVibeRecommendations = [
  {
    id: "1",
    documentId: "1",
    fragment: "React 19 引入了 Actions，这是处理异步操作的新方式...",
    relevanceScore: 0.95,
  },
  {
    id: "2",
    documentId: "2",
    fragment: "在 Agent 系统中，Actions 可以作为工具被调用...",
    relevanceScore: 0.88,
  },
  {
    id: "3",
    documentId: "4",
    fragment: "Tailwind CSS v4 的新引擎优化了构建流程...",
    relevanceScore: 0.72,
  },
];

export const mockRemixProgress = {
  stage: "generating",
  progress: 65,
  logs: [
    { timestamp: new Date(), message: "正在分析选定的文档内容..." },
    { timestamp: new Date(), message: "已识别关键概念：React、Agent、设计模式" },
    { timestamp: new Date(), message: "正在生成知识图谱结构..." },
    { timestamp: new Date(), message: "正在撰写文档内容..." },
  ],
};

export const mockStats = {
  totalDocuments: 156,
  activeSubscriptions: 4,
  totalChats: 89,
  remixCount: 23,
};

export const mockRecentActivity = [
  {
    id: "1",
    type: "crawl",
    title: "抓取文章：React 19 新特性详解",
    timestamp: new Date("2024-12-27T10:30:00"),
  },
  {
    id: "2",
    type: "chat",
    title: "聊天：React 19 与之前版本的主要区别",
    timestamp: new Date("2024-12-27T10:32:00"),
  },
  {
    id: "3",
    type: "remix",
    title: "生成文档：知识图谱构建指南",
    timestamp: new Date("2024-12-26T15:00:00"),
  },
  {
    id: "4",
    type: "subscription",
    title: "同步订阅源：AI Weekly",
    timestamp: new Date("2024-12-26T08:00:00"),
  },
];

export const navItems = [
  { path: "/", icon: "layout-dashboard", label: "工作台" },
  { path: "/crawler", icon: "download", label: "内容抓取" },
  { path: "/knowledge", icon: "library", label: "知识库" },
  { path: "/subscription", icon: "rss", label: "RSS订阅" },
  { path: "/chat", icon: "message-circle", label: "智能聊天" },
  { path: "/remix", icon: "flask-conical", label: "知识重组" },
];
