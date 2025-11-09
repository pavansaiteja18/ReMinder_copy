import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText, Search } from "lucide-react";
import { toast } from "sonner";
import { RecallResults } from "@/components/recall/RecallResults";
import api from "@/api/axios"; // ✅ using your axios instance

export default function Recall() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/recall/search", { query });
      setResults(data);
    } catch (error: any) {
      console.error("Recall search error:", error);
      toast.error(error.response?.data?.message || "Failed to search recall");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquareText className="h-8 w-8 text-primary" />
          Recall
        </h1>
        <p className="text-muted-foreground mt-1">
          Search through your past decisions, meetings, and conversations
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
          <CardDescription>
            Example: "What did we decide about the API launch?" or "What tasks are due this week?"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="What did we decide about..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="btn-gradient"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && <RecallResults results={results} />}
    </div>
  );
}
