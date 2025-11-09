import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface RecallResultsProps {
  results: {
    answer: string;
    sources: Array<{
      id: string;
      title: string;
      date: string;
      excerpt: string;
    }>;
  };
}

export const RecallResults = ({ results }: RecallResultsProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showSources, setShowSources] = useState(false);

  // 🧠 Typing animation effect
  useEffect(() => {
    if (!results?.answer) return;
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + results.answer.charAt(i));
      i++;
      if (i >= results.answer.length) clearInterval(interval);
    }, 20); // adjust speed
    return () => clearInterval(interval);
  }, [results.answer]);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🧠 AI Answer Card */}
      <Card className="card-elevated bg-gradient-to-r from-primary/20 via-background to-primary/10 border border-primary/30 shadow-glow">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
             Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p
            className="text-foreground leading-relaxed whitespace-pre-line font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {displayedText || "Thinking..."}
          </motion.p>
        </CardContent>
      </Card>

      {/* 📚 Sources Section */}
      {results.sources && results.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card-elevated border-primary/20">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">Sources</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-primary"
                onClick={() => setShowSources(!showSources)}
              >
                {showSources ? (
                  <>
                    Hide <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardHeader>

            {showSources && (
              <CardContent className="space-y-3">
                {results.sources.map((source) => (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="hover:shadow-glow transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base mb-1 text-foreground">
                              {source.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {source.excerpt}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {source.date}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </CardContent>
            )}
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};
