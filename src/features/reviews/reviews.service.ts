import { supabase } from "@/lib/supabase";
import type { Review, CreateReviewInput, UpdateReviewInput } from "./reviews.types";

class ReviewsService {
  private readonly table = "reviews";

  /** Fetch reviews marked for home-page display */
  async getDisplayReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("display_on_home", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching display reviews:", error);
      throw error;
    }

    console.debug("[reviews] getDisplayReviews →", data);
    return data || [];
  }

  /** Fetch all reviews (admin only) */
  async getAllReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all reviews:", error);
      throw error;
    }
    return data || [];
  }

  /** Check whether the user has already reviewed a specific order */
  async hasReviewedOrder(orderId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.table)
      .select("id")
      .eq("order_id", orderId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error checking review:", error);
      return false;
    }
    return !!data;
  }

  /** Customer submits a review */
  async createReview(input: CreateReviewInput): Promise<Review> {
    const { data, error } = await supabase
      .from(this.table)
      .insert({
        order_id: input.order_id,
        user_id: input.user_id,
        customer_name: input.customer_name,
        customer_location: input.customer_location ?? null,
        rating: input.rating,
        body: input.body,
        status: "approved",
        display_on_home: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      throw error;
    }
    return data;
  }

  /** Admin: approve / reject and toggle display */
  async updateReview(id: string, updates: UpdateReviewInput): Promise<Review> {
    const { data, error } = await supabase
      .from(this.table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating review:", error);
      throw error;
    }
    return data;
  }

  /** Admin: delete a review */
  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq("id", id);

    if (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }
}

export const reviewsService = new ReviewsService();
