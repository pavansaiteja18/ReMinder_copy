import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, CheckCircle, Link2, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Teams() {
  const [connected, setConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [message, setMessage] = useState("");
  const [autoNotify, setAutoNotify] = useState(true);
  const [logs, setLogs] = useState([
    {
      id: "1",
      message: "New task assigned: Design dashboard layout",
      timestamp: "2025-11-02T10:30:00Z",
      status: "sent",
    },
    {
      id: "2",
      message: "Task completed: Update documentation",
      timestamp: "2025-11-02T09:15:00Z",
      status: "sent",
    },
  ]);

  const handleConnect = () => {
    if (!webhookUrl.trim()) {
      toast.error("Please enter a webhook URL");
      return;
    }
    setConnected(true);
    toast.success("Connected to Microsoft Teams");
  };

  const handleDisconnect = () => {
    setConnected(false);
    setWebhookUrl("");
    toast.info("Disconnected from Microsoft Teams");
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    const newLog = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    
    setLogs([newLog, ...logs]);
    setMessage("");
    toast.success("Message sent to Teams");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          Microsoft Teams Integration
        </h1>
        <p className="text-muted-foreground mt-1">
          Connect and send notifications to your Teams channels
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Connection Status
              </CardTitle>
              <CardDescription>
                {connected
                  ? "Your Teams workspace is connected"
                  : "Connect your Microsoft Teams workspace"}
              </CardDescription>
            </div>
            {connected ? (
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="gap-2"
              >
                <Unlink className="h-4 w-4" />
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleConnect} className="btn-gradient gap-2">
                <Link2 className="h-4 w-4" />
                Connect
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!connected && (
            <div className="space-y-2">
              <Label htmlFor="webhook">Incoming Webhook URL</Label>
              <Input
                id="webhook"
                placeholder="https://outlook.office.com/webhook/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Create an incoming webhook in your Teams channel settings
              </p>
            </div>
          )}

          {connected && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-500 font-medium">
                Connected to Microsoft Teams
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {connected && (
        <>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-notify on new tasks</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send Teams notification when tasks are created
                  </p>
                </div>
                <Switch
                  checked={autoNotify}
                  onCheckedChange={setAutoNotify}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Message
              </CardTitle>
              <CardDescription>
                Send a custom message to your Teams channel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleSendMessage} className="btn-gradient">
                <Send className="h-4 w-4 mr-2" />
                Send to Teams
              </Button>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>Recent messages sent to Teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-sidebar/50"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
}
