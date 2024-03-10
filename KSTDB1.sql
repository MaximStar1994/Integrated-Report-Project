--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4
-- Dumped by pg_dump version 12.4

-- Started on 2021-07-09 17:33:55

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

--
-- TOC entry 8 (class 2615 OID 19090)
-- Name: test; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA test;


ALTER SCHEMA test OWNER TO postgres;

--
-- TOC entry 266 (class 1255 OID 19704)
-- Name: updateTimeForBreakdownSupport(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public."updateTimeForBreakdownSupport"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.update_date = now();
	RETURN NEW;
END;
$$;


ALTER FUNCTION public."updateTimeForBreakdownSupport"() OWNER TO postgres;

--
-- TOC entry 265 (class 1255 OID 19703)
-- Name: updateTimeForBreakdownSupport(); Type: FUNCTION; Schema: test; Owner: postgres
--

CREATE FUNCTION test."updateTimeForBreakdownSupport"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.update_date = now();
	RETURN NEW;
END;
$$;


ALTER FUNCTION test."updateTimeForBreakdownSupport"() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 19223)
-- Name: crew; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crew (
    crew_id bigint NOT NULL,
    employee_no text,
    joining_date timestamp with time zone,
    name text,
    rank text,
    vessel_id bigint,
    nationality text,
    remarks text,
    months_as_of_31Jul2021 bigint
);


ALTER TABLE public.crew OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19221)
-- Name: crew_crew_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.crew ALTER COLUMN crew_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.crew_crew_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 19348)
-- Name: decklog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.decklog (
    decklog_id bigint NOT NULL,
    start_location text,
    end_location text,
    starttime timestamp with time zone,
    endtime timestamp with time zone,
    status text,
    other_status text,
    type_of_job text,
    tug_position text,
    no_of_tugs double precision,
    form_id bigint,
    order_priority integer
);


ALTER TABLE public.decklog OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 19346)
-- Name: decklog_decklog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.decklog ALTER COLUMN decklog_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.decklog_decklog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 256 (class 1259 OID 19616)
-- Name: disinfection_record; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disinfection_record (
    vessel_id bigint,
    vessel_name text,
    date_submitted timestamp with time zone,
    date timestamp with time zone,
    time text,
    checked_by text,
    file_path text,
    wheelhouse boolean,
    gallery boolean,
    messroom boolean,
    toilets boolean,
    doorknobs boolean,
    staircase boolean,
    silentroom boolean,
    remarks text,
    record_id bigint NOT NULL
);


ALTER TABLE public.disinfection_record OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 19614)
-- Name: disinfection_record_record_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.disinfection_record ALTER COLUMN record_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.disinfection_record_record_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 212 (class 1259 OID 19150)
-- Name: vessel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel (
    vessel_id bigint NOT NULL,
    name text,
    timezone text,
    location text,
    shift text,
    ops text,
    crew_management_order_id integer, 
    optimum_crew integer 
);


ALTER TABLE public.vessel OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 19148)
-- Name: vessel_vessel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.vessel ALTER COLUMN vessel_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vessel_vessel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 19195)
-- Name: lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lock (
    pagelock text,
    page text,
    vessel_id bigint,
    crew_id bigint
);


ALTER TABLE public.lock OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 19573)
-- Name: temperature_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temperature_log (
    vessel_id bigint,
    vessel_name text,
    date_submitted timestamp with time zone,
    file_path text,
    record_id bigint NOT NULL
);


ALTER TABLE public.temperature_log OWNER TO postgres;


--
-- TOC entry 249 (class 1259 OID 19571)
-- Name: temperature_log_record_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.temperature_log ALTER COLUMN record_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.temperature_log_record_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: crew_temperature; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crew_temperature (
    crew_id bigint,
    employee_no text,
    name text,
    temp1 bigint,
    temp2 bigint,
    symptoms_in_last_14_days boolean,
    symptoms text,
    first_ari_symptoms text,
    contact_with_suspected boolean,
    test_date timestamp with time zone,
    pcr boolean,
    art boolean,
    record_id bigint NOT NULL
);


