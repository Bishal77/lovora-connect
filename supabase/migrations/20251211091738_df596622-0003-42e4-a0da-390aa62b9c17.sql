
-- Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE public.swipe_action AS ENUM ('like', 'dislike', 'superlike');
CREATE TYPE public.verification_status AS ENUM ('none', 'pending', 'verified', 'rejected');
CREATE TYPE public.relationship_goal AS ENUM ('casual', 'serious', 'marriage', 'friendship');
CREATE TYPE public.education_level AS ENUM ('high_school', 'bachelors', 'masters', 'doctorate', 'other');
CREATE TYPE public.live_session_type AS ENUM ('text', 'audio', 'video');
CREATE TYPE public.report_reason AS ENUM ('spam', 'inappropriate', 'harassment', 'fake_profile', 'underage', 'other');

-- User Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  full_name TEXT NOT NULL,
  display_name TEXT,
  date_of_birth DATE NOT NULL,
  gender gender_type NOT NULL,
  bio TEXT,
  city TEXT,
  country TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  occupation TEXT,
  company TEXT,
  education education_level,
  school TEXT,
  relationship_goal relationship_goal DEFAULT 'casual',
  height_cm INTEGER,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verification_status verification_status DEFAULT 'none',
  is_premium BOOLEAN DEFAULT false,
  swipe_mode_enabled BOOLEAN DEFAULT true,
  serious_mode_enabled BOOLEAN DEFAULT false,
  live_mode_enabled BOOLEAN DEFAULT true,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Photos
CREATE TABLE public.user_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Interests
CREATE TABLE public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  icon TEXT
);

CREATE TABLE public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, interest_id)
);

-- User Preferences (for matching)
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 50,
  preferred_gender gender_type[],
  max_distance_km INTEGER DEFAULT 50,
  relationship_goals relationship_goal[],
  show_verified_only BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Serious Mode Extended Profile
CREATE TABLE public.serious_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  religion TEXT,
  caste TEXT,
  mother_tongue TEXT,
  family_type TEXT,
  father_occupation TEXT,
  mother_occupation TEXT,
  siblings INTEGER DEFAULT 0,
  family_values TEXT,
  salary_range TEXT,
  assets TEXT,
  partner_age_min INTEGER,
  partner_age_max INTEGER,
  partner_height_min INTEGER,
  partner_height_max INTEGER,
  partner_education education_level[],
  partner_occupation TEXT[],
  partner_religion TEXT[],
  expectations TEXT,
  about_family TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Swipes
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  swiped_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action swipe_action NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(swiper_id, swiped_id)
);

-- Matches
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  last_message_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user1_id, user2_id)
);

-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Live Sessions
CREATE TABLE public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type live_session_type NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Live Queue (users waiting for random match)
CREATE TABLE public.live_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  session_type live_session_type NOT NULL,
  preferred_gender gender_type[],
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Blocks
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- Reports
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reported_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason report_reason NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Interests Express (for Serious Mode)
CREATE TABLE public.interest_expressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(sender_id, receiver_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serious_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_expressions ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User Photos policies
CREATE POLICY "Users can view all photos" ON public.user_photos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own photos" ON public.user_photos FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Interests policies (public read)
CREATE POLICY "Anyone can view interests" ON public.interests FOR SELECT TO authenticated USING (true);

-- User Interests policies
CREATE POLICY "Users can view all user interests" ON public.user_interests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own interests" ON public.user_interests FOR ALL TO authenticated USING (auth.uid() = user_id);

-- User Preferences policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON public.user_preferences FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Serious Profiles policies
CREATE POLICY "Users can view serious profiles" ON public.serious_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own serious profile" ON public.serious_profiles FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Swipes policies
CREATE POLICY "Users can view own swipes" ON public.swipes FOR SELECT TO authenticated USING (auth.uid() = swiper_id);
CREATE POLICY "Users can create swipes" ON public.swipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = swiper_id);

-- Matches policies
CREATE POLICY "Users can view own matches" ON public.matches FOR SELECT TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT TO authenticated 
USING (EXISTS (SELECT 1 FROM public.matches WHERE id = match_id AND (user1_id = auth.uid() OR user2_id = auth.uid())));

