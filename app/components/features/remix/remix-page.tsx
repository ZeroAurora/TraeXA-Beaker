import { useState } from "react";
import {
  FlaskConical,
  Sparkles,
  FileText,
  Check,
  Play,
  RotateCcw,
  Copy,
  Save,
  Loader2,
  ArrowRightLeft,
  PanelRightOpen,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { mockDocuments, mockRemixProgress } from "~/data/mock-data";
import { cn } from "~/lib/utils";

interface RemixPageProps {
  onOpenDrawer?: () => void;
}

export function RemixPage({ onOpenDrawer }: RemixPageProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(mockRemixProgress);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const toggleDoc = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleGenerate = async () => {
    if (selectedDocs.length < 2 || !prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedContent(null);

    const stages = [
      "正在分析选定的文档内容...",
      "已识别关键概念",
      "正在生成知识图谱结构...",
      "正在撰写文档内容...",
      "已完成",
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setGenerationProgress({
        stage: i < stages.length - 1 ? "generating" : "complete",
        progress: Math.round(((i + 1) / stages.length) * 100),
        logs: [
          ...generationProgress.logs.slice(-3),
          { timestamp: new Date(), message: stages[i] },
        ],
      });
    }

    setGeneratedContent(`# 知识图谱构建指南

## 概述

基于多个源文档生成的关于知识图谱构建的综合指南，涵盖从概念识别到实际应用的完整流程。

## 核心概念

### 1. 知识表示
知识图谱使用图结构来表示实体及其关系。每个节点代表一个实体，每条边代表实体之间的关系。

### 2. 实体识别
从文档中自动识别关键实体，包括：
- **人物**: 领域专家、作者
- **概念**: 技术术语、方法论
- **事件**: 重要会议、研究突破

### 3. 关系抽取
自动分析实体之间的关联关系，构建语义连接。

## 技术实现

### 数据源整合
结合多种数据源：
- 技术文档（React 19 新特性）
- 设计模式研究（AI Agent）
- 行业最佳实践

### 处理流程
\`\`\`
文档输入 → 预处理 → 实体识别 → 关系抽取 → 图谱构建 → 可视化
\`\`\`

## 应用场景

1. **智能问答**: 基于知识图谱的问答系统
2. **推荐引擎**: 利用实体关系进行个性化推荐
3. **数据分析**: 快速理解复杂领域知识

## 结论

知识图谱是组织和结构化知识的有效方式，结合 AI 技术可以大大提升知识管理的效率和智能化水平。`);

    setIsGenerating(false);
  };

  const selectedDocumentObjects = mockDocuments.filter((doc) =>
    selectedDocs.includes(doc.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-teal-500" />
            知识重组
          </h1>
          <p className="text-muted-foreground">
            混合多个知识库文档，AI 自动生成新的综合性文档
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="w-3 h-3" />
            Remix Knowledge for New Ideas
          </Badge>
          {onOpenDrawer && (
            <Button variant="ghost" size="icon" onClick={onOpenDrawer}>
              <PanelRightOpen className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              选择源文档
              {selectedDocs.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  已选择 {selectedDocs.length} 篇
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <div className="grid gap-3">
                {mockDocuments.map((doc) => {
                  const isSelected = selectedDocs.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all",
                        isSelected
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                            isSelected
                              ? "border-teal-500 bg-teal-500"
                              : "border-muted-foreground"
                          )}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{doc.title}</h4>
                            {doc.isAIGenerated && (
                              <Badge
                                variant="outline"
                                className="text-xs gap-1 text-teal-600 border-teal-300"
                              >
                                <Sparkles className="w-3 h-3" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {doc.summary}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {doc.source === "jina" && "Jina 抓取"}
                              {doc.source === "rss" && "RSS 订阅"}
                              {doc.source === "remix" && "AI 重组"}
                            </Badge>
                            {doc.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              重组提示
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                生成要求
              </label>
              <Textarea
                placeholder="描述您希望如何混合这些文档...&#10;例如：创建一个关于 React 19 和 AI Agent 结合的技术指南"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32"
              />
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-medium">AI 助手建议</span>
              </div>
              <p className="text-xs text-muted-foreground">
                基于您选择的文档，建议生成一篇综合性指南，涵盖 React 19
                新特性与 AI Agent 设计模式的结合应用。
              </p>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={selectedDocs.length < 2 || !prompt.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  开始重组
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              生成进度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={generationProgress.progress} className="h-2" />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium mb-2">当前阶段</p>
                  <Badge variant="outline" className="text-sm">
                    {generationProgress.logs[generationProgress.logs.length - 1]?.message}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">处理日志</p>
                  <ScrollArea className="h-32 rounded-lg border p-3">
                    <div className="space-y-2">
                      {generationProgress.logs.map((log, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <span>{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-500" />
                生成结果预览
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI 生成
                </Badge>
                <Button variant="outline" size="sm" className="gap-1">
                  <Copy className="w-3 h-3" />
                  复制
                </Button>
                <Button size="sm" className="gap-1">
                  <Save className="w-3 h-3" />
                  保存到知识库
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 rounded-lg border bg-muted/30 p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {generatedContent}
                </pre>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">使用示例</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge>2 篇文档</Badge>
              </div>
              <p className="text-sm font-medium mb-1">技术对比分析</p>
              <p className="text-xs text-muted-foreground">
                混合 React 19 文档与 AI Agent 指南，生成技术选型建议。
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge>3 篇文档</Badge>
              </div>
              <p className="text-sm font-medium mb-1">综合教程</p>
              <p className="text-xs text-muted-foreground">
                组合多篇教程文档，创建完整的入门指南。
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge>4+ 篇文档</Badge>
              </div>
              <p className="text-sm font-medium mb-1">研究报告</p>
              <p className="text-xs text-muted-foreground">
                聚合多源信息，生成深度分析报告。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