ALTER TABLE public.crew_temperature OWNER TO postgres;


--
-- TOC entry 206 (class 1259 OID 19105)
-- Name: user_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_account (
    account_id bigint NOT NULL,
    username text,
    password text,
    salt text,
    account_type text
);


ALTER TABLE public.user_account OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 19103)
-- Name: user_account_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_account ALTER COLUMN account_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_account_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 208 (class 1259 OID 19127)
-- Name: user_account_app; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_account_app (
    account_id bigint,
    module text,
    app text
);


ALTER TABLE public.user_account_app OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 19158)
-- Name: user_account_vessel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_account_vessel (
    account_id bigint,
    vessel_id bigint
);


ALTER TABLE public.user_account_vessel OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 19656)
-- Name: vessel_breakdown_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_breakdown_event (
    vessel_id bigint,
    vessel_name text,
    breakdown_datetime timestamp with time zone,
    back_to_operation_datetime timestamp with time zone,
    reason text,
    status text,
    event_id bigint NOT NULL,
    file_path text
);


ALTER TABLE public.vessel_breakdown_event OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 19654)
-- Name: vessel_breakdown_event_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.vessel_breakdown_event ALTER COLUMN event_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vessel_breakdown_event_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 264 (class 1259 OID 19689)
-- Name: vessel_breakdown_support; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_breakdown_support (
    event_id bigint,
    superintendent text,
    category text,
    remarks text,
    vessel_replacement text,
    vessel_condition text,
    update_date timestamp with time zone,
    record_id bigint NOT NULL
);


ALTER TABLE public.vessel_breakdown_support OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 19687)
-- Name: vessel_breakdown_support_record_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.vessel_breakdown_support ALTER COLUMN record_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vessel_breakdown_support_record_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 243 (class 1259 OID 19501)
-- Name: vessel_report_air_conditioning; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_air_conditioning (
    form_id bigint,
    compressor_current double precision,
    compressor_suction_pressure double precision,
    compressor_discharge_pressure double precision,
    lub_oil_pressure double precision,
    cooling_water_pressure double precision,
    remarks text,
    identifier text
);


ALTER TABLE public.vessel_report_air_conditioning OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 19397)
-- Name: vessel_report_enginelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_enginelog (
    id bigint NOT NULL,
    engine_identifier text,
    carry_forward_running_hour double precision,
    running_hour double precision,
    lng_carry_forward_running_hour double precision,
    lng_running_hour double precision,
    total_running_hour double precision,
    rpm double precision,
    propeller_rpm double precision,
    cpp_pitch double precision,
    fuelrack text,
    lub_oil_pressure double precision,
    freshwater_pressure double precision,
    seawater_pressure double precision,
    charge_air_pressure double precision,
    turbo_charger_lub_oil_pressure double precision,
    fuel_oil_pressure double precision,
    lub_oil_temp_bf_cooler double precision,
    lub_oil_temp_af_cooler double precision,
    freshwater_temp_in double precision,
    freshwater_temp_out double precision,
    seawater_temp_in double precision,
    seawater_temp_out double precision,
    turbocharger_rpm double precision,
    turbocharger_exhaust_temp_in double precision,
    turbocharger_exhaust_temp_out double precision,
    charge_air_temp double precision,
    cylinder1_peak_pressure double precision,
    cylinder1_exhaust_temp double precision,
    cylinder2_peak_pressure double precision,
    cylinder2_exhaust_temp double precision,
    cylinder3_peak_pressure double precision,
    cylinder3_exhaust_temp double precision,
    cylinder4_peak_pressure double precision,
    cylinder4_exhaust_temp double precision,
    cylinder5_peak_pressure double precision,
    cylinder5_exhaust_temp double precision,
    cylinder6_peak_pressure double precision,
    cylinder6_exhaust_temp double precision,
    cylinder7_peak_pressure double precision,
    cylinder7_exhaust_temp double precision,
    cylinder8_peak_pressure double precision,
    cylinder8_exhaust_temp double precision,
    remarks text,
    form_id bigint
);


