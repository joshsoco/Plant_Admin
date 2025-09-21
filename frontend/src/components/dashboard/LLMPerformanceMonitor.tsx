import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, CheckCircle, Clock, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface LLMOutput {
  id: string;
  plantName: string;
  confidence: number;
  generatedSummary: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  generatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  processingTime: number; // in seconds
}

export function LLMPerformanceMonitor() {
  const llmOutputs: LLMOutput[] = [
    {
      id: "LLM-001",
      plantName: "Monstera Deliciosa",
      confidence: 96.7,
      generatedSummary: "Also known as Swiss Cheese Plant, this popular houseplant features large, glossy leaves with distinctive holes (fenestrations). Native to Central America, it's prized for its easy care and dramatic foliage.",
      status: "approved",
      generatedAt: "10 minutes ago",
      reviewedBy: "Dr. Sarah Chen",
      reviewedAt: "5 minutes ago",
      processingTime: 2.3
    },
    {
      id: "LLM-002", 
      plantName: "Fiddle Leaf Fig",
      confidence: 94.2,
      generatedSummary: "A trendy indoor plant with large, violin-shaped leaves. Requires bright, indirect light and consistent watering. Known for being somewhat finicky but rewarding when properly cared for.",
      status: "pending",
      generatedAt: "15 minutes ago",
      processingTime: 1.8
    },
    {
      id: "LLM-003",
      plantName: "Snake Plant",
      confidence: 98.1,
      generatedSummary: "Extremely hardy succulent with upright, sword-like leaves featuring yellow margins. Perfect for beginners as it tolerates neglect and low light conditions. Also known as Sansevieria.",
      status: "under_review",
      generatedAt: "20 minutes ago",
      processingTime: 1.5
    },
    {
      id: "LLM-004",
      plantName: "Peace Lily",
      confidence: 91.5,
      generatedSummary: "Elegant flowering houseplant with dark green leaves and white spoon-shaped blooms. Prefers consistent moisture and can indicate when it needs water by drooping slightly.",
      status: "rejected",
      generatedAt: "25 minutes ago",
      reviewedBy: "Dr. Michael Torres",
      reviewedAt: "18 minutes ago",
      processingTime: 3.1
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'under_review':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <ThumbsDown className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "text-green-600 dark:text-green-400";
    if (confidence >= 85) return "text-blue-600 dark:text-blue-400";
    return "text-yellow-600 dark:text-yellow-400";
  };

  const averageProcessingTime = llmOutputs.reduce((acc, output) => acc + output.processingTime, 0) / llmOutputs.length;
  const approvalRate = (llmOutputs.filter(output => output.status === 'approved').length / llmOutputs.length) * 100;

  return (
    <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
          <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          LLM Performance Monitor
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground dark:text-gray-400">Avg Processing:</span>
            <span className="font-medium text-foreground dark:text-white">{averageProcessingTime.toFixed(1)}s</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground dark:text-gray-400">Approval Rate:</span>
            <span className="font-medium text-green-600 dark:text-green-400">{approvalRate.toFixed(1)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {llmOutputs.map((output) => (
            <div 
              key={output.id} 
              className="border border-border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground dark:text-white">{output.plantName}</h4>
                    <span className={`text-sm font-medium ${getConfidenceColor(output.confidence)}`}>
                      {output.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-gray-400">
                    <span>Generated {output.generatedAt}</span>
                    <span>⚡ {output.processingTime}s</span>
                  </div>
                </div>
                {getStatusBadge(output.status)}
              </div>
              
              <p className="text-sm text-foreground dark:text-gray-200 mb-3 leading-relaxed">
                {output.generatedSummary}
              </p>
              
              {output.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    Review Later
                  </Button>
                </div>
              )}
              
              {(output.status === 'approved' || output.status === 'rejected') && output.reviewedBy && (
                <div className="text-xs text-muted-foreground dark:text-gray-400 mt-2">
                  Reviewed by {output.reviewedBy} • {output.reviewedAt}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground dark:text-gray-400">
              Showing latest 4 LLM outputs
            </span>
            <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm">
              View all outputs →
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}