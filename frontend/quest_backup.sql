--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    category_id integer,
    text text NOT NULL,
    option_1 text NOT NULL,
    option_2 text NOT NULL,
    option_3 text NOT NULL,
    option_4 text NOT NULL,
    score_1 integer NOT NULL,
    score_2 integer NOT NULL,
    score_3 integer NOT NULL,
    score_4 integer NOT NULL,
    status character varying(10) DEFAULT 'ACTIVE'::character varying,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.questions_id_seq OWNER TO postgres;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questions (id, category_id, text, option_1, option_2, option_3, option_4, score_1, score_2, score_3, score_4, status, created_by, created_at, updated_at) FROM stdin;
58	2	TEST	TEST1	TEST2	TEST2	TEST4	20	15	20	15	active	13	2025-03-20 17:22:44.84121	2025-03-20 17:22:44.841213
59	2	TEST	TEST1	TEST2	TEST2	TEST4	20	15	20	15	active	13	2025-03-20 17:25:00.797575	2025-03-20 17:25:00.797579
42	1	How do you manage risk with stop-loss orders?	Use tight stop-loss to minimize losses	I don’t use stop-loss; I prefer riding the volatility	Always set stop-loss at the lowest risk level	Use wide stop-loss to allow some fluctuations	10	20	5	15	active	1	2025-03-10 08:23:48.093645	2025-03-20 17:34:07.167506
41	1	You notice a sudden price drop in your stock. What do you do?	Hold and wait for a recovery	Sell everything immediately to cut losses	Exit partially to minimize further risk	Buy aggressively to capitalize on the dip	15	5	10	20	active	1	2025-03-10 08:23:48.093645	2025-03-10 08:23:48.093645
43	1	What leverage ratio do you usually prefer?	No leverage, I prefer trading with cash only	5x leverage for controlled but aggressive trading	10x or more for maximum profit potential	2x leverage for moderate exposure	5	15	20	10	active	1	2025-03-10 08:23:48.093645	2025-03-10 08:23:48.093645
44	1	How do you react to market-moving news?	Trade quickly based on my risk assessment	Avoid trading during high volatility news events	Immediately take aggressive positions before confirmation	Wait for some confirmation before entering a trade	15	5	20	10	active	1	2025-03-10 08:23:48.093645	2025-03-10 08:23:48.093645
51	2	How do you plan your travel itinerary?	I create a rough plan but keep it flexible	I book one-way tickets and decide on the go	I strictly adhere to my budget	I book everything in advance but leave room for small changes	15	20	5	10	active	1	2025-03-10 08:24:00.593033	2025-03-10 08:24:00.593033
53	2	Do you purchase travel insurance before a trip?	Yes, but only for medical emergencies	No, I believe in taking risks	Yes, I ensure full coverage for my trip	Sometimes, only for extreme adventure trips	10	20	5	15	active	1	2025-03-10 08:24:00.593033	2025-03-10 08:24:00.593033
39	1	How do you react to market-moving news?	Trade quickly based on my risk assessment.	Avoid trading during high volatility news events	Immediately take aggressive positions before confirmation	Wait for some confirmation before entering a trade	15	5	20	10	active	1	2025-03-10 08:23:41.540927	2025-03-19 16:32:32.253879
40	1	What is your preferred trading strategy?	Swing trading with high-risk stocks	Long-term investing with minimal trades	High-frequency scalping and day trading.	Positional trading with mixed risk levels	15	5	20	10	active	1	2025-03-10 08:23:48.093645	2025-03-19 16:32:53.284222
54	2	Your flight gets canceled. What is your first reaction?	Wait for airline guidance before making any changes	Book the next available flight without checking the cost	Quickly look for alternative flights and adjust plans	Check for available options and consult travel support	5	20	15	10	active	1	2025-03-10 08:24:00.593033	2025-03-10 08:24:00.593033
48	3	The pitch is unpredictable. How do you adjust your game?	Adjust technique and focus on timing	Play extremely safe and wait for bad balls	Take risks and play aggressive shots	Play attacking but observe pitch behavior	10	5	20	15	active	1	2025-03-10 08:23:54.523739	2025-03-20 01:50:06.099488
46	3	Your team has to select a playing XI for a crucial match. What kind of players do you prefer?	Defensive players who focus on long innings	Aggressive all-rounders who can turn the game	Balanced team with a mix of aggression and stability	Experienced players with attacking mindset	5	20	10	15	active	1	2025-03-10 08:23:54.523739	2025-03-20 01:50:09.409162
47	3	As a captain, you need to set a field in the last over of a tense match. What is your strategy here ?	Keep a mix of attacking and defensive fielders	Go completely defensive to prevent runs	Set an ultra-attacking field to force a wicket	Spread the field and minimize risk	15	5	20	10	active	1	2025-03-10 08:23:54.523739	2025-03-20 01:50:10.780802
45	3	You are chasing a big target in the final overs. What is your approach?	Look for boundaries but play calculated shots around	Play defensively and hope for a mistake from the bowler	Go for big shots every ball	Rotate strike and wait for loose balls	15	5	20	10	active	1	2025-03-10 08:23:54.523739	2025-03-20 01:50:11.79503
49	3	You are the last wicket standing, and 10 runs are needed from 6 balls. What do you do?	Play cautiously and hope for extras	Swing for the fences and try to finish in 2 balls	Look for gaps and play calculated shots	Take singles and trust the tailender	5	20	15	10	active	1	2025-03-10 08:23:54.523739	2025-03-20 01:50:13.424165
50	2	You are planning a vacation. What type of destination excites you the most?	Trekking in the Himalayas	Skydiving in Dubai	A beach resort in the Maldives	A guided safari in Africa	15	20	5	10	active	1	2025-03-10 08:24:00.593033	2025-03-20 01:52:17.195675
52	2	How do you manage your travel expenses?	I spend freely but track my expenses	I set a budget but allow for minor splurges	I strictly adhere to my budget	I invest heavily in experiences, cost is not a concern	15	10	5	20	active	1	2025-03-10 08:24:00.593033	2025-03-20 17:33:47.75349
\.


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.questions_id_seq', 59, true);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: questions questions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