ALTER TABLE public.vessel_report_enginelog OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 19395)
-- Name: vessel_report_enginelog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.vessel_report_enginelog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vessel_report_enginelog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 19293)
-- Name: vessel_report_form; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_form (
    form_id bigint NOT NULL,
    shift integer NOT NULL,
    file_path text,
    vessel_id bigint,
    form_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    report_date text,
    captain_name text,
    captain_signature text,
    chief_engineer_name text,
    chief_engineer_signature text,
    remark text
);


ALTER TABLE public.vessel_report_form OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 19304)
-- Name: vessel_report_form_crew; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_form_crew (
    form_id bigint,
    date text,
    shift integer,
    crew_id bigint,
    employee_no text,
    name text,
    rank text,
    is_working bigint
);


ALTER TABLE public.vessel_report_form_crew OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19291)
-- Name: vessel_report_form_form_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.vessel_report_form ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vessel_report_form_form_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 238 (class 1259 OID 19443)
-- Name: vessel_report_generator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_generator (
    form_id bigint,
    carry_forward_running_hour double precision,
    running_hour double precision,
    total_running_hour double precision,
    voltage double precision,
    frequency double precision,
    current double precision,
    power double precision,
    fo_pressure double precision,
    lo_pressure double precision,
    lo_temperature double precision,
    lo_level text,
    cooling_water_temp_in double precision,
    cooling_water_temp_out double precision,
    exhaust_temp double precision,
    remarks text,
    generator_identifier text
);


ALTER TABLE public.vessel_report_generator OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 19536)
-- Name: vessel_report_rob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_rob (
    identifier text,
    carry_forward_rob double precision,
    received double precision,
    consumed double precision,
    rob double precision,
    form_id bigint
);


ALTER TABLE public.vessel_report_rob OWNER TO postgres;


--
-- TOC entry 247 (class 1259 OID 19547)
-- Name: vessel_report_tank_sounding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_tank_sounding (
    identifier text,
    level_reading double precision,
    volume double precision,
    form_id bigint
);


ALTER TABLE public.vessel_report_tank_sounding OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 19421)
-- Name: vessel_report_zpclutch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_zpclutch (
    order_priority integer,
    zpclutch_identifier text,
    zp_lub_oil_level text,
    zp_lub_oil_pressure double precision,
    zp_charge_oil_pressure double precision,
    zp_lub_oil_temp double precision,
    zp_h_oil_level text,
    zp_h_oil_temp_in double precision,
    zp_h_oil_temp_out double precision,
    clutch_oil_pressure double precision,
    remarks text,
    form_id integer
);


ALTER TABLE public.vessel_report_zpclutch OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 19208)
-- Name: crew; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.crew (
    crew_id bigint NOT NULL,
    employee_no text,
    joining_date timestamp with time zone,
    name text,
    rank text,
    vessel_id bigint,
    nationality text,
    remarks text,
    months_as_of_31Jul2021 bigint
);


ALTER TABLE test.crew OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 19206)
-- Name: crew_crew_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.crew ALTER COLUMN crew_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.crew_crew_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 19332)
-- Name: decklog; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.decklog (
    decklog_id bigint NOT NULL,
    start_location text,
    end_location text,
    starttime timestamp with time zone,
    endtime timestamp with time zone,
    status text,
    other_status text,
    type_of_job text,
    tug_position text,
    no_of_tugs double precision,
    form_id bigint,
    order_priority integer
);


ALTER TABLE test.decklog OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 19330)
-- Name: decklog_decklog_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.decklog ALTER COLUMN decklog_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.decklog_decklog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 254 (class 1259 OID 19601)
-- Name: disinfection_record; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.disinfection_record (
    vessel_id bigint,
    vessel_name text,
    date_submitted timestamp with time zone,
    date timestamp with time zone,
    time text,
    checked_by text,
    file_path text,
    wheelhouse boolean,
    gallery boolean,
    messroom boolean,
    toilets boolean,
    doorknobs boolean,
    staircase boolean,
    silentroom boolean,
    remarks text,
    record_id bigint NOT NULL
);


