import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
 1
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseUrl = 'https://wawyxuzsewurcvaryomf.supabase.co';
  private supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd3l4dXpzZXd1cmN2YXJ5b21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjA5NDAsImV4cCI6MjA1NjMzNjk0MH0.7Q0iFVXAV7BcstWOuGUfIGFU95q5zAxb2y3PM3k3VjE';
 
  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
  }
 
  async uploadImage(file: File, bucket: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(`imagenes/${file.name}`, file, { upsert: true });
 
    if (error) throw error;
    return data;
  }
 
  async getPublicUrl(bucket: string, path: string) {
    return this.supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
  
}