-- Create storage buckets for Email Radar

-- Create a bucket for analysis exports (text files, reports, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'analysis-exports',
  'analysis-exports', 
  false, -- Private bucket
  5242880, -- 5MB limit
  ARRAY['text/plain', 'text/csv', 'application/json', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Create a bucket for user templates
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'email-templates',
  'email-templates',
  false, -- Private bucket
  1048576, -- 1MB limit
  ARRAY['text/plain', 'text/markdown', 'application/json']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for analysis-exports bucket
CREATE POLICY "Users can upload to their own folder in analysis-exports" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'analysis-exports' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can view their own files in analysis-exports" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'analysis-exports' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can delete their own files in analysis-exports" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'analysis-exports' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Storage policies for email-templates bucket
CREATE POLICY "Users can upload to their own folder in email-templates" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'email-templates' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can view their own templates" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'email-templates' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can update their own templates" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'email-templates' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can delete their own templates" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'email-templates' AND 
    auth.uid()::text = (string_to_array(name, '/'))[1]
  ); 