ALTER TABLE test.disinfection_record OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 19599)
-- Name: disinfection_record_record_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.disinfection_record ALTER COLUMN record_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.disinfection_record_record_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 210 (class 1259 OID 19140)
-- Name: vessel; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel (
    vessel_id bigint NOT NULL,
    name text,
    timezone text,
    location text,
    shift text,
    ops text,
    crew_management_order_id integer,
    optimum_crew integer
);


ALTER TABLE test.vessel OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 19138)
-- Name: vessel_vessel_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.vessel ALTER COLUMN vessel_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.vessel_vessel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 19184)
-- Name: lock; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.lock (
    pagelock text,
    page text,
    vessel_id bigint,
    crew_id bigint
);


ALTER TABLE test.lock OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 19588)
-- Name: temperature_log; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.temperature_log (
    vessel_id bigint,
    vessel_name text,
    date_submitted timestamp with time zone,
    file_path text,
    record_id bigint NOT NULL
);


ALTER TABLE test.temperature_log OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 19586)
-- Name: temperature_log_record_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.temperature_log ALTER COLUMN record_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME test.temperature_log_record_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: crew_temperature; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE test.crew_temperature (
    crew_id bigint,
    employee_no text,
    name text,
    temp1 bigint,
    temp2 bigint,
    symptoms_in_last_14_days boolean,
    symptoms text,
    first_ari_symptoms text,
    contact_with_suspected boolean,
    test_date timestamp with time zone,
    pcr boolean,
    art boolean,
    record_id bigint NOT NULL
);


ALTER TABLE test.crew_temperature OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 19093)
-- Name: user_account; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.user_account (
    account_id bigint NOT NULL,
    username text,
    password text,
    salt text,
    account_type text
);


ALTER TABLE test.user_account OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 19091)
-- Name: user_account_account_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.user_account ALTER COLUMN account_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.user_account_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 207 (class 1259 OID 19116)
-- Name: user_account_app; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.user_account_app (
    account_id bigint,
    module text,
    app text
);


ALTER TABLE test.user_account_app OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 19171)
-- Name: user_account_vessel; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.user_account_vessel (
    account_id bigint,
    vessel_id bigint
);


ALTER TABLE test.user_account_vessel OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 19641)
-- Name: vessel_breakdown_event; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_breakdown_event (
    vessel_id bigint,
    vessel_name text,
    breakdown_datetime timestamp with time zone,
    back_to_operation_datetime timestamp with time zone,
    reason text,
    status text,
    event_id bigint NOT NULL,
    file_path text
);


ALTER TABLE test.vessel_breakdown_event OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 19639)
-- Name: vessel_breakdown_event_event_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.vessel_breakdown_event ALTER COLUMN event_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.vessel_breakdown_event_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 262 (class 1259 OID 19671)
-- Name: vessel_breakdown_support; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_breakdown_support (
    event_id bigint,
    superintendent text,
    category text,
    remarks text,
    vessel_replacement text,
    vessel_condition text,
    update_date timestamp with time zone,
    record_id bigint NOT NULL
);


ALTER TABLE test.vessel_breakdown_support OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 19669)
-- Name: vessel_breakdown_support_record_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.vessel_breakdown_support ALTER COLUMN record_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.vessel_breakdown_support_record_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 244 (class 1259 OID 19512)
-- Name: vessel_report_air_conditioning; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_report_air_conditioning (
    form_id bigint,
    compressor_current double precision,
    compressor_suction_pressure double precision,
    compressor_discharge_pressure double precision,
    lub_oil_pressure double precision,
    cooling_water_pressure double precision,
    remarks text,
    identifier text
);


