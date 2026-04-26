CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  education_level TEXT,
  field_of_study TEXT,
  experience TEXT,
  self_taught TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  digital_level TEXT,
  digital_skills TEXT[] NOT NULL DEFAULT '{}',
  has_certifications BOOLEAN NOT NULL DEFAULT false,
  sectors_matched TEXT[] NOT NULL DEFAULT '{}',
  top_match_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_country ON public.profiles(country);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a profile"
  ON public.profiles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read aggregate profile data"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);