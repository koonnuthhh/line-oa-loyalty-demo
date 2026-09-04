--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-07-18 16:24:13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
--SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3440 (class 1262 OID 16384)
-- Name: LineOA_Hotspot; Type: DATABASE; Schema: -; Owner: postgres
--


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
--SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 228 (class 1255 OID 16385)
-- Name: ensure_branch_for_log(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ensure_branch_for_log() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM branch WHERE branch_code = NEW.branch_code
    ) THEN
        RAISE EXCEPTION 'branch_code % not found. Please create it in the branch table first.', NEW.branch_code;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ensure_branch_for_log() OWNER TO postgres;

--
-- TOC entry 229 (class 1255 OID 16386)
-- Name: ensure_branch_wifi_for_usage(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ensure_branch_wifi_for_usage() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM branch WHERE branch_id = NEW.branch_id) THEN
        RAISE EXCEPTION 'branch_id % not found. Please create it in the branch table first.', NEW.branch_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM wifi_profile WHERE wifi_profile_id = NEW.wifi_profile_id) THEN
        RAISE EXCEPTION 'wifi_profile_id % not found. Please create it in the wifi_profile table first.', NEW.wifi_profile_id;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ensure_branch_wifi_for_usage() OWNER TO postgres;

--
-- TOC entry 230 (class 1255 OID 16387)
-- Name: ensure_lineoa_for_admin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ensure_lineoa_for_admin() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    existing_id INT;
BEGIN
    SELECT lineoa_id INTO existing_id
    FROM lineoa WHERE lineoa_uid = NEW.lineoa_uid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'lineoa_uid % not found. Please create it in the lineoa table first.', NEW.lineoa_uid;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ensure_lineoa_for_admin() OWNER TO postgres;

--
-- TOC entry 231 (class 1255 OID 16388)
-- Name: ensure_lineoa_for_branch(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ensure_lineoa_for_branch() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    existing_id INT;
BEGIN
    SELECT lineoa_id INTO existing_id
    FROM lineoa WHERE lineoa_id = NEW.lineoa_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'lineoa_id % not found. Please create it in the lineoa table first.', NEW.lineoa_id;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ensure_lineoa_for_branch() OWNER TO postgres;

--
-- TOC entry 233 (class 1255 OID 16504)
-- Name: ensure_lineoa_for_sale(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ensure_lineoa_for_sale() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    exists_check INT;
BEGIN
    SELECT lineoa_id INTO exists_check
    FROM lineoa
    WHERE lineoa_id = NEW.lineoa_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'lineoa_id % not found. Please create it in the lineoa table first.', NEW.lineoa_id;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ensure_lineoa_for_sale() OWNER TO postgres;

--
-- TOC entry 232 (class 1255 OID 16389)
-- Name: ensure_wifi_profile_for_credential(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ensure_wifi_profile_for_credential() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM wifi_profile WHERE wifi_profile_id = NEW.wifi_profile_id
    ) THEN
        RAISE EXCEPTION 'wifi_profile_id % not found. Please create it in the wifi_profile table first.', NEW.wifi_profile_id;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.ensure_wifi_profile_for_credential() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16390)
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wifihotspot_admin (
    admin_id integer NOT NULL,
    admin_uid character varying,
    lineoa_uid character varying(150)
);


ALTER TABLE public.wifihotspot_admin OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16395)
-- Name: admin_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_admin_id_seq OWNER TO postgres;

--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 215
-- Name: admin_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_admin_id_seq OWNED BY public.wifihotspot_admin.admin_id;


--
-- TOC entry 216 (class 1259 OID 16396)
-- Name: branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wifihotspot_branch (
    branch_id integer NOT NULL,
    branch_code character varying NOT NULL,
    branch_name character varying NOT NULL,
    branch_isactive boolean,
    lineoa_id integer
);


ALTER TABLE public.wifihotspot_branch OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16401)
-- Name: branch_branch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branch_branch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branch_branch_id_seq OWNER TO postgres;

--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 217
-- Name: branch_branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branch_branch_id_seq OWNED BY public.wifihotspot_branch.branch_id;


--
-- TOC entry 218 (class 1259 OID 16402)
-- Name: lineoa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wifihotspot_lineoa (
    lineoa_id integer NOT NULL,
    lineoa_uid character varying(150) NOT NULL,
    lineoa_name character varying(100) NOT NULL,
    lineoa_isactive boolean,
    lineoa_remark character varying(200)
);