ALTER TABLE test.vessel_report_air_conditioning OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 19382)
-- Name: vessel_report_enginelog; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_report_enginelog (
    id bigint NOT NULL,
    engine_identifier text,
    carry_forward_running_hour double precision,
    running_hour double precision,
    lng_carry_forward_running_hour double precision,
    lng_running_hour double precision,
    total_running_hour double precision,
    rpm double precision,
    propeller_rpm double precision,
    cpp_pitch double precision,
    fuelrack text,
    lub_oil_pressure double precision,
    freshwater_pressure double precision,
    seawater_pressure double precision,
    charge_air_pressure double precision,
    turbo_charger_lub_oil_pressure double precision,
    fuel_oil_pressure double precision,
    lub_oil_temp_bf_cooler double precision,
    lub_oil_temp_af_cooler double precision,
    freshwater_temp_in double precision,
    freshwater_temp_out double precision,
    seawater_temp_in double precision,
    seawater_temp_out double precision,
    turbocharger_rpm double precision,
    turbocharger_exhaust_temp_in double precision,
    turbocharger_exhaust_temp_out double precision,
    charge_air_temp double precision,
    cylinder1_peak_pressure double precision,
    cylinder1_exhaust_temp double precision,
    cylinder2_peak_pressure double precision,
    cylinder2_exhaust_temp double precision,
    cylinder3_peak_pressure double precision,
    cylinder3_exhaust_temp double precision,
    cylinder4_peak_pressure double precision,
    cylinder4_exhaust_temp double precision,
    cylinder5_peak_pressure double precision,
    cylinder5_exhaust_temp double precision,
    cylinder6_peak_pressure double precision,
    cylinder6_exhaust_temp double precision,
    cylinder7_peak_pressure double precision,
    cylinder7_exhaust_temp double precision,
    cylinder8_peak_pressure double precision,
    cylinder8_exhaust_temp double precision,
    remarks text,
    form_id bigint
);


ALTER TABLE test.vessel_report_enginelog OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 19380)
-- Name: vessel_report_enginelog_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.vessel_report_enginelog ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.vessel_report_enginelog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 19283)
-- Name: vessel_report_form; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_report_form (
    form_id bigint NOT NULL,
    shift integer NOT NULL,
    file_path text,
    vessel_id bigint,
    form_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    report_date text,
    captain_name text,
    captain_signature text,
    chief_engineer_name text,
    chief_engineer_signature text,
    remark text
);


ALTER TABLE test.vessel_report_form OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 19317)
-- Name: vessel_report_form_crew; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_report_form_crew (
    form_id bigint,
    date text,
    shift integer,
    crew_id bigint,
    employee_no text,
    name text,
    rank text,
    is_working bigint
);


ALTER TABLE test.vessel_report_form_crew OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 19281)
-- Name: vessel_report_form_form_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.vessel_report_form ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.vessel_report_form_form_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 19432)
-- Name: vessel_report_generator; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_report_generator (
    form_id bigint,
    carry_forward_running_hour double precision,
    running_hour double precision,
    total_running_hour double precision,
    voltage double precision,
    frequency double precision,
    current double precision,
    power double precision,
    fo_pressure double precision,
    lo_pressure double precision,
    lo_temperature double precision,
    lo_level text,
    cooling_water_temp_in double precision,
    cooling_water_temp_out double precision,
    exhaust_temp double precision,
    remarks text,
    generator_identifier text
);


ALTER TABLE test.vessel_report_generator OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 19525)
-- Name: vessel_report_rob; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_report_rob (
    identifier text,
    carry_forward_rob double precision,
    received double precision,
    consumed double precision,
    rob double precision,
    form_id bigint
);


ALTER TABLE test.vessel_report_rob OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 19560)
-- Name: vessel_report_tank_sounding; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_report_tank_sounding (
    identifier text,
    level_reading double precision,
    volume double precision,
    form_id bigint
);


ALTER TABLE test.vessel_report_tank_sounding OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 19410)
-- Name: vessel_report_zpclutch; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.vessel_report_zpclutch (
    order_priority integer,
    zpclutch_identifier text,
    zp_lub_oil_level text,
    zp_lub_oil_pressure double precision,
    zp_charge_oil_pressure double precision,
    zp_lub_oil_temp double precision,
    zp_h_oil_level text,
    zp_h_oil_temp_in double precision,
    zp_h_oil_temp_out double precision,
    clutch_oil_pressure double precision,
    remarks text,
    form_id integer
);


