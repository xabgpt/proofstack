export interface User {
  id: string;
  email: string;
  name: string;
  username: string | null;
  bio: string;
  title: string;
  subscription_status: "free" | "pro";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  client_name: string;
  client_email: string;
  date_completed: string;
  verified: boolean;
  verified_at: string | null;
  verification_token: string;
  token_expires_at: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  is_public: boolean;
  view_count: number;
}
