export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  order_id: string;
  user_id: string;
  customer_name: string;
  customer_location: string | null;
  rating: number;
  body: string;
  status: ReviewStatus;
  display_on_home: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewInput {
  order_id: string;
  user_id: string;
  customer_name: string;
  customer_location?: string;
  rating: number;
  body: string;
}

export interface UpdateReviewInput {
  status?: ReviewStatus;
  display_on_home?: boolean;
}