ALTER TABLE public.wifihotspot_lineoa OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16405)
-- Name: lineoa_lineoa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lineoa_lineoa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lineoa_lineoa_id_seq OWNER TO postgres;

--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 219
-- Name: lineoa_lineoa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lineoa_lineoa_id_seq OWNED BY public.wifihotspot_lineoa.lineoa_id;


--
-- TOC entry 220 (class 1259 OID 16406)
-- Name: log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wifihotspot_log (
    log_id integer NOT NULL,
    date date,
    "time" time without time zone,
    wifi_username character varying NOT NULL,
    lineoa_name character varying NOT NULL,
    branch_name character varying NOT NULL,
    lineoa_uid character varying(150) NOT NULL,
    user_uid character varying NOT NULL,
    branch_code character varying,
    user_name character varying NOT NULL
);


ALTER TABLE public.wifihotspot_log OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16411)
-- Name: log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.log_log_id_seq OWNER TO postgres;

--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 221
-- Name: log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_log_id_seq OWNED BY public.wifihotspot_log.log_id;


--
-- TOC entry 222 (class 1259 OID 16412)
-- Name: wifi_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wifihotspot_wifi_profile (
    wifi_profile_id integer NOT NULL,
    wifi_profile_setting character varying NOT NULL,
    wifi_profile_speed_limit character varying NOT NULL,
    wifi_profile_uptime_limit character varying NOT NULL
);


ALTER TABLE public.wifihotspot_wifi_profile OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16417)
-- Name: profile_wifi_wifi_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profile_wifi_wifi_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_wifi_wifi_profile_id_seq OWNER TO postgres;

--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 223
-- Name: profile_wifi_wifi_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profile_wifi_wifi_profile_id_seq OWNED BY public.wifihotspot_wifi_profile.wifi_profile_id;


--
-- TOC entry 227 (class 1259 OID 16492)
-- Name: sale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aurora_sale (
    sale_id integer NOT NULL,
    sale_uid character varying(255),
    sale_displayname character varying(255),
    lineoa_id integer
);


ALTER TABLE public.aurora_sale OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16418)
-- Name: wifi_credential; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wifihotspot_wifi_credential (
    wifi_credential_id integer NOT NULL,
    wifi_credential_username character varying NOT NULL,
    wifi_credential_password character varying NOT NULL,
    wifi_credential_isactive boolean,
    wifi_profile_id integer NOT NULL
);


ALTER TABLE public.wifihotspot_wifi_credential OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16423)
-- Name: wifi_credential_wifi_credential_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wifi_credential_wifi_credential_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wifi_credential_wifi_credential_id_seq OWNER TO postgres;

--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 225
-- Name: wifi_credential_wifi_credential_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wifi_credential_wifi_credential_id_seq OWNED BY public.wifihotspot_wifi_credential.wifi_credential_id;


--
-- TOC entry 226 (class 1259 OID 16424)
-- Name: wifi_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wifihotspot_wifi_usage (
    branch_id integer NOT NULL,
    wifi_profile_id integer NOT NULL,
    wifi_usage_count integer
);


ALTER TABLE public.wifihotspot_wifi_usage OWNER TO postgres;

