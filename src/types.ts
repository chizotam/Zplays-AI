export interface SocialPostGoal {
  id: string;
  label: string;
  description: string;
}

export interface SocialPostResult {
  caption: string;
  imagePrompt: string;
  warning?: string;
}

export interface AutomationWorkflow {
  id: string;
  title: string;
  description: string;
  trigger: string;
  status: "active" | "paused";
  category: "customer" | "staff" | "inventory";
}

export interface SavedCafeConfig {
  sourdoughStatus: string;
  openHours: string;
  veganOptions: string;
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "owner" | "ai-draft";
  text: string;
  timestamp: string;
  approved?: boolean;
}

export interface MockCustomerScenario {
  id: string;
  title: string;
  senderName: string;
  senderAvatar: string;
  timeLabel: string;
  queryText: string;
}

export interface AnalyticsMetric {
  label: string;
  value: string | number;
  changeValue: string;
  isPositive: boolean;
  colorClass: string;
}