----NEW UPDATE HERE
CREATE TABLE public.spare_crew (
    spare_crew_id bigint NOT NULL,
    location text,
    shift text,
    shift_details text,
    ops text,
    nationality text,
    rank text,
    name text,
    employee_no text,
    joining_date timestamp with time zone,
    months_as_of_31Jul2021 bigint,
    remarks text
);

ALTER TABLE public.spare_crew OWNER TO postgres;

ALTER TABLE public.spare_crew ALTER COLUMN spare_crew_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.spare_crew_spare_crew_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE test.spare_crew (
    spare_crew_id bigint NOT NULL,
    location text,
    shift text,
    shift_details text,
    ops text,
    nationality text,
    rank text,
    name text,
    employee_no text,
    joining_date timestamp with time zone,
    months_as_of_31Jul2021 bigint,
    remarks text
);

ALTER TABLE test.spare_crew OWNER TO postgres;

ALTER TABLE test.spare_crew ALTER COLUMN spare_crew_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.spare_crew_spare_crew_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.generator (
    generator_identifier text,
    vessel_id bigint,
    order_id integer
);

ALTER TABLE public.generator OWNER TO postgres;

CREATE TABLE test.generator (
    generator_identifier text,
    vessel_id bigint,
    order_id integer
);

ALTER TABLE test.generator OWNER TO postgres;


CREATE TABLE public.rob (
    rob_identifier text,
    vessel_id bigint,
    order_id integer
);

ALTER TABLE public.rob OWNER TO postgres;

CREATE TABLE test.rob (
    rob_identifier text,
    vessel_id bigint,
    order_id integer
);

ALTER TABLE test.rob OWNER TO postgres;



CREATE TABLE public.tank_sounding (
    identifier text,
    max_depth double precision,
    max_volume double precision,
    order_id integer,
    vessel_id bigint
);

ALTER TABLE public.tank_sounding OWNER TO postgres;

CREATE TABLE test.tank_sounding (
    identifier text,
    max_depth double precision,
    max_volume double precision,
    order_id integer,
    vessel_id bigint
);

ALTER TABLE test.tank_sounding OWNER TO postgres;