-- Messages policies
CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.conversations c
  JOIN public.matches m ON c.match_id = m.id
  WHERE c.id = conversation_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
));
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sender_id AND EXISTS (
  SELECT 1 FROM public.conversations c
  JOIN public.matches m ON c.match_id = m.id
  WHERE c.id = conversation_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
));
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() = sender_id);

-- Live Sessions policies
CREATE POLICY "Users can view own live sessions" ON public.live_sessions FOR SELECT TO authenticated 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create live sessions" ON public.live_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user1_id);
CREATE POLICY "Users can update own live sessions" ON public.live_sessions FOR UPDATE TO authenticated 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Live Queue policies
CREATE POLICY "Users can view queue" ON public.live_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own queue entry" ON public.live_queue FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Blocks policies
CREATE POLICY "Users can view own blocks" ON public.blocks FOR SELECT TO authenticated USING (auth.uid() = blocker_id);
CREATE POLICY "Users can manage own blocks" ON public.blocks FOR ALL TO authenticated USING (auth.uid() = blocker_id);

-- Reports policies
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id);

-- User Roles policies
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Interest Expressions policies
CREATE POLICY "Users can view own expressions" ON public.interest_expressions FOR SELECT TO authenticated 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send expressions" ON public.interest_expressions FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can respond to expressions" ON public.interest_expressions FOR UPDATE TO authenticated USING (auth.uid() = receiver_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, date_of_birth, gender)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'New User'),
    COALESCE((new.raw_user_meta_data ->> 'date_of_birth')::date, '2000-01-01'),
    COALESCE((new.raw_user_meta_data ->> 'gender')::gender_type, 'prefer_not_to_say')
  );
  
  INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'user');
  
  INSERT INTO public.user_preferences (user_id) VALUES (new.id);
  
  RETURN new;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check for match
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  mutual_like BOOLEAN;
  new_match_id UUID;
BEGIN
  IF NEW.action = 'like' OR NEW.action = 'superlike' THEN
    SELECT EXISTS (
      SELECT 1 FROM public.swipes
      WHERE swiper_id = NEW.swiped_id
      AND swiped_id = NEW.swiper_id
      AND (action = 'like' OR action = 'superlike')
    ) INTO mutual_like;
    
    IF mutual_like THEN
      INSERT INTO public.matches (user1_id, user2_id)
      VALUES (LEAST(NEW.swiper_id, NEW.swiped_id), GREATEST(NEW.swiper_id, NEW.swiped_id))
      ON CONFLICT DO NOTHING
      RETURNING id INTO new_match_id;
      
      IF new_match_id IS NOT NULL THEN
        INSERT INTO public.conversations (match_id) VALUES (new_match_id);
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for match creation
CREATE TRIGGER on_swipe_check_match
  AFTER INSERT ON public.swipes
  FOR EACH ROW EXECUTE FUNCTION public.check_and_create_match();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Timestamp triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_serious_profiles_updated_at BEFORE UPDATE ON public.serious_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_sessions;

-- Insert default interests
INSERT INTO public.interests (name, category, icon) VALUES
('Travel', 'lifestyle', '✈️'),
('Music', 'entertainment', '🎵'),
('Movies', 'entertainment', '🎬'),
('Reading', 'lifestyle', '📚'),
('Fitness', 'health', '💪'),
('Yoga', 'health', '🧘'),
('Cooking', 'lifestyle', '👨‍🍳'),
('Photography', 'creative', '📷'),
('Art', 'creative', '🎨'),
('Gaming', 'entertainment', '🎮'),
('Sports', 'health', '⚽'),
('Dancing', 'entertainment', '💃'),
('Hiking', 'outdoor', '🥾'),
('Coffee', 'food', '☕'),
('Wine', 'food', '🍷'),
('Pets', 'lifestyle', '🐕'),
('Fashion', 'lifestyle', '👗'),
('Tech', 'professional', '💻'),
('Meditation', 'health', '🧘‍♂️'),
('Volunteering', 'social', '🤝');
