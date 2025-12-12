-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.world_happiness (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  ranking integer,
  country text NOT NULL,
  regional_indicator text,
  happiness_score numeric NOT NULL,
  gdp_per_capita numeric,
  social_support numeric,
  healthy_life_expectancy numeric,
  freedom_to_make_life_choices numeric,
  generosity numeric,
  perceptions_of_corruption numeric,
  year integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT world_happiness_pkey PRIMARY KEY (id)
);