CREATE TABLE public.crew_work_rest (
    form_id bigint NOT NULL,
    vessel_id bigint,
    vessel_name text,
    rank text,
    crew_id integer,
    employee_no text,
    crew_name text,
    watchkeeper boolean,
    month integer,
    year integer,
    authorised_person_name text,
    authorised_person_signature text,
    seafarer_name text,
    seafarer_signature text,
    file_path text,
    date_submitted timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.crew_work_rest OWNER TO postgres;

ALTER TABLE public.crew_work_rest ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.crew_work_rest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE test.crew_work_rest (
    form_id bigint NOT NULL,
    vessel_id bigint,
    vessel_name text,
    rank text,
    crew_id integer,
    employee_no text,
    crew_name text,
    watchkeeper boolean,
    month integer,
    year integer,
    authorised_person_name text,
    authorised_person_signature text,
    seafarer_name text,
    seafarer_signature text,
    file_path text,
    date_submitted timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE test.crew_work_rest OWNER TO postgres;

ALTER TABLE test.crew_work_rest ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.crew_work_rest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.crew_work_rest_update (
    form_id bigint NOT NULL,
    crew_id integer,
    employee_no text,
    crew_name text,
    month integer,
    year integer,
    date integer,
    start_cell integer,
    end_cell integer,
    is_working bigint,
    date_submitted timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.crew_work_rest_update OWNER TO postgres;

ALTER TABLE public.crew_work_rest_update ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.crew_work_rest_update_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


CREATE TABLE test.crew_work_rest_update (
    form_id bigint NOT NULL,
    crew_id integer,
    employee_no text,
    crew_name text,
    month integer,
    year integer,
    date integer,
    start_cell integer,
    end_cell integer,
    is_working bigint,
    date_submitted timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE test.crew_work_rest_update OWNER TO postgres;

ALTER TABLE test.crew_work_rest_update ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.crew_work_rest_update_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


----NEW UPDATE ENDS HERE

---Changes by Mani- Start---
ALTER TABLE public.vessel_report_form ADD COLUMN delete_flag text DEFAULT 'N' ;
ALTER TABLE public.vessel_breakdown_event ADD COLUMN delete_flag text DEFAULT 'N' ;
ALTER TABLE public.temperature_log ADD COLUMN delete_flag text DEFAULT 'N' ;
ALTER TABLE public.disinfection_record ADD COLUMN delete_flag text DEFAULT 'N' ;
ALTER TABLE public.crew_work_rest ADD COLUMN delete_flag text DEFAULT 'N' ;

ALTER TABLE test.vessel_report_form ADD COLUMN delete_flag text DEFAULT 'N' ;
ALTER TABLE test.vessel_breakdown_event ADD COLUMN delete_flag text DEFAULT 'N' ;
ALTER TABLE test.temperature_log ADD COLUMN delete_flag text DEFAULT 'N' ;
ALTER TABLE test.disinfection_record ADD COLUMN delete_flag text DEFAULT 'N' ;
ALTER TABLE test.crew_work_rest ADD COLUMN delete_flag text DEFAULT 'N' ;


CREATE TABLE public.folder (
    id bigint  NOT NULL,
    name text,
    parentFolderid bigint
);

ALTER TABLE public.folder OWNER TO postgres;


ALTER TABLE public.folder ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.folder_id_seq
    START WITH 1001
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE test.folder (
    id bigint  NOT NULL,
    name text,
    parentFolderid bigint
);

ALTER TABLE test.folder OWNER TO postgres;


ALTER TABLE test.folder ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.folder_id_seq
    START WITH 1001
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


---Files/Folder

CREATE TABLE public.file (
    id bigint  NOT NULL,
    name text,
	relative_dir text,
    file_path text,
    delete_flag text DEFAULT 'N',
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.file OWNER TO postgres;

ALTER TABLE public.file ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.file_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.file_folder (
	id bigint  NOT NULL,
    file_id bigint,
	folder_id bigint
);

ALTER TABLE public.file_folder OWNER TO postgres;

ALTER TABLE public.file_folder ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.file_folder_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
---Changes by Mani- End---

-- vessel_report_form_structure table scripts starts -- Hari

CREATE TABLE IF NOT EXISTS public.vessel_report_form_structure
(
    id integer NOT NULL DEFAULT nextval('vessel_report_form_structure_id_seq'::regclass),
    report text COLLATE pg_catalog."default" NOT NULL,
    category text COLLATE pg_catalog."default" NOT NULL,
    tag_name text COLLATE pg_catalog."default" NOT NULL,
    display_name text COLLATE pg_catalog."default" NOT NULL,
    unit text COLLATE pg_catalog."default",
    is_lng boolean NOT NULL DEFAULT false,
    order_by integer,
    CONSTRAINT vessel_report_form_structure_pkey PRIMARY KEY (id)
)

-- vessel_report_form_structure table scripts ends -- Hari

-- 28 FEB 2023 QUERIES BY HARI STARTS

update vessel_report_form_structure set unit = 'Date format YYYYMMDD' where id=16;
alter TABLE vessel_report_form add column "is_offline" BOOLEAN DEFAULT false;
alter TABLE daily_log_form add column "is_offline" BOOLEAN DEFAULT false;

-- 28 FEB 2023 QUERIES BY HARI ENDS

-- 3 MAR 2023 QUERIES BY HARI STARTS

alter TABLE vessel_breakdown_event add column "is_redundant" BOOLEAN DEFAULT false;
alter TABLE vessel_breakdown_event add column "is_editable" BOOLEAN DEFAULT false;

-- 3 MAR 2023 QUERIES BY HARI ENDS

-- 27 APR 2023 AVAILABLE_APPS TABLE STARTS - SID

CREATE TABLE IF NOT EXISTS public.available_apps
(
    module text,
    app text
)

-- 27 APR 2023 AVAILABLE_APPS TABLE ENDS - SID
