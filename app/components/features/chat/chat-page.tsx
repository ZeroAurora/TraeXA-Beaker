import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  Send,
  Search,
  FileText,
  Bot,
  User,
  Loader2,
  Plus,
  X,
  ChevronDown,
  Sparkles,
  Maximize2,
  Settings,
  Download,
  FlaskConical,
  Library,
  Home,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { mockChatMessages, mockDocuments } from "~/data/mock-data";
import { cn } from "~/lib/utils";

interface ChatPageProps {
  onOpenDrawer?: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  references?: string[];
}

export function ChatPage({ onOpenDrawer }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "你好！我是 Beaker AI 助手。我可以帮你搜索知识库、回答问题，或者进行深度对话。有什么我可以帮你的吗？",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSources, setShowSources] = useState(true);
  const [expandedSources, setExpandedSources] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSearching(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `根据搜索结果和知识库内容，我找到了相关信息：

**关键发现：**

1. **React 19 Actions 与 Agent 设计**
   React 19 的 Actions API 与 AI Agent 的工具调用模式高度相似。Actions 提供了声明式的异步操作处理，这正是 Agent 系统中工具调用的核心需求。

2. **状态管理**
   两者都依赖明确的状态机来管理操作流程。React 的 useTransition 与 Agent 的决策循环有异曲同工之妙。

**建议：**
将 React 19 的 Actions 模式应用于 Agent 工具调用，可以简化代码结构并提高可维护性。`,
      timestamp: new Date(),
      references: ["1", "2"],
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsSearching(false);
  };

  const getDocumentTitle = (docId: string) => {
    const doc = mockDocuments.find((d) => d.id === docId);
    return doc?.title || "未知文档";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 mb-4">
              <Bot className="w-8 h-8 text-teal-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Beaker AI</h2>
            <p className="text-muted-foreground">
              基于知识库的智能对话助手
            </p>
          </div>

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <Avatar
                className={cn(
                  "w-10 h-10 shrink-0",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-teal-500 to-cyan-500"
                    : "bg-gradient-to-br from-blue-500 to-indigo-500"
                )}
              >
                <AvatarFallback className="text-white">
                  {message.role === "assistant" ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={cn(
                  "flex-1 max-w-[80%]",
                  message.role === "user" && "text-right"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">
                    {message.role === "assistant" ? "Beaker AI" : "你"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>

                <div
                  className={cn(
                    "relative",
                    message.role === "user" && "flex flex-col items-end"
                  )}
                >
                  <div
                    className={cn(
                      "p-4 rounded-2xl",
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-tr-sm"
                        : "bg-card border rounded-xl rounded-tl-sm"
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>

                  {message.role === "assistant" &&
                    message.references &&
                    message.references.length > 0 && (
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedSources(
                              expandedSources === message.id ? null : message.id
                            )
                          }
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          {expandedSources === message.id ? "收起" : "显示"}{" "}
                          {message.references.length} 个参考来源
                          <ChevronDown
                            className={cn(
                              "w-3 h-3 ml-1 transition-transform",
                              expandedSources === message.id && "rotate-180"
                            )}
                          />
                        </Button>

                        {expandedSources === message.id && (
                          <div className="mt-2 space-y-2">
                            {message.references.map((ref) => (
                              <div
                                key={ref}
                                className="p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-teal-500 shrink-0" />
                                  <span className="text-sm">
                                    {getDocumentTitle(ref)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}

          {isSearching && (
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 shrink-0 bg-gradient-to-br from-teal-500 to-cyan-500">
                <AvatarFallback className="text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Beaker AI</span>
                </div>
                <div className="p-4 rounded-2xl bg-card border rounded-tl-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      正在搜索知识库...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background/80 backdrop-blur-xl p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              placeholder="输入消息..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="h-12 pr-24 rounded-xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-teal-500"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSources(!showSources)}
              >
                <Search
                  className={cn(
                    "w-4 h-4",
                    showSources && "text-teal-500"
                  )}
                />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                onClick={handleSend}
                disabled={!inputValue.trim() || isSearching}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
              >
                <Home className="w-3 h-3" />
                首页
              </Link>
              <Link
                to="/crawler"
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
              >
                <Download className="w-3 h-3" />
                抓取
              </Link>
              <Link
                to="/remix"
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
              >
                <FlaskConical className="w-3 h-3" />
                重组
              </Link>
              <Link
                to="/knowledge"
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
              >
                <Library className="w-3 h-3" />
                知识库
              </Link>
            </div>
            <span className="text-xs text-muted-foreground">
              按 Enter 发送消息
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
