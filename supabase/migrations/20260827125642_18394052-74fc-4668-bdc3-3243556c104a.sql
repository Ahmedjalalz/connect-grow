CREATE TYPE public.booking_status AS ENUM ('requested','confirmed','completed','cancelled');

CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  topic text,
  team_size text,
  timezone text,
  notes text,
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 15,
  status public.booking_status NOT NULL DEFAULT 'requested',
  CONSTRAINT bookings_unique_slot UNIQUE (slot_date, slot_time)
);

GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request a consultation"
  ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can view bookings"
  ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER bookings_set_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Publicly readable view of taken slots so the calendar can grey them out
-- without exposing who booked them.
CREATE OR REPLACE FUNCTION public.taken_slots(_from date, _to date)
RETURNS TABLE (slot_date date, slot_time text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.slot_date, b.slot_time
  FROM public.bookings b
  WHERE b.slot_date BETWEEN _from AND _to
    AND b.status <> 'cancelled';
$$;

GRANT EXECUTE ON FUNCTION public.taken_slots(date, date) TO anon, authenticated;

-- Role bootstrap: the first account to sign up becomes admin, everyone else a user.
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing_count integer;
BEGIN
  SELECT count(*) INTO existing_count FROM public.user_roles;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN existing_count = 0 THEN 'admin'::app_role ELSE 'user'::app_role END)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();