--
-- TOC entry 3238 (class 2604 OID 16427)
-- Name: admin admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_admin ALTER COLUMN admin_id SET DEFAULT nextval('public.admin_admin_id_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 16428)
-- Name: branch branch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_branch ALTER COLUMN branch_id SET DEFAULT nextval('public.branch_branch_id_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 16429)
-- Name: lineoa lineoa_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_lineoa ALTER COLUMN lineoa_id SET DEFAULT nextval('public.lineoa_lineoa_id_seq'::regclass);


--
-- TOC entry 3241 (class 2604 OID 16430)
-- Name: log log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_log ALTER COLUMN log_id SET DEFAULT nextval('public.log_log_id_seq'::regclass);


--
-- TOC entry 3243 (class 2604 OID 16431)
-- Name: wifi_credential wifi_credential_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_wifi_credential ALTER COLUMN wifi_credential_id SET DEFAULT nextval('public.wifi_credential_wifi_credential_id_seq'::regclass);


--
-- TOC entry 3242 (class 2604 OID 16432)
-- Name: wifi_profile wifi_profile_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_wifi_profile ALTER COLUMN wifi_profile_id SET DEFAULT nextval('public.profile_wifi_wifi_profile_id_seq'::regclass);


--
-- TOC entry 3421 (class 0 OID 16390)
-- Dependencies: 214
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3423 (class 0 OID 16396)
-- Dependencies: 216
-- Data for Name: branch; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3425 (class 0 OID 16402)
-- Dependencies: 218
-- Data for Name: lineoa; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3427 (class 0 OID 16406)
-- Dependencies: 220
-- Data for Name: log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3434 (class 0 OID 16492)
-- Dependencies: 227
-- Data for Name: sale; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3431 (class 0 OID 16418)
-- Dependencies: 224
-- Data for Name: wifi_credential; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3429 (class 0 OID 16412)
-- Dependencies: 222
-- Data for Name: wifi_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3433 (class 0 OID 16424)
-- Dependencies: 226
-- Data for Name: wifi_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 215
-- Name: admin_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_admin_id_seq', 1, false);


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 217
-- Name: branch_branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branch_branch_id_seq', 1, false);


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 219
-- Name: lineoa_lineoa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lineoa_lineoa_id_seq', 147, true);


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 221
-- Name: log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_log_id_seq', 54, true);


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 223
-- Name: profile_wifi_wifi_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profile_wifi_wifi_profile_id_seq', 1, false);


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 225
-- Name: wifi_credential_wifi_credential_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wifi_credential_wifi_credential_id_seq', 1, false);


--
-- TOC entry 3245 (class 2606 OID 16434)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (admin_id);


--
-- TOC entry 3247 (class 2606 OID 16436)
-- Name: branch branch_branch_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_branch
    ADD CONSTRAINT branch_branch_code_key UNIQUE (branch_code);


--
-- TOC entry 3249 (class 2606 OID 16438)
-- Name: branch branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_branch
    ADD CONSTRAINT branch_pkey PRIMARY KEY (branch_id);


--
-- TOC entry 3251 (class 2606 OID 16440)
-- Name: lineoa lineoa_lineoa_uid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_lineoa
    ADD CONSTRAINT lineoa_lineoa_uid_key UNIQUE (lineoa_uid);


--
-- TOC entry 3253 (class 2606 OID 16442)
-- Name: lineoa lineoa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_lineoa
    ADD CONSTRAINT lineoa_pkey PRIMARY KEY (lineoa_id);


--
-- TOC entry 3257 (class 2606 OID 16444)
-- Name: log log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_log
    ADD CONSTRAINT log_pkey PRIMARY KEY (log_id);


--
-- TOC entry 3259 (class 2606 OID 16446)
-- Name: wifi_profile profile_wifi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_wifi_profile
    ADD CONSTRAINT profile_wifi_pkey PRIMARY KEY (wifi_profile_id);


--
-- TOC entry 3265 (class 2606 OID 16498)
-- Name: sale sale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aurora_sale
    ADD CONSTRAINT sale_pkey PRIMARY KEY (sale_id);


--
-- TOC entry 3255 (class 2606 OID 16448)
-- Name: lineoa uk_lineoa_uid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_lineoa
    ADD CONSTRAINT uk_lineoa_uid UNIQUE (lineoa_uid);


--
-- TOC entry 3261 (class 2606 OID 16450)
-- Name: wifi_credential wifi_credential_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_wifi_credential
    ADD CONSTRAINT wifi_credential_pkey PRIMARY KEY (wifi_profile_id, wifi_credential_id);


--
-- TOC entry 3263 (class 2606 OID 16452)
-- Name: wifi_usage wifi_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_wifi_usage
    ADD CONSTRAINT wifi_usage_pkey PRIMARY KEY (branch_id, wifi_profile_id);


--
-- TOC entry 3273 (class 2620 OID 16453)
-- Name: admin trg_admin_insert_lineoa; Type: TRIGGER; Schema: public; Owner: postgres
--

--CREATE TRIGGER trg_admin_insert_lineoa BEFORE INSERT ON public.wifihotspot_admin FOR EACH ROW EXECUTE FUNCTION public.ensure_lineoa_for_admin();


--
-- TOC entry 3274 (class 2620 OID 16454)
-- Name: branch trg_branch_insert_lineoa; Type: TRIGGER; Schema: public; Owner: postgres
--

--CREATE TRIGGER trg_branch_insert_lineoa BEFORE INSERT ON public.wifihotspot_branch FOR EACH ROW EXECUTE FUNCTION public.ensure_lineoa_for_branch();


--
-- TOC entry 3276 (class 2620 OID 16455)
-- Name: wifi_credential trg_credential_insert_wifi; Type: TRIGGER; Schema: public; Owner: postgres
--

--CREATE TRIGGER trg_credential_insert_wifi BEFORE INSERT ON public.wifihotspot_wifi_credential FOR EACH ROW EXECUTE FUNCTION public.ensure_wifi_profile_for_credential();


--
-- TOC entry 3275 (class 2620 OID 16456)
-- Name: log trg_log_insert_branch; Type: TRIGGER; Schema: public; Owner: postgres
--

--CREATE TRIGGER trg_log_insert_branch BEFORE INSERT ON public.wifihotspot_log FOR EACH ROW EXECUTE FUNCTION public.ensure_branch_for_log();


--
-- TOC entry 3278 (class 2620 OID 16505)
-- Name: sale trg_sale_insert_lineoa; Type: TRIGGER; Schema: public; Owner: postgres
--

--CREATE TRIGGER trg_sale_insert_lineoa BEFORE INSERT ON public.aurora_sale FOR EACH ROW EXECUTE FUNCTION public.ensure_lineoa_for_sale();


--
-- TOC entry 3277 (class 2620 OID 16457)
-- Name: wifi_usage trg_usage_insert_check; Type: TRIGGER; Schema: public; Owner: postgres
--

--CREATE TRIGGER trg_usage_insert_check BEFORE INSERT ON public.wifihotspot_wifi_usage FOR EACH ROW EXECUTE FUNCTION public.ensure_branch_wifi_for_usage();


--
-- TOC entry 3266 (class 2606 OID 16458)
-- Name: admin admin_lineoa_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_admin
    ADD CONSTRAINT admin_lineoa_uid_fkey FOREIGN KEY (lineoa_uid) REFERENCES public.wifihotspot_lineoa(lineoa_uid);


--
-- TOC entry 3267 (class 2606 OID 16463)
-- Name: branch branch_lineoa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_branch
    ADD CONSTRAINT branch_lineoa_id_fkey FOREIGN KEY (lineoa_id) REFERENCES public.wifihotspot_lineoa(lineoa_id);


--
-- TOC entry 3269 (class 2606 OID 16468)
-- Name: wifi_credential fk_wifi_credential_profile; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_wifi_credential
    ADD CONSTRAINT fk_wifi_credential_profile FOREIGN KEY (wifi_profile_id) REFERENCES public.wifihotspot_wifi_profile(wifi_profile_id);


--
-- TOC entry 3270 (class 2606 OID 16473)
-- Name: wifi_usage fk_wifi_usage_profile; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_wifi_usage
    ADD CONSTRAINT fk_wifi_usage_profile FOREIGN KEY (wifi_profile_id) REFERENCES public.wifihotspot_wifi_profile(wifi_profile_id);


--
-- TOC entry 3268 (class 2606 OID 16478)
-- Name: log log_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_log
    ADD CONSTRAINT log_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.wifihotspot_branch(branch_code);


--
-- TOC entry 3272 (class 2606 OID 16499)
-- Name: sale sale_lineoa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aurora_sale
    ADD CONSTRAINT sale_lineoa_id_fkey FOREIGN KEY (lineoa_id) REFERENCES public.wifihotspot_lineoa(lineoa_id);


--
-- TOC entry 3271 (class 2606 OID 16483)
-- Name: wifi_usage wifi_usage_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wifihotspot_wifi_usage
    ADD CONSTRAINT wifi_usage_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.wifihotspot_branch(branch_id);


-- Completed on 2025-07-18 16:24:13

--
-- PostgreSQL database dump complete
--



CREATE TABLE glpi_rating_url (
  ticketId INT PRIMARY KEY,
  email VARCHAR(255),
  rating INT,
  comment VARCHAR(255),
  imageUrl VARCHAR(255)
);

ALTER TABLE glpi_rating_url
MODIFY COLUMN imageUrl VARCHAR(255) NULL;

