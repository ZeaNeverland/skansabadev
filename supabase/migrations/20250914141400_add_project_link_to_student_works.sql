-- Add project_link column to student_works table
ALTER TABLE public.student_works
ADD COLUMN IF NOT EXISTS project_link TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN public.student_works.project_link IS 'Link to the project (e.g., GitHub repository, live demo)';
