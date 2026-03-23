-- Tabi Note (旅ノート) Database Schema
-- Run this in your Supabase SQL editor

-- Guides
CREATE TABLE guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  color_theme JSONB DEFAULT '{"cream":"#F5F0E8","stone":"#E2D9C8","moss":"#3D5240","rust":"#B85C38","ink":"#1A1A18","muted":"#7A7060","pale":"#FAF7F2","gold":"#C4963A"}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sections
CREATE TABLE sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  section_type TEXT NOT NULL CHECK (section_type IN ('cards', 'events', 'route', 'schedule')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subsections
CREATE TABLE subsections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Spots
CREATE TABLE spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subsection_id UUID REFERENCES subsections(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  google_maps_query TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Spot Badges
CREATE TABLE spot_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('dog','togo','dm','jp','hot','free','delivery','custom')),
  sort_order INT DEFAULT 0
);

-- Spot Metadata
CREATE TABLE spot_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE NOT NULL,
  icon TEXT NOT NULL DEFAULT '📍',
  value TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  date_label TEXT NOT NULL,
  day_label TEXT,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
);

-- Route Stops
CREATE TABLE route_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
);

-- Schedule Days
CREATE TABLE schedule_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Schedule Items
CREATE TABLE schedule_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_day_id UUID REFERENCES schedule_days(id) ON DELETE CASCADE NOT NULL,
  time_label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
);

-- RLS Policies
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsections ENABLE ROW LEVEL SECURITY;
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_items ENABLE ROW LEVEL SECURITY;

-- Public read for published guides
CREATE POLICY "Public can view published guides" ON guides
  FOR SELECT USING (published = true);

-- Owner full access
CREATE POLICY "Owner can manage guides" ON guides
  FOR ALL USING (auth.uid() = user_id);

-- Sections: public read via published guide, owner manage
CREATE POLICY "Public can view sections of published guides" ON sections
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM guides WHERE guides.id = sections.guide_id AND guides.published = true)
  );

CREATE POLICY "Owner can manage sections" ON sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM guides WHERE guides.id = sections.guide_id AND guides.user_id = auth.uid())
  );

-- Subsections
CREATE POLICY "Public can view subsections" ON subsections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sections JOIN guides ON guides.id = sections.guide_id
      WHERE sections.id = subsections.section_id AND guides.published = true
    )
  );

CREATE POLICY "Owner can manage subsections" ON subsections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM sections JOIN guides ON guides.id = sections.guide_id
      WHERE sections.id = subsections.section_id AND guides.user_id = auth.uid()
    )
  );

-- Spots
CREATE POLICY "Public can view spots" ON spots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM subsections
      JOIN sections ON sections.id = subsections.section_id
      JOIN guides ON guides.id = sections.guide_id
      WHERE subsections.id = spots.subsection_id AND guides.published = true
    )
  );

CREATE POLICY "Owner can manage spots" ON spots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM subsections
      JOIN sections ON sections.id = subsections.section_id
      JOIN guides ON guides.id = sections.guide_id
      WHERE subsections.id = spots.subsection_id AND guides.user_id = auth.uid()
    )
  );

-- Spot Badges
CREATE POLICY "Public can view badges" ON spot_badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM spots
      JOIN subsections ON subsections.id = spots.subsection_id
      JOIN sections ON sections.id = subsections.section_id
      JOIN guides ON guides.id = sections.guide_id
      WHERE spots.id = spot_badges.spot_id AND guides.published = true
    )
  );

CREATE POLICY "Owner can manage badges" ON spot_badges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM spots
      JOIN subsections ON subsections.id = spots.subsection_id
      JOIN sections ON sections.id = subsections.section_id
      JOIN guides ON guides.id = sections.guide_id
      WHERE spots.id = spot_badges.spot_id AND guides.user_id = auth.uid()
    )
  );

-- Spot Meta
CREATE POLICY "Public can view meta" ON spot_meta
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM spots
      JOIN subsections ON subsections.id = spots.subsection_id
      JOIN sections ON sections.id = subsections.section_id
      JOIN guides ON guides.id = sections.guide_id
      WHERE spots.id = spot_meta.spot_id AND guides.published = true
    )
  );

CREATE POLICY "Owner can manage meta" ON spot_meta
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM spots
      JOIN subsections ON subsections.id = spots.subsection_id
      JOIN sections ON sections.id = subsections.section_id
      JOIN guides ON guides.id = sections.guide_id
      WHERE spots.id = spot_meta.spot_id AND guides.user_id = auth.uid()
    )
  );

-- Events
CREATE POLICY "Public can view events" ON events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM sections JOIN guides ON guides.id = sections.guide_id WHERE sections.id = events.section_id AND guides.published = true)
  );

CREATE POLICY "Owner can manage events" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM sections JOIN guides ON guides.id = sections.guide_id WHERE sections.id = events.section_id AND guides.user_id = auth.uid())
  );

-- Route Stops
CREATE POLICY "Public can view route stops" ON route_stops
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM sections JOIN guides ON guides.id = sections.guide_id WHERE sections.id = route_stops.section_id AND guides.published = true)
  );

CREATE POLICY "Owner can manage route stops" ON route_stops
  FOR ALL USING (
    EXISTS (SELECT 1 FROM sections JOIN guides ON guides.id = sections.guide_id WHERE sections.id = route_stops.section_id AND guides.user_id = auth.uid())
  );

-- Schedule Days
CREATE POLICY "Public can view schedule days" ON schedule_days
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM sections JOIN guides ON guides.id = sections.guide_id WHERE sections.id = schedule_days.section_id AND guides.published = true)
  );

CREATE POLICY "Owner can manage schedule days" ON schedule_days
  FOR ALL USING (
    EXISTS (SELECT 1 FROM sections JOIN guides ON guides.id = sections.guide_id WHERE sections.id = schedule_days.section_id AND guides.user_id = auth.uid())
  );

-- Schedule Items
CREATE POLICY "Public can view schedule items" ON schedule_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM schedule_days
      JOIN sections ON sections.id = schedule_days.section_id
      JOIN guides ON guides.id = sections.guide_id
      WHERE schedule_days.id = schedule_items.schedule_day_id AND guides.published = true
    )
  );

CREATE POLICY "Owner can manage schedule items" ON schedule_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM schedule_days
      JOIN sections ON sections.id = schedule_days.section_id
      JOIN guides ON guides.id = sections.guide_id
      WHERE schedule_days.id = schedule_items.schedule_day_id AND guides.user_id = auth.uid()
    )
  );

-- Storage bucket for guide images
INSERT INTO storage.buckets (id, name, public) VALUES ('guide-images', 'guide-images', true);

CREATE POLICY "Anyone can view guide images" ON storage.objects
  FOR SELECT USING (bucket_id = 'guide-images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'guide-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'guide-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'guide-images' AND auth.uid()::text = (storage.foldername(name))[1]);
