--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4
-- Dumped by pg_dump version 12.4

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
-- Name: test; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA test;


ALTER SCHEMA test OWNER TO postgres;

--
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
-- Name: backdated_form_submission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.backdated_form_submission (
    id integer NOT NULL,
    vessel_id bigint NOT NULL,
    form text,
    status text,
    created_by bigint NOT NULL,
    report_date text DEFAULT ''::text,
    created_date timestamp without time zone DEFAULT now()
);


ALTER TABLE public.backdated_form_submission OWNER TO postgres;

--
-- Name: backdated_form_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.backdated_form_submission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.backdated_form_submission_id_seq OWNER TO postgres;

--
-- Name: backdated_form_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.backdated_form_submission_id_seq OWNED BY public.backdated_form_submission.id;


--
-- Name: chat_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_members (
    chat_id bigint,
    member_id bigint,
    member_name text,
    last_msg_read bigint
);


ALTER TABLE public.chat_members OWNER TO postgres;

--
-- Name: chat_msgs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_msgs (
    msg_id integer NOT NULL,
    chat_id bigint,
    msg_from_id bigint,
    msg_from_name text,
    msg text,
    sent_datetime timestamp with time zone
);


ALTER TABLE public.chat_msgs OWNER TO postgres;

--
-- Name: chat_msgs_msg_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_msgs_msg_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_msgs_msg_id_seq OWNER TO postgres;

--
-- Name: chat_msgs_msg_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_msgs_msg_id_seq OWNED BY public.chat_msgs.msg_id;


--
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chats (
    chat_id integer NOT NULL,
    chat_name text,
    chat_type text
);


ALTER TABLE public.chats OWNER TO postgres;

--
-- Name: chats_chat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chats_chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chats_chat_id_seq OWNER TO postgres;

--
-- Name: chats_chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chats_chat_id_seq OWNED BY public.chats.chat_id;


--
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
    months_as_of_31jul2021 bigint
);


ALTER TABLE public.crew OWNER TO postgres;

--
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
-- Name: crew_temperature; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crew_temperature (
    crew_id bigint,
    employee_no text,
    name text,
    temp1 double precision,
    temp2 double precision,
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
-- Name: crew_work_rest; Type: TABLE; Schema: public; Owner: postgres
--

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
    date_submitted timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    delete_flag text DEFAULT 'N'::text
);


ALTER TABLE public.crew_work_rest OWNER TO postgres;

--
-- Name: crew_work_rest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.crew_work_rest ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.crew_work_rest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: crew_work_rest_update; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: crew_work_rest_update_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.crew_work_rest_update ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.crew_work_rest_update_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: daily_log_enginelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.daily_log_enginelog (
    id integer NOT NULL,
    engine_identifier text,
    carry_forward_running_hour double precision,
    running_hour double precision,
    total_running_hour double precision,
    lng_carry_forward_running_hour double precision,
    lng_running_hour double precision,
    total_lng_running_hour double precision,
    daily_log_form_id bigint
);


ALTER TABLE public.daily_log_enginelog OWNER TO postgres;

--
-- Name: daily_log_enginelog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.daily_log_enginelog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.daily_log_enginelog_id_seq OWNER TO postgres;

--
-- Name: daily_log_enginelog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.daily_log_enginelog_id_seq OWNED BY public.daily_log_enginelog.id;


--
-- Name: daily_log_form; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.daily_log_form (
    form_id integer NOT NULL,
    file_path text,
    vessel_id bigint,
    form_date timestamp with time zone,
    report_date text,
    captain_name text,
    captain_signature text,
    chief_engineer_name text,
    chief_engineer_signature text,
    remark text,
    delete_flag text DEFAULT 'N'::text,
    is_backdated boolean DEFAULT false,
    is_redundant boolean DEFAULT false
);


ALTER TABLE public.daily_log_form OWNER TO postgres;

--
-- Name: daily_log_form_form_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.daily_log_form_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.daily_log_form_form_id_seq OWNER TO postgres;

--
-- Name: daily_log_form_form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.daily_log_form_form_id_seq OWNED BY public.daily_log_form.form_id;


--
-- Name: daily_log_generator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.daily_log_generator (
    daily_log_form_id bigint,
    generator_identifier text,
    carry_forward_running_hour double precision,
    running_hour double precision,
    total_running_hour double precision
);


ALTER TABLE public.daily_log_generator OWNER TO postgres;

--
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
-- Name: disinfection_record; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disinfection_record (
    vessel_id bigint,
    vessel_name text,
    date_submitted timestamp with time zone,
    date timestamp with time zone,
    "time" text,
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
    record_id bigint NOT NULL,
    delete_flag text DEFAULT 'N'::text
);


ALTER TABLE public.disinfection_record OWNER TO postgres;

--
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
-- Name: file; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.file (
    id bigint NOT NULL,
    name text,
    relative_dir text,
    file_path text,
    delete_flag text DEFAULT 'N'::text,
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.file OWNER TO postgres;

--
-- Name: file_folder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.file_folder (
    id bigint NOT NULL,
    file_id bigint,
    folder_id bigint
);


ALTER TABLE public.file_folder OWNER TO postgres;

--
-- Name: file_folder_id; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.file_folder ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.file_folder_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: file_id; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.file ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.file_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: folder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.folder (
    id bigint NOT NULL,
    name text,
    parentfolderid bigint
);


ALTER TABLE public.folder OWNER TO postgres;

--
-- Name: folder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.folder ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.folder_id_seq
    START WITH 1001
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: generator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generator (
    generator_identifier text,
    vessel_id bigint,
    order_id integer
);


ALTER TABLE public.generator OWNER TO postgres;

--
-- Name: lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lock (
    pagelock text,
    page text,
    vessel_id bigint,
    crew_id bigint,
    currentuser text
);


ALTER TABLE public.lock OWNER TO postgres;

--
-- Name: marinem_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marinem_orders (
    order_no text NOT NULL,
    order_id text NOT NULL,
    vessel_name text,
    order_srt timestamp with time zone,
    customer_id integer,
    is_approved boolean
);


ALTER TABLE public.marinem_orders OWNER TO postgres;

--
-- Name: marinem_task_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marinem_task_details (
    order_id text NOT NULL,
    task_type text,
    task_id text NOT NULL,
    task_start_time timestamp with time zone,
    task_end_time timestamp with time zone,
    current_stage text,
    task_status text,
    resource_id text,
    resource_name text,
    deployment_id text,
    from_location text,
    to_location text
);


ALTER TABLE public.marinem_task_details OWNER TO postgres;

--
-- Name: marinem_task_stages_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marinem_task_stages_details (
    order_id text NOT NULL,
    task_id text NOT NULL,
    task_stage_id text NOT NULL,
    stage_name text,
    stage_time timestamp with time zone
);


ALTER TABLE public.marinem_task_stages_details OWNER TO postgres;

--
-- Name: rob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rob (
    rob_identifier text,
    vessel_id bigint,
    order_id integer
);


ALTER TABLE public.rob OWNER TO postgres;

--
-- Name: spare_crew; Type: TABLE; Schema: public; Owner: postgres
--

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
    months_as_of_31jul2021 bigint,
    remarks text
);


ALTER TABLE public.spare_crew OWNER TO postgres;

--
-- Name: spare_crew_spare_crew_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.spare_crew ALTER COLUMN spare_crew_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.spare_crew_spare_crew_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tank_sounding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tank_sounding (
    identifier text,
    max_depth double precision,
    max_volume double precision,
    order_id integer,
    vessel_id bigint
);


ALTER TABLE public.tank_sounding OWNER TO postgres;

--
-- Name: temperature_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temperature_log (
    vessel_id bigint,
    vessel_name text,
    date_submitted timestamp with time zone,
    file_path text,
    record_id bigint NOT NULL,
    delete_flag text DEFAULT 'N'::text
);


ALTER TABLE public.temperature_log OWNER TO postgres;

--
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
-- Name: user_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_account (
    account_id bigint NOT NULL,
    username text,
    password text,
    salt text,
    account_type text,
    name text
);


ALTER TABLE public.user_account OWNER TO postgres;

--
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
-- Name: user_account_app; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_account_app (
    account_id bigint,
    module text,
    app text
);


ALTER TABLE public.user_account_app OWNER TO postgres;

--
-- Name: user_account_vessel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_account_vessel (
    account_id bigint,
    vessel_id bigint
);


ALTER TABLE public.user_account_vessel OWNER TO postgres;

--
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
    file_path text,
    delete_flag text DEFAULT 'N'::text
);


ALTER TABLE public.vessel_breakdown_event OWNER TO postgres;

--
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
    form_id bigint,
    total_lng_running_hour double precision
);


ALTER TABLE public.vessel_report_enginelog OWNER TO postgres;

--
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
    remark text,
    delete_flag text DEFAULT 'N'::text,
    is_backdated boolean DEFAULT false,
    is_redundant boolean DEFAULT false
);


ALTER TABLE public.vessel_report_form OWNER TO postgres;

--
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
-- Name: vessel_report_rob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_rob (
    identifier text,
    carry_forward_rob double precision,
    received double precision,
    consumed double precision,
    rob double precision,
    form_id bigint,
    daily_log_form_id bigint
);


ALTER TABLE public.vessel_report_rob OWNER TO postgres;

--
-- Name: vessel_report_tank_sounding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vessel_report_tank_sounding (
    identifier text,
    level_reading double precision,
    volume double precision,
    form_id bigint,
    daily_log_form_id bigint
);


ALTER TABLE public.vessel_report_tank_sounding OWNER TO postgres;

--
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
    months_as_of_31jul2021 bigint
);


ALTER TABLE test.crew OWNER TO postgres;

--
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
-- Name: crew_temperature; Type: TABLE; Schema: test; Owner: postgres
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
-- Name: crew_work_rest; Type: TABLE; Schema: test; Owner: postgres
--

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
    date_submitted timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    delete_flag text DEFAULT 'N'::text
);


ALTER TABLE test.crew_work_rest OWNER TO postgres;

--
-- Name: crew_work_rest_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.crew_work_rest ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.crew_work_rest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: crew_work_rest_update; Type: TABLE; Schema: test; Owner: postgres
--

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

--
-- Name: crew_work_rest_update_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.crew_work_rest_update ALTER COLUMN form_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.crew_work_rest_update_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
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
-- Name: disinfection_record; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.disinfection_record (
    vessel_id bigint,
    vessel_name text,
    date_submitted timestamp with time zone,
    date timestamp with time zone,
    "time" text,
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
    record_id bigint NOT NULL,
    delete_flag text DEFAULT 'N'::text
);


ALTER TABLE test.disinfection_record OWNER TO postgres;

--
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
-- Name: folder; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.folder (
    id bigint NOT NULL,
    name text,
    parentfolderid bigint
);


ALTER TABLE test.folder OWNER TO postgres;

--
-- Name: folder_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.folder ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.folder_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: generator; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.generator (
    generator_identifier text,
    vessel_id bigint,
    order_id integer
);


ALTER TABLE test.generator OWNER TO postgres;

--
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
-- Name: rob; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.rob (
    rob_identifier text,
    vessel_id bigint,
    order_id integer
);


ALTER TABLE test.rob OWNER TO postgres;

--
-- Name: spare_crew; Type: TABLE; Schema: test; Owner: postgres
--

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
    months_as_of_31jul2021 bigint,
    remarks text
);


ALTER TABLE test.spare_crew OWNER TO postgres;

--
-- Name: spare_crew_spare_crew_id_seq; Type: SEQUENCE; Schema: test; Owner: postgres
--

ALTER TABLE test.spare_crew ALTER COLUMN spare_crew_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME test.spare_crew_spare_crew_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tank_sounding; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.tank_sounding (
    identifier text,
    max_depth double precision,
    max_volume double precision,
    order_id integer,
    vessel_id bigint
);


ALTER TABLE test.tank_sounding OWNER TO postgres;

--
-- Name: temperature_log; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.temperature_log (
    vessel_id bigint,
    vessel_name text,
    date_submitted timestamp with time zone,
    file_path text,
    record_id bigint NOT NULL,
    delete_flag text DEFAULT 'N'::text
);


ALTER TABLE test.temperature_log OWNER TO postgres;

--
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
-- Name: user_account_app; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.user_account_app (
    account_id bigint,
    module text,
    app text
);


ALTER TABLE test.user_account_app OWNER TO postgres;

--
-- Name: user_account_vessel; Type: TABLE; Schema: test; Owner: postgres
--

CREATE TABLE test.user_account_vessel (
    account_id bigint,
    vessel_id bigint
);


ALTER TABLE test.user_account_vessel OWNER TO postgres;

--
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
    file_path text,
    delete_flag text DEFAULT 'N'::text
);


ALTER TABLE test.vessel_breakdown_event OWNER TO postgres;

--
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
    remark text,
    delete_flag text DEFAULT 'N'::text
);


ALTER TABLE test.vessel_report_form OWNER TO postgres;

--
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


ALTER TABLE test.vessel_report_zpclutch OWNER TO postgres;

--
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
-- Name: backdated_form_submission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backdated_form_submission ALTER COLUMN id SET DEFAULT nextval('public.backdated_form_submission_id_seq'::regclass);


--
-- Name: chat_msgs msg_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_msgs ALTER COLUMN msg_id SET DEFAULT nextval('public.chat_msgs_msg_id_seq'::regclass);


--
-- Name: chats chat_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats ALTER COLUMN chat_id SET DEFAULT nextval('public.chats_chat_id_seq'::regclass);


--
-- Name: daily_log_enginelog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_log_enginelog ALTER COLUMN id SET DEFAULT nextval('public.daily_log_enginelog_id_seq'::regclass);


--
-- Name: daily_log_form form_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_log_form ALTER COLUMN form_id SET DEFAULT nextval('public.daily_log_form_form_id_seq'::regclass);


--
-- Data for Name: backdated_form_submission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.backdated_form_submission (id, vessel_id, form, status, created_by, report_date, created_date) FROM stdin  DELIMITER ',';
\.


--
-- Data for Name: chat_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_members (chat_id, member_id, member_name, last_msg_read) FROM stdin  DELIMITER ',';
1,49,Gunalan,\N
2,49,Gunalan,\N
3,49,Gunalan,\N
4,49,Gunalan,\N
5,49,Gunalan,\N
6,49,Gunalan,\N
7,49,Gunalan,\N
8,49,Gunalan,\N
9,49,Gunalan,\N
10,49,Gunalan,\N
12,49,Gunalan,\N
13,49,Gunalan,\N
14,49,Gunalan,\N
15,49,Gunalan,\N
16,49,Gunalan,\N
17,49,Gunalan,\N
18,49,Gunalan,\N
19,49,Gunalan,\N
20,49,Gunalan,\N
21,49,Gunalan,\N
22,49,Gunalan,\N
23,49,Gunalan,\N
7,10,Kancil,\N
14,17,Stellar,\N
15,18,56,\N
16,19,58,\N
21,24,Super,\N
22,25,Mercury,\N
18,21,Pride,89
27,49,Gunalan,\N
29,49,Gunalan,\N
30,49,Gunalan,\N
31,49,Gunalan,\N
34,49,Gunalan,\N
35,49,Gunalan,\N
36,49,Gunalan,\N
37,49,Gunalan,\N
30,36,Siti Zainun,\N
34,40,Yan Lin,56
38,49,Gunalan,\N
11,49,Gunalan,21
1,50,Romi,\N
2,50,Romi,\N
27,33,Khairundin,49
36,43,Bernard Tan,58
3,36,Siti Zainun,\N
3,37,Siti Raudhah,\N
3,38,Tan Yeow Kwang,\N
3,39,Tan Yeow Yong,\N
40,51,Tserpara,\N
40,48,Support,\N
40,43,Bernard Tan,\N
40,49,Gunalan,\N
1,48,Support,332
27,48,Support,297
36,42,David Liu,58
21,48,Support,291
14,48,Support,284
13,16,511,283
35,41,Thu Ya,304
10,48,Support,310
19,48,Support,345
15,48,Support,285
5,48,Support,275
29,48,Support,298
3,6,Sky,335
7,48,Support,277
5,8,Success,275
2,48,Support,272
22,48,Support,292
31,37,Siti Raudhah,139
36,48,Support,58
6,48,Support,348
38,48,Support,152
30,48,Support,299
11,48,Support,281
16,48,Support,286
4,7,Skill,68
13,48,Support,283
10,13,Liberty,310
35,43,Bernard Tan,304
10,43,Bernard Tan,310
20,23,36,344
23,26,Mars,339
29,35,Stanley,194
20,48,Support,346
17,20,Passion,340
29,43,Bernard Tan,298
27,43,Bernard Tan,297
17,48,Support,341
19,43,Bernard Tan,289
22,43,Bernard Tan,292
21,43,Bernard Tan,291
18,43,Bernard Tan,288
17,43,Bernard Tan,313
16,43,Bernard Tan,286
14,43,Bernard Tan,284
13,43,Bernard Tan,283
12,43,Bernard Tan,317
11,43,Bernard Tan,281
5,43,Bernard Tan,275
8,43,Bernard Tan,278
6,43,Bernard Tan,276
4,43,Bernard Tan,274
3,43,Bernard Tan,273
1,43,Bernard Tan,271
30,43,Bernard Tan,299
6,9,Summit,348
19,22,35,342
34,43,Bernard Tan,303
42,53,Thonce,\N
42,48,Support,\N
42,43,Bernard Tan,\N
42,49,Gunalan,\N
3,40,Yan Lin,\N
3,50,Romi,\N
4,50,Romi,\N
5,50,Romi,\N
6,50,Romi,\N
7,50,Romi,\N
8,50,Romi,\N
9,50,Romi,\N
10,50,Romi,\N
11,50,Romi,\N
12,50,Romi,\N
13,50,Romi,\N
14,50,Romi,\N
15,50,Romi,\N
16,50,Romi,\N
17,50,Romi,\N
18,50,Romi,\N
19,50,Romi,\N
20,50,Romi,\N
21,50,Romi,\N
22,50,Romi,\N
23,50,Romi,\N
27,50,Romi,\N
29,50,Romi,\N
30,50,Romi,\N
31,50,Romi,\N
34,50,Romi,\N
35,50,Romi,\N
36,50,Romi,\N
37,50,Romi,\N
38,50,Romi,\N
39,50,Romi,\N
40,50,Romi,\N
41,50,Romi,\N
42,50,Romi,\N
43,50,Romi,\N
44,50,Romi,\N
45,50,Romi,\N
46,50,Romi,\N
1,34,Herman,\N
1,36,Siti Zainun,\N
1,37,Siti Raudhah,\N
1,38,Tan Yeow Kwang,\N
1,39,Tan Yeow Yong,\N
1,44,Office_15,\N
1,45,Office_16,\N
1,51,Tserpara,\N
1,46,Kelly.Aw,\N
1,47,Teri.Lee,\N
1,52,Laks,\N
2,34,Herman,\N
2,36,Siti Zainun,\N
2,37,Siti Raudhah,\N
41,52,Laks,\N
2,38,Tan Yeow Kwang,\N
41,48,Support,\N
41,43,Bernard Tan,\N
41,49,Gunalan,\N
2,39,Tan Yeow Yong,\N
2,41,Thu Ya,\N
2,44,Office_15,\N
2,45,Office_16,\N
2,51,Tserpara,\N
2,46,Kelly.Aw,\N
2,47,Teri.Lee,\N
2,52,Laks,\N
3,41,Thu Ya,\N
3,34,Herman,\N
3,44,Office_15,\N
3,45,Office_16,\N
3,51,Tserpara,\N
3,46,Kelly.Aw,\N
3,47,Teri.Lee,\N
3,52,Laks,\N
4,34,Herman,\N
3,33,Khairundin,67
4,36,Siti Zainun,\N
4,37,Siti Raudhah,\N
4,38,Tan Yeow Kwang,\N
4,39,Tan Yeow Yong,\N
4,41,Thu Ya,\N
4,44,Office_15,\N
4,45,Office_16,\N
4,51,Tserpara,\N
4,46,Kelly.Aw,\N
4,47,Teri.Lee,\N
2,5,33,163
23,43,Bernard Tan,336
4,33,Khairundin,68
35,48,Support,304
2,43,Bernard Tan,272
3,32,Mark Koh,67
4,30,KST Opsroom,274
18,48,Support,288
1,31,Ng Hak Mun,271
3,42,David Liu,67
4,42,David Liu,68
2,42,David Liu,92
2,31,Ng Hak Mun,272
3,31,Ng Hak Mun,273
4,31,Ng Hak Mun,68
23,48,Support,339
1,30,KST Opsroom,271
1,4,31,332
2,32,Mark Koh,163
1,35,Stanley,176
8,48,Support,278
4,48,Support,274
4,32,Mark Koh,68
2,40,Yan Lin,163
1,53,Thonce,176
3,53,Thonce,67
2,35,Stanley,163
1,40,Yan Lin,176
3,35,Stanley,67
2,30,KST Opsroom,272
3,30,KST Opsroom,273
12,15,510,317
3,48,Support,335
20,43,Bernard Tan,290
15,43,Bernard Tan,285
31,43,Bernard Tan,300
34,48,Support,303
38,43,Bernard Tan,152
37,43,Bernard Tan,338
4,52,Laks,\N
5,30,KST Opsroom,\N
5,34,Herman,\N
5,36,Siti Zainun,\N
5,37,Siti Raudhah,\N
5,38,Tan Yeow Kwang,\N
5,39,Tan Yeow Yong,\N
5,40,Yan Lin,\N
5,44,Office_15,\N
5,45,Office_16,\N
5,51,Tserpara,\N
5,46,Kelly.Aw,\N
5,47,Teri.Lee,\N
5,52,Laks,\N
6,30,KST Opsroom,\N
6,34,Herman,\N
6,36,Siti Zainun,\N
6,37,Siti Raudhah,\N
6,38,Tan Yeow Kwang,\N
6,39,Tan Yeow Yong,\N
6,40,Yan Lin,\N
6,44,Office_15,\N
6,45,Office_16,\N
6,51,Tserpara,\N
6,46,Kelly.Aw,\N
6,47,Teri.Lee,\N
6,52,Laks,\N
7,30,KST Opsroom,\N
7,34,Herman,\N
7,36,Siti Zainun,\N
7,37,Siti Raudhah,\N
7,38,Tan Yeow Kwang,\N
7,39,Tan Yeow Yong,\N
7,40,Yan Lin,\N
7,41,Thu Ya,\N
7,44,Office_15,\N
7,45,Office_16,\N
7,51,Tserpara,\N
7,46,Kelly.Aw,\N
7,47,Teri.Lee,\N
7,52,Laks,\N
8,34,Herman,\N
8,36,Siti Zainun,\N
8,37,Siti Raudhah,\N
8,38,Tan Yeow Kwang,\N
8,39,Tan Yeow Yong,\N
8,40,Yan Lin,\N
8,41,Thu Ya,\N
8,44,Office_15,\N
8,45,Office_16,\N
8,51,Tserpara,\N
8,46,Kelly.Aw,\N
8,47,Teri.Lee,\N
8,52,Laks,\N
9,30,KST Opsroom,\N
9,34,Herman,\N
9,36,Siti Zainun,\N
9,37,Siti Raudhah,\N
9,38,Tan Yeow Kwang,\N
9,39,Tan Yeow Yong,\N
9,40,Yan Lin,\N
9,41,Thu Ya,\N
9,44,Office_15,\N
9,45,Office_16,\N
9,51,Tserpara,\N
9,46,Kelly.Aw,\N
9,47,Teri.Lee,\N
9,52,Laks,\N
10,30,KST Opsroom,\N
10,31,Ng Hak Mun,\N
10,34,Herman,\N
10,36,Siti Zainun,\N
10,37,Siti Raudhah,\N
10,38,Tan Yeow Kwang,\N
10,39,Tan Yeow Yong,\N
10,41,Thu Ya,\N
10,44,Office_15,\N
10,45,Office_16,\N
10,51,Tserpara,\N
10,46,Kelly.Aw,\N
10,47,Teri.Lee,\N
10,52,Laks,\N
11,30,KST Opsroom,\N
11,34,Herman,\N
11,36,Siti Zainun,\N
8,33,Khairundin,72
11,33,Khairundin,75
7,33,Khairundin,71
10,33,Khairundin,74
11,37,Siti Raudhah,\N
11,38,Tan Yeow Kwang,\N
11,39,Tan Yeow Yong,\N
11,41,Thu Ya,\N
11,44,Office_15,\N
11,45,Office_16,\N
11,51,Tserpara,\N
11,46,Kelly.Aw,\N
11,47,Teri.Lee,\N
11,52,Laks,\N
12,30,KST Opsroom,\N
12,31,Ng Hak Mun,\N
9,42,David Liu,136
10,42,David Liu,74
5,42,David Liu,145
6,42,David Liu,70
8,42,David Liu,72
5,33,Khairundin,144
11,42,David Liu,75
5,32,Mark Koh,145
8,31,Ng Hak Mun,278
6,32,Mark Koh,70
9,32,Mark Koh,158
7,32,Mark Koh,71
4,53,Thonce,68
10,32,Mark Koh,74
11,32,Mark Koh,75
11,40,Yan Lin,193
5,53,Thonce,145
10,40,Yan Lin,74
5,35,Stanley,145
10,53,Thonce,74
8,53,Thonce,187
9,53,Thonce,158
6,53,Thonce,70
7,35,Stanley,71
11,35,Stanley,193
6,35,Stanley,70
8,35,Stanley,187
10,35,Stanley,74
5,31,Ng Hak Mun,275
7,31,Ng Hak Mun,277
11,31,Ng Hak Mun,281
12,34,Herman,\N
12,36,Siti Zainun,\N
12,37,Siti Raudhah,\N
12,38,Tan Yeow Kwang,\N
12,39,Tan Yeow Yong,\N
12,40,Yan Lin,\N
12,44,Office_15,\N
12,45,Office_16,\N
12,51,Tserpara,\N
12,46,Kelly.Aw,\N
12,47,Teri.Lee,\N
12,52,Laks,\N
13,30,KST Opsroom,\N
13,31,Ng Hak Mun,\N
13,34,Herman,\N
13,36,Siti Zainun,\N
13,37,Siti Raudhah,\N
13,38,Tan Yeow Kwang,\N
13,39,Tan Yeow Yong,\N
13,40,Yan Lin,\N
13,44,Office_15,\N
13,45,Office_16,\N
13,51,Tserpara,\N
13,46,Kelly.Aw,\N
13,47,Teri.Lee,\N
13,52,Laks,\N
14,30,KST Opsroom,\N
14,31,Ng Hak Mun,\N
14,34,Herman,\N
14,36,Siti Zainun,\N
14,37,Siti Raudhah,\N
14,38,Tan Yeow Kwang,\N
14,39,Tan Yeow Yong,\N
14,40,Yan Lin,\N
14,44,Office_15,\N
14,45,Office_16,\N
14,51,Tserpara,\N
14,46,Kelly.Aw,\N
14,47,Teri.Lee,\N
14,52,Laks,\N
15,30,KST Opsroom,\N
15,31,Ng Hak Mun,\N
15,34,Herman,\N
15,36,Siti Zainun,\N
15,37,Siti Raudhah,\N
15,38,Tan Yeow Kwang,\N
15,39,Tan Yeow Yong,\N
15,40,Yan Lin,\N
15,41,Thu Ya,\N
15,44,Office_15,\N
15,45,Office_16,\N
15,51,Tserpara,\N
15,46,Kelly.Aw,\N
15,47,Teri.Lee,\N
15,52,Laks,\N
16,30,KST Opsroom,\N
16,31,Ng Hak Mun,\N
16,34,Herman,\N
16,36,Siti Zainun,\N
16,37,Siti Raudhah,\N
16,38,Tan Yeow Kwang,\N
16,39,Tan Yeow Yong,\N
16,40,Yan Lin,\N
16,41,Thu Ya,\N
16,44,Office_15,\N
16,45,Office_16,\N
16,51,Tserpara,\N
16,46,Kelly.Aw,\N
16,47,Teri.Lee,\N
16,52,Laks,\N
17,30,KST Opsroom,\N
17,31,Ng Hak Mun,\N
17,34,Herman,\N
17,36,Siti Zainun,\N
17,37,Siti Raudhah,\N
17,38,Tan Yeow Kwang,\N
17,39,Tan Yeow Yong,\N
17,40,Yan Lin,\N
17,41,Thu Ya,\N
17,44,Office_15,\N
17,45,Office_16,\N
17,51,Tserpara,\N
17,46,Kelly.Aw,\N
17,47,Teri.Lee,\N
17,52,Laks,\N
18,30,KST Opsroom,\N
18,31,Ng Hak Mun,\N
18,34,Herman,\N
18,36,Siti Zainun,\N
18,37,Siti Raudhah,\N
14,33,Khairundin,78
18,33,Khairundin,89
17,33,Khairundin,81
15,33,Khairundin,79
13,33,Khairundin,77
18,38,Tan Yeow Kwang,\N
18,39,Tan Yeow Yong,\N
18,40,Yan Lin,\N
18,41,Thu Ya,\N
18,44,Office_15,\N
18,45,Office_16,\N
18,51,Tserpara,\N
18,46,Kelly.Aw,\N
18,47,Teri.Lee,\N
18,52,Laks,\N
19,30,KST Opsroom,\N
19,31,Ng Hak Mun,\N
19,34,Herman,\N
14,41,Thu Ya,78
12,42,David Liu,151
15,42,David Liu,79
16,42,David Liu,80
18,42,David Liu,89
13,42,David Liu,77
14,42,David Liu,78
12,32,Mark Koh,151
17,32,Mark Koh,156
14,32,Mark Koh,78
15,32,Mark Koh,79
16,32,Mark Koh,80
18,32,Mark Koh,89
14,53,Thonce,78
12,35,Stanley,151
13,53,Thonce,179
15,53,Thonce,79
16,53,Thonce,80
12,53,Thonce,151
18,53,Thonce,89
13,35,Stanley,179
14,35,Stanley,78
16,35,Stanley,80
17,35,Stanley,156
18,35,Stanley,89
19,35,Stanley,83
19,36,Siti Zainun,\N
19,37,Siti Raudhah,\N
19,38,Tan Yeow Kwang,\N
19,39,Tan Yeow Yong,\N
19,40,Yan Lin,\N
19,44,Office_15,\N
19,45,Office_16,\N
19,51,Tserpara,\N
19,46,Kelly.Aw,\N
19,47,Teri.Lee,\N
19,52,Laks,\N
20,30,KST Opsroom,\N
20,31,Ng Hak Mun,\N
20,34,Herman,\N
20,36,Siti Zainun,\N
20,37,Siti Raudhah,\N
20,38,Tan Yeow Kwang,\N
20,39,Tan Yeow Yong,\N
20,40,Yan Lin,\N
20,44,Office_15,\N
20,45,Office_16,\N
20,51,Tserpara,\N
20,46,Kelly.Aw,\N
20,47,Teri.Lee,\N
20,52,Laks,\N
21,30,KST Opsroom,\N
21,31,Ng Hak Mun,\N
21,34,Herman,\N
21,36,Siti Zainun,\N
21,37,Siti Raudhah,\N
21,38,Tan Yeow Kwang,\N
21,39,Tan Yeow Yong,\N
21,40,Yan Lin,\N
21,41,Thu Ya,\N
21,44,Office_15,\N
21,45,Office_16,\N
21,51,Tserpara,\N
21,46,Kelly.Aw,\N
21,47,Teri.Lee,\N
21,52,Laks,\N
22,30,KST Opsroom,\N
22,31,Ng Hak Mun,\N
22,34,Herman,\N
22,36,Siti Zainun,\N
22,37,Siti Raudhah,\N
22,38,Tan Yeow Kwang,\N
22,39,Tan Yeow Yong,\N
22,40,Yan Lin,\N
22,41,Thu Ya,\N
22,44,Office_15,\N
22,45,Office_16,\N
22,51,Tserpara,\N
22,46,Kelly.Aw,\N
22,47,Teri.Lee,\N
22,52,Laks,\N
23,30,KST Opsroom,\N
23,31,Ng Hak Mun,\N
23,34,Herman,\N
23,36,Siti Zainun,\N
23,37,Siti Raudhah,\N
23,38,Tan Yeow Kwang,\N
23,39,Tan Yeow Yong,\N
23,40,Yan Lin,\N
23,41,Thu Ya,\N
23,44,Office_15,\N
23,45,Office_16,\N
23,51,Tserpara,\N
23,46,Kelly.Aw,\N
23,47,Teri.Lee,\N
23,52,Laks,\N
22,33,Khairundin,86
23,33,Khairundin,87
19,33,Khairundin,83
21,33,Khairundin,85
20,41,Thu Ya,84
23,42,David Liu,87
19,42,David Liu,83
20,42,David Liu,84
22,42,David Liu,86
20,32,Mark Koh,84
21,32,Mark Koh,85
22,32,Mark Koh,86
20,53,Thonce,84
22,53,Thonce,86
19,53,Thonce,83
23,53,Thonce,87
21,35,Stanley,85
22,35,Stanley,86
23,35,Stanley,87
27,30,KST Opsroom,\N
27,31,Ng Hak Mun,\N
27,34,Herman,\N
27,36,Siti Zainun,\N
27,37,Siti Raudhah,\N
27,38,Tan Yeow Kwang,\N
27,39,Tan Yeow Yong,\N
27,40,Yan Lin,\N
27,41,Thu Ya,\N
27,44,Office_15,\N
27,45,Office_16,\N
27,51,Tserpara,\N
27,46,Kelly.Aw,\N
27,47,Teri.Lee,\N
27,52,Laks,\N
29,30,KST Opsroom,\N
29,31,Ng Hak Mun,\N
29,34,Herman,\N
29,36,Siti Zainun,\N
29,37,Siti Raudhah,\N
29,38,Tan Yeow Kwang,\N
29,39,Tan Yeow Yong,\N
29,40,Yan Lin,\N
29,41,Thu Ya,\N
29,44,Office_15,\N
29,45,Office_16,\N
29,51,Tserpara,\N
29,46,Kelly.Aw,\N
29,47,Teri.Lee,\N
29,52,Laks,\N
30,30,KST Opsroom,\N
30,31,Ng Hak Mun,\N
30,34,Herman,\N
30,37,Siti Raudhah,\N
30,38,Tan Yeow Kwang,\N
30,39,Tan Yeow Yong,\N
30,40,Yan Lin,\N
30,41,Thu Ya,\N
30,44,Office_15,\N
30,45,Office_16,\N
30,51,Tserpara,\N
30,46,Kelly.Aw,\N
30,47,Teri.Lee,\N
30,52,Laks,\N
31,30,KST Opsroom,\N
31,31,Ng Hak Mun,\N
31,34,Herman,\N
31,36,Siti Zainun,\N
31,38,Tan Yeow Kwang,\N
31,39,Tan Yeow Yong,\N
31,40,Yan Lin,\N
31,41,Thu Ya,\N
31,44,Office_15,\N
31,45,Office_16,\N
31,51,Tserpara,\N
31,46,Kelly.Aw,\N
31,47,Teri.Lee,\N
31,52,Laks,\N
31,33,Khairundin,53
30,33,Khairundin,52
34,30,KST Opsroom,\N
34,31,Ng Hak Mun,\N
29,32,Mark Koh,51
29,42,David Liu,51
30,42,David Liu,52
31,42,David Liu,53
27,32,Mark Koh,49
30,32,Mark Koh,52
34,32,Mark Koh,56
27,53,Thonce,49
30,53,Thonce,52
31,53,Thonce,139
30,35,Stanley,52
27,35,Stanley,49
31,35,Stanley,139
34,34,Herman,\N
34,35,Stanley,\N
34,36,Siti Zainun,\N
34,37,Siti Raudhah,\N
34,38,Tan Yeow Kwang,\N
34,39,Tan Yeow Yong,\N
34,44,Office_15,\N
34,45,Office_16,\N
34,51,Tserpara,\N
34,46,Kelly.Aw,\N
34,47,Teri.Lee,\N
34,52,Laks,\N
35,30,KST Opsroom,\N
35,31,Ng Hak Mun,\N
35,34,Herman,\N
35,35,Stanley,\N
35,36,Siti Zainun,\N
35,37,Siti Raudhah,\N
35,38,Tan Yeow Kwang,\N
35,39,Tan Yeow Yong,\N
35,40,Yan Lin,\N
35,44,Office_15,\N
35,45,Office_16,\N
35,51,Tserpara,\N
35,46,Kelly.Aw,\N
35,47,Teri.Lee,\N
35,52,Laks,\N
36,30,KST Opsroom,\N
36,31,Ng Hak Mun,\N
36,34,Herman,\N
36,35,Stanley,\N
36,36,Siti Zainun,\N
36,37,Siti Raudhah,\N
36,38,Tan Yeow Kwang,\N
36,39,Tan Yeow Yong,\N
36,40,Yan Lin,\N
36,44,Office_15,\N
36,45,Office_16,\N
36,51,Tserpara,\N
36,46,Kelly.Aw,\N
36,47,Teri.Lee,\N
36,52,Laks,\N
37,30,KST Opsroom,\N
37,31,Ng Hak Mun,\N
37,34,Herman,\N
37,35,Stanley,\N
37,36,Siti Zainun,\N
37,37,Siti Raudhah,\N
37,38,Tan Yeow Kwang,\N
37,39,Tan Yeow Yong,\N
37,40,Yan Lin,\N
37,44,Office_15,\N
37,45,Office_16,\N
37,51,Tserpara,\N
37,46,Kelly.Aw,\N
37,47,Teri.Lee,\N
37,52,Laks,\N
38,30,KST Opsroom,\N
38,31,Ng Hak Mun,\N
38,34,Herman,\N
38,35,Stanley,\N
38,36,Siti Zainun,\N
38,37,Siti Raudhah,\N
38,38,Tan Yeow Kwang,\N
38,39,Tan Yeow Yong,\N
38,40,Yan Lin,\N
38,44,Office_15,\N
38,45,Office_16,\N
38,51,Tserpara,\N
38,46,Kelly.Aw,\N
38,47,Teri.Lee,\N
38,52,Laks,\N
39,30,KST Opsroom,\N
39,31,Ng Hak Mun,\N
39,32,Mark Koh,\N
39,33,Khairundin,\N
39,34,Herman,\N
39,35,Stanley,\N
39,36,Siti Zainun,\N
39,37,Siti Raudhah,\N
39,38,Tan Yeow Kwang,\N
39,39,Tan Yeow Yong,\N
39,40,Yan Lin,\N
39,41,Thu Ya,\N
39,42,David Liu,\N
39,43,Bernard Tan,\N
39,44,Office_15,\N
39,45,Office_16,\N
39,51,Tserpara,\N
39,46,Kelly.Aw,\N
39,47,Teri.Lee,\N
39,49,Gunalan,\N
39,52,Laks,\N
39,53,Thonce,\N
40,30,KST Opsroom,\N
40,31,Ng Hak Mun,\N
40,32,Mark Koh,\N
37,33,Khairundin,22
34,33,Khairundin,56
36,33,Khairundin,58
40,33,Khairundin,\N
40,34,Herman,\N
40,35,Stanley,\N
40,36,Siti Zainun,\N
40,37,Siti Raudhah,\N
40,38,Tan Yeow Kwang,\N
40,39,Tan Yeow Yong,\N
40,40,Yan Lin,\N
40,41,Thu Ya,\N
40,42,David Liu,\N
40,44,Office_15,\N
40,45,Office_16,\N
40,46,Kelly.Aw,\N
40,47,Teri.Lee,\N
40,52,Laks,\N
40,53,Thonce,\N
41,30,KST Opsroom,\N
41,31,Ng Hak Mun,\N
41,32,Mark Koh,\N
41,33,Khairundin,\N
41,34,Herman,\N
41,35,Stanley,\N
41,36,Siti Zainun,\N
38,42,David Liu,59
37,41,Thu Ya,338
38,41,Thu Ya,152
35,42,David Liu,124
37,32,Mark Koh,22
34,42,David Liu,56
35,32,Mark Koh,124
36,32,Mark Koh,58
36,53,Thonce,58
34,53,Thonce,56
35,53,Thonce,124
37,53,Thonce,22
38,53,Thonce,152
41,37,Siti Raudhah,\N
41,38,Tan Yeow Kwang,\N
41,39,Tan Yeow Yong,\N
41,40,Yan Lin,\N
41,41,Thu Ya,\N
41,42,David Liu,\N
41,44,Office_15,\N
41,45,Office_16,\N
41,51,Tserpara,\N
41,46,Kelly.Aw,\N
41,47,Teri.Lee,\N
41,53,Thonce,\N
42,30,KST Opsroom,\N
42,31,Ng Hak Mun,\N
42,32,Mark Koh,\N
42,33,Khairundin,\N
42,34,Herman,\N
42,35,Stanley,\N
42,36,Siti Zainun,\N
42,37,Siti Raudhah,\N
42,38,Tan Yeow Kwang,\N
42,39,Tan Yeow Yong,\N
42,40,Yan Lin,\N
42,41,Thu Ya,\N
42,42,David Liu,\N
42,44,Office_15,\N
42,45,Office_16,\N
42,51,Tserpara,\N
42,46,Kelly.Aw,\N
42,47,Teri.Lee,\N
42,52,Laks,\N
9,33,Khairundin,136
38,33,Khairundin,59
35,33,Khairundin,124
29,33,Khairundin,51
20,33,Khairundin,84
16,33,Khairundin,80
6,33,Khairundin,70
12,33,Khairundin,123
31,48,Support,300
9,48,Support,279
6,54,Support 1,276
1,54,Support 1,332
7,54,Support 1,277
2,33,Khairundin,272
13,54,Support 1,283
19,41,Thu Ya,83
1,32,Mark Koh,176
14,54,Support 1,284
9,54,Support 1,279
12,48,Support,317
34,41,Thu Ya,56
36,41,Thu Ya,58
15,54,Support 1,285
17,42,David Liu,81
27,54,Support 1,297
10,54,Support 1,310
2,54,Support 1,272
16,54,Support 1,286
27,42,David Liu,49
19,54,Support 1,289
12,41,Thu Ya,317
9,43,Bernard Tan,279
20,54,Support 1,290
17,54,Support 1,313
1,33,Khairundin,271
21,54,Support 1,291
18,54,Support 1,288
9,12,Zodiac,158
1,41,Thu Ya,332
37,42,David Liu,22
12,54,Support 1,317
22,54,Support 1,292
29,54,Support 1,298
11,54,Support 1,281
3,54,Support 1,335
1,42,David Liu,115
7,42,David Liu,71
21,42,David Liu,85
5,41,Thu Ya,275
8,54,Support 1,278
4,54,Support 1,274
13,41,Thu Ya,283
6,41,Thu Ya,276
5,54,Support 1,275
23,54,Support 1,339
11,53,Thonce,192
39,54,Support 1,\N
40,54,Support 1,\N
41,54,Support 1,\N
42,54,Support 1,\N
13,32,Mark Koh,179
34,54,Support 1,303
4,56,Kumaran,274
19,32,Mark Koh,83
23,32,Mark Koh,87
31,32,Mark Koh,139
1,56,Kumaran,271
35,54,Support 1,304
21,53,Thonce,85
2,56,Kumaran,272
36,54,Support 1,58
9,56,Kumaran,279
22,56,Kumaran,292
38,32,Mark Koh,152
8,30,KST Opsroom,72
9,31,Ng Hak Mun,158
1,55,Joseph Seah,\N
2,55,Joseph Seah,\N
3,55,Joseph Seah,\N
4,55,Joseph Seah,\N
5,55,Joseph Seah,\N
6,55,Joseph Seah,\N
7,55,Joseph Seah,\N
8,55,Joseph Seah,\N
9,55,Joseph Seah,\N
10,55,Joseph Seah,\N
11,55,Joseph Seah,\N
12,55,Joseph Seah,\N
13,55,Joseph Seah,\N
14,55,Joseph Seah,\N
15,55,Joseph Seah,\N
16,55,Joseph Seah,\N
17,55,Joseph Seah,\N
18,55,Joseph Seah,\N
19,55,Joseph Seah,\N
20,55,Joseph Seah,\N
21,55,Joseph Seah,\N
22,55,Joseph Seah,\N
23,55,Joseph Seah,\N
27,55,Joseph Seah,\N
29,55,Joseph Seah,\N
30,55,Joseph Seah,\N
31,55,Joseph Seah,\N
34,55,Joseph Seah,\N
35,55,Joseph Seah,\N
36,55,Joseph Seah,\N
37,55,Joseph Seah,\N
38,55,Joseph Seah,\N
39,55,Joseph Seah,\N
40,55,Joseph Seah,\N
41,55,Joseph Seah,\N
42,55,Joseph Seah,\N
4,40,Yan Lin,68
29,56,Kumaran,298
39,56,Kumaran,\N
40,56,Kumaran,\N
41,56,Kumaran,\N
37,54,Support 1,338
42,56,Kumaran,\N
38,54,Support 1,152
15,56,Kumaran,285
8,56,Kumaran,278
8,11,Kijang,187
8,32,Mark Koh,187
12,56,Kumaran,317
20,56,Kumaran,290
7,53,Thonce,71
9,35,Stanley,158
7,56,Kumaran,277
34,56,Kumaran,303
36,56,Kumaran,58
16,56,Kumaran,286
14,56,Kumaran,284
43,41,Thu Ya,321
17,53,Thonce,156
19,56,Kumaran,289
13,56,Kumaran,283
17,56,Kumaran,313
30,56,Kumaran,299
2,53,Thonce,163
10,56,Kumaran,310
30,54,Support 1,299
23,56,Kumaran,293
38,56,Kumaran,152
35,56,Kumaran,304
31,56,Kumaran,300
18,56,Kumaran,288
27,56,Kumaran,297
21,56,Kumaran,291
29,53,Thonce,51
31,54,Support 1,300
5,56,Kumaran,275
4,35,Stanley,68
11,56,Kumaran,281
15,35,Stanley,79
6,56,Kumaran,276
20,35,Stanley,84
11,14,Loyalty,281
3,56,Kumaran,273
6,31,Ng Hak Mun,276
7,43,Bernard Tan,277
37,56,Kumaran,319
43,1,Super Admin,\N
43,37,Siti Raudhah,\N
43,38,Tan Yeow Kwang,\N
43,39,Tan Yeow Yong,\N
43,40,Yan Lin,\N
43,42,David Liu,\N
43,44,Officer 15,\N
43,45,Officer 16,\N
43,46,Kelly Aw,\N
43,47,Teri Lee,\N
43,49,Gunalan,\N
43,50,Romi,\N
43,51,Tserpara,\N
43,52,Laks,\N
43,53,Thonce,\N
43,55,Joseph Seah,\N
43,56,Kumaran,\N
43,2,Keppel,\N
43,3,KST,\N
43,27,Fleet123,\N
43,30,KST Opsroom,\N
43,31,Ng Hak Mun,\N
43,32,Mark Koh,\N
43,33,Khairundin ,\N
43,35,Stanley,\N
43,36,Siti Zainun,\N
43,54,Chia CJ,321
43,48,Support,321
43,43,Bernard Tan,321
44,1,Super Admin,\N
44,37,Siti Raudhah,\N
44,38,Tan Yeow Kwang,\N
44,39,Tan Yeow Yong,\N
44,40,Yan Lin,\N
44,41,Thu Ya,\N
44,42,David Liu,\N
44,43,Bernard Tan,\N
44,44,Officer 15,\N
44,45,Officer 16,\N
44,46,Kelly Aw,\N
44,47,Teri Lee,\N
44,48,Support,\N
44,49,Gunalan,\N
44,50,Romi,\N
44,51,Tserpara,\N
44,52,Laks,\N
44,53,Thonce,\N
44,54,Chia CJ,\N
44,55,Joseph Seah,\N
44,56,Kumaran,\N
44,2,Keppel,\N
44,3,KST,\N
44,27,Fleet123,\N
44,30,KST Opsroom,\N
44,31,Ng Hak Mun,\N
44,32,Mark Koh,\N
44,33,Khairundin ,\N
44,35,Stanley,\N
44,36,Siti Zainun,\N
45,1,Super Admin,\N
45,37,Siti Raudhah,\N
45,38,Tan Yeow Kwang,\N
45,39,Tan Yeow Yong,\N
45,40,Yan Lin,\N
45,41,Thu Ya,\N
45,42,David Liu,\N
45,43,Bernard Tan,\N
45,44,Officer 15,\N
45,45,Officer 16,\N
45,46,Kelly Aw,\N
45,47,Teri Lee,\N
45,48,Support,\N
45,49,Gunalan,\N
45,50,Romi,\N
45,51,Tserpara,\N
45,52,Laks,\N
45,53,Thonce,\N
45,54,Chia CJ,\N
45,55,Joseph Seah,\N
45,56,Kumaran,\N
45,2,Keppel,\N
45,3,KST,\N
45,27,Fleet123,\N
45,30,KST Opsroom,\N
45,31,Ng Hak Mun,\N
45,32,Mark Koh,\N
45,33,Khairundin ,\N
45,35,Stanley,\N
45,36,Siti Zainun,\N
46,1,Super Admin,\N
46,37,Siti Raudhah,\N
46,38,Tan Yeow Kwang,\N
46,39,Tan Yeow Yong,\N
46,40,Yan Lin,\N
46,41,Thu Ya,\N
46,42,David Liu,\N
46,43,Bernard Tan,\N
46,44,Officer 15,\N
46,45,Officer 16,\N
46,46,Kelly Aw,\N
46,47,Teri Lee,\N
46,48,Support,\N
46,49,Gunalan,\N
46,50,Romi,\N
46,51,Tserpara,\N
46,52,Laks,\N
46,53,Thonce,\N
46,54,Chia CJ,\N
46,55,Joseph Seah,\N
46,56,Kumaran,\N
46,2,Keppel,\N
46,3,KST,\N
46,27,Fleet123,\N
46,30,KST Opsroom,\N
46,31,Ng Hak Mun,\N
46,32,Mark Koh,\N
46,33,Khairundin ,\N
46,35,Stanley,\N
46,36,Siti Zainun,\N
47,1,Super Admin,\N
47,37,Siti Raudhah,\N
47,38,Tan Yeow Kwang,\N
47,39,Tan Yeow Yong,\N
47,40,Yan Lin,\N
47,41,Thu Ya,\N
47,42,David Liu,\N
47,43,Bernard Tan,\N
47,44,Officer 15,\N
47,45,Officer 16,\N
47,46,Kelly Aw,\N
47,47,Teri Lee,\N
47,48,Support,\N
47,49,Gunalan,\N
47,50,Romi,\N
47,51,Tserpara,\N
47,52,Laks,\N
47,53,Thonce,\N
47,54,Chia CJ,\N
47,55,Joseph Seah,\N
47,56,Kumaran,\N
47,2,Keppel,\N
47,3,KST,\N
47,27,Fleet123,\N
47,30,KST Opsroom,\N
47,31,Ng Hak Mun,\N
47,32,Mark Koh,\N
47,33,Khairundin ,\N
47,35,Stanley,\N
47,36,Siti Zainun,\N
48,1,Super Admin,\N
48,37,Siti Raudhah,\N
48,38,Tan Yeow Kwang,\N
48,39,Tan Yeow Yong,\N
48,40,Yan Lin,\N
48,41,Thu Ya,\N
48,42,David Liu,\N
48,43,Bernard Tan,\N
48,44,Officer 15,\N
48,45,Officer 16,\N
48,46,Kelly Aw,\N
48,47,Teri Lee,\N
48,48,Support,\N
48,49,Gunalan,\N
48,50,Romi,\N
48,51,Tserpara,\N
48,52,Laks,\N
48,53,Thonce,\N
48,54,Chia CJ,\N
48,55,Joseph Seah,\N
48,56,Kumaran,\N
48,2,Keppel,\N
48,3,KST,\N
48,27,Fleet123,\N
48,30,KST Opsroom,\N
48,31,Ng Hak Mun,\N
48,32,Mark Koh,\N
48,33,Khairundin ,\N
48,35,Stanley,\N
48,36,Siti Zainun,\N
25,48,Support,295
24,48,Support,294
24,54,Chia CJ,294
26,48,Support,296
37,48,Support,338
25,1,Super Admin,\N
25,37,Siti Raudhah,\N
25,38,Tan Yeow Kwang,\N
25,39,Tan Yeow Yong,\N
25,40,Yan Lin,\N
25,41,Thu Ya,\N
25,42,David Liu,\N
25,43,Bernard Tan,\N
25,44,Officer 15,\N
25,45,Officer 16,\N
25,46,Kelly Aw,\N
25,47,Teri Lee,\N
25,49,Gunalan,\N
25,50,Romi,\N
25,51,Tserpara,\N
25,52,Laks,\N
24,1,Super Admin,\N
24,2,Keppel,\N
24,37,Siti Raudhah,\N
24,38,Tan Yeow Kwang,\N
24,39,Tan Yeow Yong,\N
24,40,Yan Lin,\N
24,41,Thu Ya,\N
24,42,David Liu,\N
24,43,Bernard Tan,\N
24,44,Officer 15,\N
24,45,Officer 16,\N
24,46,Kelly Aw,\N
24,47,Teri Lee,\N
24,49,Gunalan,\N
24,50,Romi,\N
24,51,Tserpara,\N
24,52,Laks,\N
24,53,Thonce,\N
24,55,Joseph Seah,\N
24,56,Kumaran,\N
24,3,KST,\N
24,27,Fleet123,\N
24,30,KST Opsroom,\N
24,31,Ng Hak Mun,\N
24,32,Mark Koh,\N
24,33,Khairundin ,\N
25,53,Thonce,\N
24,35,Stanley,\N
24,36,Siti Zainun,\N
25,55,Joseph Seah,\N
25,56,Kumaran,\N
25,2,Keppel,\N
25,3,KST,\N
25,27,Fleet123,\N
25,30,KST Opsroom,\N
25,31,Ng Hak Mun,\N
25,32,Mark Koh,\N
25,33,Khairundin ,\N
25,35,Stanley,\N
25,36,Siti Zainun,\N
26,1,Super Admin,\N
26,2,Keppel,\N
26,37,Siti Raudhah,\N
26,38,Tan Yeow Kwang,\N
26,39,Tan Yeow Yong,\N
26,40,Yan Lin,\N
26,41,Thu Ya,\N
26,42,David Liu,\N
26,43,Bernard Tan,\N
26,44,Officer 15,\N
26,45,Officer 16,\N
26,46,Kelly Aw,\N
26,47,Teri Lee,\N
26,49,Gunalan,\N
26,50,Romi,\N
26,51,Tserpara,\N
26,52,Laks,\N
26,53,Thonce,\N
26,55,Joseph Seah,\N
26,56,Kumaran,\N
25,54,Chia CJ,295
26,3,KST,\N
26,27,Fleet123,\N
26,30,KST Opsroom,\N
26,31,Ng Hak Mun,\N
26,32,Mark Koh,\N
26,33,Khairundin ,\N
26,35,Stanley,\N
26,36,Siti Zainun,\N
26,54,Chia CJ,296
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chats (chat_id, chat_name, chat_type) FROM stdin  DELIMITER ',';
3,KST Sky,vessel
4,KST Skill,vessel
5,KST Success,vessel
6,KST Summit,vessel
7,KST Kancil,vessel
8,KST Kijang,vessel
9,KST Zodiac,vessel
10,KST Liberty,vessel
11,KST Loyalty,vessel
12,Maju 510,vessel
13,Maju 511,vessel
17,KST Passion,vessel
18,KST Pride,vessel
19,KST 35,vessel
20,KST 36,vessel
24,KST Opsroom,management
25,Ng Hak Mun,management
26,Mark Koh,management
27,Khairundin,management
29,Stanley,management
30,Siti Zainun,management
31,Siti Raudhah,management
34,Yan Lin,management
35,Thu Ya,management
36,David Liu,management
37,Bernard Tan,management
38,Gunalan,management
1,KST 31,vessel
2,KST 33,vessel
14,KST Stellar,vessel
15,KST 56,vessel
16,KST 58,vessel
21,KST Super,vessel
22,KST Mercury,vessel
23,KST Mars,vessel
39,Romi,management
40,Tserpara,management
41,Laks,management
42,Thonce,management
43,Kumaran,management
44,Officer 15,management
45,Officer 16,management
46,Kelly Aw,management
47,Teri Lee,management
48,Joseph Seah,management
\.


--
-- Data for Name: crew; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crew (crew_id, employee_no, joining_date, name, rank, vessel_id, nationality, remarks, months_as_of_31jul2021) FROM stdin  DELIMITER ',';
51,\N,\N,\N,\N,1,\N,\N,\N
52,\N,\N,\N,\N,1,\N,\N,\N
53,\N,\N,\N,\N,1,\N,\N,\N
54,\N,\N,\N,\N,1,\N,\N,\N
55,\N,2022-07-22 13:28:00+08,\N,\N,1,\N,\N,\N
57,57,2022-05-27 12:00:00+08,Nurinsyah,Chief Officer,2,Indonesian,\N,\N
58,58,2022-05-27 12:00:00+08,Muhammad Syafei,Chief Officer,2,Indonesian,\N,\N
59,59,2021-11-25 09:54:00+08,Asari Meirizon,Chief Engineer,2,Indonesian,\N,\N
60,60,2022-09-06 11:14:00+08,Hartono R,2nd Engineer,2,Indonesian,\N,\N
61,61,2022-11-14 11:14:00+08,Hasbar Mahyuddin,AB,2,Indonesian,\N,\N
63,\N,\N,\N,\N,2,\N,\N,\N
64,\N,\N,\N,\N,2,\N,\N,\N
65,\N,\N,\N,\N,2,\N,\N,\N
66,\N,\N,\N,\N,2,\N,\N,\N
70,70,2022-06-02 12:00:00+08,Fernanda Nurul Musthofa,2nd Engineer,5,Indonesian,\N,\N
73,\N,\N,\N,\N,5,\N,\N,\N
74,\N,\N,\N,\N,5,\N,\N,\N
75,\N,\N,\N,\N,5,\N,\N,\N
76,\N,\N,\N,\N,5,\N,\N,\N
77,\N,\N,\N,\N,5,\N,\N,\N
79,79,2022-05-27 12:00:00+08,La Ode Aryadit,Chief Officer,6,Indonesian,\N,\N
80,80,2022-09-21 12:00:00+08,Mochamad Amin,Chief Engineer,6,Indonesian,\N,\N
81,81,2022-04-08 12:00:00+08,Irawan Santoso,2nd Engineer,6,Indonesian,\N,\N
82,82,2022-05-27 12:00:00+08,Taufik Hidayat,AB,6,Indonesian,\N,\N
83,83,2022-09-21 12:00:00+08,Azhani,AB,6,Indonesian,\N,\N
84,,2022-07-08 09:56:00+08,,,6,,\N,\N
85,\N,\N,\N,\N,6,\N,\N,\N
86,\N,\N,\N,\N,6,\N,\N,\N
87,\N,\N,\N,\N,6,\N,\N,\N
88,\N,\N,\N,\N,6,\N,\N,\N
89,,2021-08-27 12:00:00+08,,,3,,\N,\N
90,90,2022-04-01 12:00:00+08,Akhmad Yogi Mubarok,Chief Officer,3,Indonesian,\N,\N
91,91,2022-06-30 12:00:00+08,Risky Yolanda Saputra,Chief Officer,3,Indonesian,\N,\N
92,92,2022-11-04 12:00:00+08,Jamaludin Helidek,Chief Engineer,3,Indonesian,\N,\N
93,93,2022-06-16 12:00:00+08,Matius Bunga,2nd Engineer,3,Indonesian,\N,\N
94,94,2022-05-27 12:00:00+08,Abdullah bin Muhammad Zaeni,AB,3,Indonesian,\N,\N
95,95,2022-02-04 08:53:00+08,Panji Pramana Kusuma,AB,3,Indonesian,\N,\N
96,\N,\N,\N,\N,3,\N,\N,\N
97,\N,\N,\N,\N,3,\N,\N,\N
98,\N,\N,\N,\N,3,\N,\N,\N
99,\N,\N,\N,\N,3,\N,\N,\N
172,,2022-11-28 09:52:00+08,,,13,,\N,\N
178,178,2022-10-04 12:00:00+08,Wahyu Siang Hadi,Chief Engineer,4,Indonesian,\N,\N
180,\N,\N,\N,\N,4,\N,\N,\N
185,\N,\N,\N,\N,4,\N,\N,\N
186,\N,\N,\N,\N,4,\N,\N,\N
190,,2021-09-04 12:00:00+08,,,14,,\N,\N
191,,2022-05-20 11:48:00+08,,,14,,\N,\N
192,\N,\N,\N,\N,14,\N,\N,\N
4,4,2021-10-29 12:00:00+08,Sugeng Priyanto,2nd Engineer,19,Indonesian,\N,\N
5,5,2021-10-29 12:00:00+08,Oky Sugiarto,AB,19,Indonesian,\N,\N
6,6,2022-01-20 12:00:00+08,Sudjono,AB,19,Indonesian,\N,\N
7,,2022-04-29 10:44:00+08,,\N,19,\N,\N,\N
8,,2022-04-29 10:44:00+08,,\N,19,\N,\N,\N
9,\N,\N,\N,\N,19,\N,\N,\N
10,\N,\N,\N,\N,19,\N,\N,\N
11,\N,\N,\N,\N,19,\N,\N,\N
17,17,2021-04-28 12:00:00+08,Masudi (DG),AB,20,Indonesian,\N,\N
18,\N,\N,\N,\N,20,\N,\N,\N
19,\N,\N,\N,\N,20,\N,\N,\N
20,\N,\N,\N,\N,20,\N,\N,\N
21,\N,\N,\N,\N,20,\N,\N,\N
22,\N,\N,\N,\N,20,\N,\N,\N
23,23,2022-03-23 12:00:00+08,Budi Hartono,Master,17,Indonesian,\N,\N
24,24,2022-10-12 12:00:00+08,Edwar Sonata,Master,17,Indonesian,\N,\N
25,,2022-10-25 12:00:00+08,,,17,,\N,\N
26,26,2022-02-04 12:00:00+08,Yackub Bin Abu,Chief Engineer,17,Indonesian,\N,\N
27,27,2022-04-01 12:00:00+08,Sunaryo Suparno,Chief Engineer,17,Indonesian,\N,\N
28,28,2022-02-22 12:00:00+08,Ansharuddin,Chief Engineer,17,Indonesian,\N,\N
29,29,2021-10-25 12:00:00+08,Chandra Kurnia Issasmita,AB,17,Indonesian,\N,\N
31,,2021-11-07 09:04:00+08,,,17,,\N,\N
32,\N,\N,\N,\N,17,\N,\N,\N
33,\N,\N,\N,,17,\N,\N,\N
34,32,2022-02-04 12:00:00+08,Afdal,Master,18,Indonesian,\N,\N
35,33,2021-11-02 12:00:00+08,Abdul Rahim,Master,18,Indonesian,\N,\N
36,34,2022-10-25 12:00:00+08,Julianus Hutahaean,Chief Officer,18,Indonesian,\N,\N
37,35,2022-03-23 12:00:00+08,Raymond Alexander T,Chief Engineer,18,Indonesian,\N,\N
38,36,2022-01-14 12:00:00+08,Abdul Hamid,2nd Engineer,18,Indonesian,\N,\N
39,37,2022-02-25 12:00:00+08,Ansharuddin,2nd Engineer,18,Indonesian,\N,\N
40,38,2022-03-23 12:00:00+08,Misjaya,AB,18,Indonesian,\N,\N
41,39,2022-07-18 14:32:00+08,Idil Saputra,AB,18,Indonesian,\N,\N
42,40,2022-03-23 10:02:00+08,Mistar,AB,18,Indonesian,\N,\N
43,\N,\N,,\N,18,\N,\N,\N
44,\N,\N,\N,\N,18,\N,\N,\N
46,46,2022-05-27 12:00:00+08,Melki Sumule,Chief Officer,1,Indonesian,\N,\N
47,47,2022-06-02 12:00:00+08,Fahnizar Hendra,Chief Engineer,1,Indonesian,\N,\N
48,48,2022-05-27 09:50:00+08,Kadri,AB,1,Indonesian,\N,\N
49,\N,\N,\N,\N,1,\N,\N,\N
50,\N,\N,\N,\N,1,\N,\N,\N
16,16,2021-04-28 12:00:00+08,Setiyono (DG),AB,20,Indonesian,\N,\N
30,30,2022-07-18 14:40:00+08,Boyke Meyofandha,AB,17,Indonesian,\N,\N
155,155,2022-01-22 12:00:00+08,Zaenal Arifin,Master,12,Indonesian,\N,\N
157,157,2021-11-07 12:00:00+08,Agung Haryono,Chief Engineer,12,Indonesian,\N,\N
158,158,2022-04-08 12:00:00+08,Didik Hariyanto,2nd Engineer,12,Indonesian,\N,\N
159,159,2022-02-04 12:00:00+08,Muhammad Arifin,AB,12,Indonesian,\N,\N
160,160,2022-05-27 12:00:00+08,Budi Prayitno,AB,12,Indonesian,\N,\N
161,,2022-11-28 15:30:00+08,,,12,,\N,\N
162,\N,\N,\N,\N,12,\N,\N,\N
163,\N,\N,\N,\N,12,\N,\N,\N
164,\N,\N,\N,\N,12,\N,\N,\N
165,\N,\N,\N,\N,12,\N,\N,\N
166,166,2022-10-12 12:00:00+08,Chrestian Gamis,Master,13,Indonesian,\N,\N
168,168,2022-04-08 12:00:00+08,Daniel Kondorura,Chief Engineer,13,Indonesian,\N,\N
169,169,2022-04-08 12:00:00+08,Friderix Abeng,2nd Engineer,13,Indonesian,\N,\N
170,170,2020-08-04 12:00:00+08,Muhammad Yunus,AB,13,Indonesian,\N,\N
171,171,2022-07-06 12:00:00+08,Dominggus Daud,AB,13,Indonesian,\N,\N
173,\N,\N,\N,\N,13,\N,\N,\N
174,\N,\N,\N,\N,13,\N,\N,\N
175,\N,\N,\N,\N,13,\N,\N,\N
176,\N,\N,\N,\N,13,\N,\N,\N
179,179,2022-05-27 12:00:00+08,Rendra Hermawan,AB,4,Indonesian,\N,\N
181,\N,\N,\N,\N,4,\N,\N,\N
182,\N,\N,\N,\N,4,\N,\N,\N
183,\N,\N,\N,\N,4,\N,\N,\N
184,\N,\N,\N,\N,4,\N,\N,\N
187,\N,\N,\N,\N,4,\N,\N,\N
188,188,2021-09-21 11:14:00+08,Agus Saputro,2nd Engineer,14,Indonesian,\N,\N
193,\N,\N,\N,\N,14,\N,\N,\N
194,\N,\N,\N,\N,14,\N,\N,\N
195,\N,\N,\N,\N,14,\N,\N,\N
196,\N,\N,\N,\N,14,\N,\N,\N
197,\N,\N,\N,\N,14,\N,\N,\N
198,\N,\N,\N,\N,14,\N,\N,\N
201,201,2022-06-02 12:00:00+08,Muhammad Dafir,Chief Engineer,8,Indonesian,\N,\N
202,202,2022-10-04 12:00:00+08,Isak Tandi Liling,2nd Engineer,8,Indonesian,\N,\N
203,203,2022-05-20 12:00:00+08,Bermans Mangaronda,AB,8,Indonesian,\N,\N
209,\N,\N,\N,\N,8,\N,\N,\N
217,\N,\N,\N,\N,7,\N,\N,\N
220,\N,\N,\N,\N,7,\N,\N,\N
222,222,2021-11-07 12:00:00+08,Wahyu,Chief Engineer,15,Indonesian,\N,\N
224,224,2022-05-20 09:23:00+08,Marshell Elia Sanger,AB,15,Indonesian,\N,\N
226,,2022-09-14 12:26:00+08,,,15,,\N,\N
228,\N,\N,\N,\N,15,\N,\N,\N
231,\N,\N,\N,\N,15,\N,\N,\N
234,252,2022-11-22 12:00:00+08,Swara Mahardhika,Master,16,Indonesian,\N,\N
236,254,2022-04-08 10:30:00+08,Tonny Tampubolon,2nd Engineer,16,Indonesian,\N,\N
238,,2022-09-06 10:30:00+08,,,16,,\N,\N
240,,2022-09-14 10:30:00+08,,,16,,\N,\N
242,,2022-09-14 10:30:00+08,,,16,,\N,\N
246,246,2022-09-16 12:00:00+08,Sumansur,Chief Engineer,22,Indonesian,\N,\N
248,248,2022-02-25 12:00:00+08,Andi Fahri,AB,22,Indonesian,\N,\N
250,\N,\N,,\N,22,\N,\N,\N
253,\N,\N,\N,\N,22,\N,\N,\N
72,72,2022-05-20 12:00:00+08,Heri Susanto,AB,5,Indonesian,\N,\N
78,78,2022-12-05 12:00:00+08,Hery Siswanto,Master,6,Indonesian,\N,\N
100,100,\N,Rahim,Master,21,Singaporean,\N,\N
102,102,2022-10-14 12:00:00+08,Anas Sambayon,AB,21,Indonesian,\N,\N
103,\N,\N,\N,\N,21,\N,\N,\N
104,\N,\N,\N,\N,21,\N,\N,\N
105,\N,\N,\N,\N,21,\N,\N,\N
106,\N,\N,\N,\N,21,\N,\N,\N
107,\N,\N,\N,\N,21,\N,\N,\N
108,\N,\N,\N,\N,21,\N,\N,\N
109,\N,\N,\N,\N,21,\N,\N,\N
110,\N,\N,\N,\N,21,\N,\N,\N
111,111,2021-01-27 12:00:00+08,Enos Arung,Master,9,Indonesian,\N,\N
114,114,2022-05-27 12:00:00+08,Syafei,2nd Engineer,9,Indonesian,\N,\N
116,116,2022-04-28 12:00:00+08,Wahyu Ahmad Akbar,AB,9,Indonesian,\N,\N
117,\N,\N,\N,\N,9,\N,\N,\N
119,\N,\N,\N,\N,9,\N,\N,\N
120,\N,\N,\N,\N,9,\N,\N,\N
121,\N,\N,\N,\N,9,\N,\N,\N
122,,2022-12-08 12:00:00+08,,,10,,\N,\N
123,123,2022-10-01 12:00:00+08,Hendro Widodo,Master,10,Indonesian,\N,\N
124,124,2022-03-04 12:00:00+08,Budiman,Chief Officer,10,Indonesian,\N,\N
125,125,2022-07-18 12:00:00+08,Hendra Iskandar,Chief Engineer,10,Indonesian,\N,\N
126,126,2022-06-30 12:00:00+08,Nurdin Ridwan,Chief Engineer,10,Indonesian,\N,\N
127,127,2022-04-01 12:00:00+08,Wawan Hermanto,AB,10,Indonesian,\N,\N
128,128,2022-07-22 09:08:00+08,Mustaming Saing,AB,10,Indonesian,\N,\N
129,\N,\N,\N,\N,10,\N,\N,\N
130,\N,\N,\N,\N,10,\N,\N,\N
131,\N,\N,\N,\N,10,\N,\N,\N
132,\N,\N,\N,\N,10,\N,\N,\N
133,,2021-04-21 12:00:00+08,,,11,,\N,\N
134,134,2022-10-25 12:00:00+08,Jaka Setiawan,Master,11,Indonesian,\N,\N
135,135,2022-08-21 12:00:00+08,Abdullah Muhammad Kosyim,Chief Officer,11,Indonesian,\N,\N
136,136,2022-04-08 12:00:00+08,Burhanudin Harahap,Chief Engineer,11,Indonesian,\N,\N
139,139,2022-08-29 09:52:00+08,Eric jaya Wongkar,AB,11,Indonesian,\N,\N
147,147,2022-09-06 11:14:00+08,Wahyu Sudiarto,2nd Engineer,23,Indonesian,\N,\N
148,148,2022-04-08 11:14:00+08,Dedi Masluhi,AB,23,Indonesian,\N,\N
150,\N,\N,\N,,23,,\N,\N
151,\N,\N,\N,\N,23,\N,\N,\N
152,\N,\N,\N,\N,23,\N,\N,\N
153,\N,\N,\N,\N,23,\N,\N,\N
154,\N,\N,\N,\N,23,\N,\N,\N
219,\N,\N,\N,\N,7,\N,\N,\N
251,\N,\N,,\N,22,\N,\N,\N
2,2,2021-10-29 12:00:00+08,Radius Iswaji,Chief Officer,19,Indonesian,\N,\N
56,,2022-08-27 12:00:00+08,,,2,,\N,\N
62,62,2022-07-18 11:14:00+08,Aziz mulhikam,AB,2,Indonesian,\N,\N
112,112,2022-07-18 12:00:00+08,Kaswadi,Chief Officer,9,Indonesian,\N,\N
142,\N,\N,,,11,\N,\N,\N
143,\N,\N,\N,\N,11,\N,\N,\N
177,177,2022-08-29 12:00:00+08,Retno Bangkit Widekso,Chief Officer,4,Indonesian,\N,\N
189,189,2022-09-06 12:00:00+08,Ainuddin,AB,14,Indonesian,\N,\N
199,199,2022-09-06 12:00:00+08,Muzayyin,Master,8,Singaporean,\N,\N
208,\N,\N,\N,\N,8,\N,\N,\N
210,,\N,,Local Master,7,,\N,\N
211,211,2022-05-27 12:00:00+08,Heri Susanto,Chief Engineer,7,Indonesian,\N,\N
221,221,\N,Budiman,Chief Officer,15,Singaporean,\N,\N
223,223,2022-09-21 12:00:00+08,Nurhali,AB,15,Indonesian,\N,\N
237,255,2022-05-20 10:30:00+08,Wasito,AB,16,Indonesian,\N,\N
239,,2022-09-14 10:30:00+08,,,16,\N,\N,\N
252,\N,\N,\N,\N,22,\N,\N,\N
3,3,2021-09-04 12:00:00+08,Ganda Fakarja,Chief Engineer,19,Indonesian,\N,\N
12,12,2021-10-29 12:00:00+08,Agus Ridjal,Master,20,Indonesian,\N,\N
13,13,2021-11-14 12:00:00+08,Ari Suhartono,Chief Officer,20,Indonesian,\N,\N
113,113,2022-07-18 12:00:00+08,Denis Frans Kenedy Limbong,Chief Engineer,9,Indonesian,\N,\N
115,115,2022-07-18 12:00:00+08,Doni Erizon,AB,9,Indonesian,\N,\N
118,\N,\N,\N,\N,9,\N,\N,\N
144,144,2022-07-22 12:00:00+08,Daning Setiawan,Master,23,Indonesian,\N,\N
145,145,2022-08-29 12:00:00+08,Andesbo,Chief Officer,23,Indonesian,\N,\N
212,212,2022-05-20 12:00:00+08,Sovly Moningka,AB,7,Indonesian,\N,\N
213,,2022-05-20 10:19:00+08,,,7,,\N,\N
225,,2022-07-15 09:23:00+08,,,15,,\N,\N
227,\N,\N,\N,\N,15,\N,\N,\N
229,\N,\N,\N,\N,15,\N,\N,\N
241,,2022-09-14 10:30:00+08,,,16,,\N,\N
243,,2022-09-06 12:00:00+08,,,22,,\N,\N
244,244,2022-09-06 12:00:00+08,Riky M Lawalata,Master,22,Indonesian,\N,\N
245,245,2022-08-29 12:00:00+08,Achmad Novandi,Chief Engineer,22,Indonesian,\N,\N
14,14,2021-09-04 12:00:00+08,Yantedi Bin Daman,Chief Engineer,20,Indonesian,\N,\N
15,15,2021-10-29 12:00:00+08,Eko Yuliyanto,2nd Engineer,20,Indonesian,\N,\N
67,67,2022-05-27 12:00:00+08,Phengky Rohadi,Master,5,Indonesian,\N,\N
68,68,2022-06-02 12:00:00+08,Muhammad Yusri,Chief Officer,5,Indonesian,\N,\N
69,69,2022-12-08 12:00:00+08,Athanasius Rustanto,Chief Engineer,5,Indonesian,\N,\N
137,137,2022-04-08 12:00:00+08,Heriawan Matsirat,2nd Engineer,11,Indonesian,\N,\N
138,138,2022-05-27 12:00:00+08,Muhammad Suud,AB,11,Indonesian,\N,\N
146,146,2021-12-01 12:00:00+08,Oktavianus Pangandaheng,Chief Engineer,23,Indonesian,\N,\N
247,247,2022-09-16 12:00:00+08,Abraham Leo,2nd Engineer,22,Indonesian,\N,\N
1,1,2021-09-04 12:00:00+08,Agud Sukowati,Master,19,Indonesian,\N,\N
45,,2020-12-17 12:00:00+08,,,1,,\N,\N
140,\N,\N,\N,\N,11,\N,\N,\N
149,149,2022-09-06 11:14:00+08,Tomi Erick Febriyanto Limbong,AB,23,Indonesian,\N,\N
156,156,2022-06-06 12:00:00+08,Slamet Haryadi,Chief Officer,12,Indonesian,\N,\N
200,200,2022-05-20 12:00:00+08,Rudy Darmansyah,Chief Officer,8,Indonesian,\N,\N
204,204,2022-10-14 12:00:00+08,Syaihunar Rasyid,AB,8,Indonesian,\N,\N
214,,2022-07-22 10:19:00+08,,,7,,\N,\N
215,,2022-07-22 10:19:00+08,,,7,,\N,\N
216,,2022-07-22 09:04:00+08,,,7,,\N,\N
230,\N,\N,\N,\N,15,\N,\N,\N
71,71,2022-09-21 12:00:00+08,Zainul Rofik,AB,5,Indonesian,\N,\N
232,,2021-11-07 12:00:00+08,,,16,,\N,\N
233,,2022-08-31 12:00:00+08,,,16,,\N,\N
249,249,2022-02-23 10:35:00+08,Burhanudin Sunaryo,AB,22,Indonesian,\N,\N
101,101,2022-05-27 12:00:00+08,Nopriyanto Bin Ratu Penutup,Chief Engineer,21,Indonesian,\N,\N
141,\N,\N,\N,\N,11,\N,\N,\N
167,167,2022-04-28 12:00:00+08,Raymond Peter Pane,Chief Officer,13,Indonesian,\N,\N
205,,2022-11-28 10:22:00+08,,,8,,\N,\N
206,\N,\N,\N,\N,8,\N,\N,\N
207,\N,\N,\N,\N,8,\N,\N,\N
218,\N,\N,\N,\N,7,\N,\N,\N
235,253,2022-08-29 10:30:00+08,Sutan Saril,Chief Officer,16,Indonesian,\N,\N
\.


--
-- Data for Name: generator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generator (generator_identifier, vessel_id, order_id) FROM stdin  DELIMITER ',';
AE 1,1,1
AE 2,1,2
AE 1,2,1
AE 2,2,2
AE 1,3,1
AE 2,3,2
AE 1,4,1
AE 2,4,2
AE 1,5,1
AE 2,5,2
AE 1,6,1
AE 2,6,2
AE 1,7,1
AE 2,7,2
AE 1,8,1
AE 2,8,2
AE 1,9,1
AE 2,9,2
AE 1,10,1
AE 2,10,2
AE 1,11,1
AE 2,11,2
AE 1,12,1
AE 2,12,2
AE 3,12,3
AE 1,13,1
AE 2,13,2
AE 3,13,3
AE 1,14,1
AE 2,14,2
AE 1,15,1
AE 2,15,2
AE 3,15,3
AE 1,16,1
AE 2,16,2
AE 3,16,3
AE 1,17,1
AE 2,17,2
AE 1,18,1
AE 2,18,2
AE 1,19,1
AE 2,19,2
AE 1,20,1
AE 2,20,2
AE 1,21,1
AE 2,21,2
AE 1,22,1
AE 2,22,2
AE 3,22,3
AE 1,23,1
AE 2,23,2
AE 3,23,3
\.


--
-- Data for Name: lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lock (pagelock, page, vessel_id, crew_id, currentuser) FROM stdin  DELIMITER ',';
\N,VESSELREPORT,21,\N,\N
\N,DAILYLOG,22,\N,\N
\N,VESSELDISINFECTION,12,\N,\N
\N,DAILYLOG,16,\N,\N
\N,CREWTEMPERATURELOG,11,\N,\N
\N,VESSELDISINFECTION,11,\N,\N
\N,VESSELDISINFECTION,23,\N,\N
\N,CREWTEMPERATURELOG,5,\N,\N
\N,VESSELDISINFECTION,6,\N,\N
\N,VESSELREPORT,19,\N,\N
\N,DAILYLOG,19,\N,\N
\N,CREWTEMPERATURELOG,19,\N,\N
\N,VESSELDISINFECTION,20,\N,\N
\N,DAILYLOG,12,\N,\N
\N,DAILYLOG,10,\N,\N
\N,VESSELDISINFECTION,9,\N,\N
\N,CREWTEMPERATURELOG,17,\N,\N
\N,CREWTEMPERATURELOG,14,\N,\N
\N,CREWTEMPERATURELOG,21,\N,\N
\N,VESSELDISINFECTION,21,\N,\N
\N,VESSELBREAKDOWN,25,\N,\N
\N,VESSELBREAKDOWN,16,\N,\N
\N,VESSELBREAKDOWN,14,\N,\N
\N,VESSELDISINFECTION,14,\N,\N
\N,VESSELBREAKDOWN,21,\N,\N
\N,VESSELBREAKDOWN,18,\N,\N
\N,CREWWORKANDRESTHOUR,\N,28,\N
\N,CREWWORKANDRESTHOUR,\N,29,\N
\N,CREWWORKANDRESTHOUR,\N,30,\N
\N,CREWWORKANDRESTHOUR,\N,31,\N
\N,CREWWORKANDRESTHOUR,\N,32,\N
\N,CREWWORKANDRESTHOUR,\N,33,\N
\N,CREWWORKANDRESTHOUR,\N,34,\N
\N,CREWWORKANDRESTHOUR,\N,35,\N
\N,CREWWORKANDRESTHOUR,\N,36,\N
\N,CREWWORKANDRESTHOUR,\N,37,\N
\N,CREWWORKANDRESTHOUR,\N,38,\N
\N,CREWWORKANDRESTHOUR,\N,39,\N
\N,CREWWORKANDRESTHOUR,\N,40,\N
\N,CREWWORKANDRESTHOUR,\N,41,\N
\N,CREWWORKANDRESTHOUR,\N,42,\N
\N,CREWWORKANDRESTHOUR,\N,43,\N
\N,CREWWORKANDRESTHOUR,\N,44,\N
\N,CREWWORKANDRESTHOUR,\N,45,\N
\N,CREWWORKANDRESTHOUR,\N,46,\N
\N,CREWWORKANDRESTHOUR,\N,47,\N
\N,CREWWORKANDRESTHOUR,\N,48,\N
\N,CREWWORKANDRESTHOUR,\N,49,\N
\N,CREWWORKANDRESTHOUR,\N,50,\N
\N,CREWWORKANDRESTHOUR,\N,51,\N
\N,CREWWORKANDRESTHOUR,\N,52,\N
\N,CREWWORKANDRESTHOUR,\N,53,\N
\N,CREWWORKANDRESTHOUR,\N,54,\N
\N,CREWWORKANDRESTHOUR,\N,55,\N
\N,CREWWORKANDRESTHOUR,\N,56,\N
\N,CREWWORKANDRESTHOUR,\N,57,\N
\N,CREWWORKANDRESTHOUR,\N,58,\N
\N,CREWWORKANDRESTHOUR,\N,59,\N
\N,CREWWORKANDRESTHOUR,\N,60,\N
\N,CREWWORKANDRESTHOUR,\N,61,\N
\N,CREWWORKANDRESTHOUR,\N,62,\N
\N,CREWWORKANDRESTHOUR,\N,63,\N
\N,CREWWORKANDRESTHOUR,\N,64,\N
\N,CREWWORKANDRESTHOUR,\N,65,\N
\N,CREWWORKANDRESTHOUR,\N,66,\N
\N,CREWWORKANDRESTHOUR,\N,67,\N
\N,CREWWORKANDRESTHOUR,\N,68,\N
\N,CREWWORKANDRESTHOUR,\N,69,\N
\N,CREWWORKANDRESTHOUR,\N,70,\N
\N,CREWWORKANDRESTHOUR,\N,71,\N
\N,CREWWORKANDRESTHOUR,\N,72,\N
\N,CREWWORKANDRESTHOUR,\N,73,\N
\N,CREWWORKANDRESTHOUR,\N,74,\N
\N,CREWWORKANDRESTHOUR,\N,75,\N
\N,CREWWORKANDRESTHOUR,\N,76,\N
\N,CREWWORKANDRESTHOUR,\N,77,\N
\N,CREWWORKANDRESTHOUR,\N,78,\N
\N,CREWWORKANDRESTHOUR,\N,79,\N
\N,CREWWORKANDRESTHOUR,\N,80,\N
\N,CREWWORKANDRESTHOUR,\N,81,\N
\N,CREWWORKANDRESTHOUR,\N,82,\N
\N,CREWWORKANDRESTHOUR,\N,83,\N
\N,CREWWORKANDRESTHOUR,\N,84,\N
\N,CREWWORKANDRESTHOUR,\N,85,\N
\N,CREWWORKANDRESTHOUR,\N,86,\N
\N,CREWWORKANDRESTHOUR,\N,87,\N
\N,CREWWORKANDRESTHOUR,\N,88,\N
\N,CREWWORKANDRESTHOUR,\N,89,\N
\N,CREWWORKANDRESTHOUR,\N,90,\N
\N,CREWWORKANDRESTHOUR,\N,91,\N
\N,CREWWORKANDRESTHOUR,\N,92,\N
\N,CREWWORKANDRESTHOUR,\N,93,\N
\N,CREWWORKANDRESTHOUR,\N,26,\N
\N,CREWWORKANDRESTHOUR,\N,27,\N
\N,CREWWORKANDRESTHOUR,\N,94,\N
\N,CREWWORKANDRESTHOUR,\N,95,\N
\N,CREWWORKANDRESTHOUR,\N,96,\N
\N,CREWWORKANDRESTHOUR,\N,97,\N
\N,CREWWORKANDRESTHOUR,\N,98,\N
\N,CREWWORKANDRESTHOUR,\N,99,\N
\N,CREWWORKANDRESTHOUR,\N,100,\N
\N,CREWWORKANDRESTHOUR,\N,101,\N
\N,CREWWORKANDRESTHOUR,\N,102,\N
\N,CREWWORKANDRESTHOUR,\N,103,\N
\N,CREWWORKANDRESTHOUR,\N,104,\N
\N,CREWWORKANDRESTHOUR,\N,105,\N
\N,CREWWORKANDRESTHOUR,\N,106,\N
\N,CREWWORKANDRESTHOUR,\N,107,\N
\N,CREWWORKANDRESTHOUR,\N,108,\N
\N,CREWWORKANDRESTHOUR,\N,109,\N
\N,CREWWORKANDRESTHOUR,\N,110,\N
\N,CREWWORKANDRESTHOUR,\N,111,\N
\N,CREWWORKANDRESTHOUR,\N,112,\N
\N,CREWWORKANDRESTHOUR,\N,113,\N
\N,CREWWORKANDRESTHOUR,\N,114,\N
\N,CREWWORKANDRESTHOUR,\N,115,\N
\N,CREWWORKANDRESTHOUR,\N,116,\N
\N,CREWWORKANDRESTHOUR,\N,117,\N
\N,CREWWORKANDRESTHOUR,\N,118,\N
\N,CREWWORKANDRESTHOUR,\N,119,\N
\N,CREWWORKANDRESTHOUR,\N,120,\N
\N,CREWWORKANDRESTHOUR,\N,121,\N
\N,CREWWORKANDRESTHOUR,\N,122,\N
\N,CREWWORKANDRESTHOUR,\N,123,\N
\N,CREWWORKANDRESTHOUR,\N,124,\N
\N,CREWWORKANDRESTHOUR,\N,125,\N
\N,CREWWORKANDRESTHOUR,\N,126,\N
\N,CREWWORKANDRESTHOUR,\N,127,\N
\N,CREWWORKANDRESTHOUR,\N,128,\N
\N,CREWWORKANDRESTHOUR,\N,129,\N
\N,CREWWORKANDRESTHOUR,\N,130,\N
\N,CREWWORKANDRESTHOUR,\N,131,\N
\N,CREWWORKANDRESTHOUR,\N,132,\N
\N,CREWWORKANDRESTHOUR,\N,133,\N
\N,CREWWORKANDRESTHOUR,\N,134,\N
\N,CREWWORKANDRESTHOUR,\N,135,\N
\N,CREWWORKANDRESTHOUR,\N,136,\N
\N,CREWWORKANDRESTHOUR,\N,137,\N
\N,CREWWORKANDRESTHOUR,\N,138,\N
\N,CREWWORKANDRESTHOUR,\N,139,\N
\N,CREWWORKANDRESTHOUR,\N,140,\N
\N,CREWWORKANDRESTHOUR,\N,141,\N
\N,CREWWORKANDRESTHOUR,\N,142,\N
\N,CREWWORKANDRESTHOUR,\N,143,\N
\N,CREWWORKANDRESTHOUR,\N,144,\N
\N,CREWWORKANDRESTHOUR,\N,145,\N
\N,CREWWORKANDRESTHOUR,\N,146,\N
\N,CREWWORKANDRESTHOUR,\N,147,\N
\N,CREWWORKANDRESTHOUR,\N,148,\N
\N,CREWWORKANDRESTHOUR,\N,149,\N
\N,CREWWORKANDRESTHOUR,\N,150,\N
\N,CREWWORKANDRESTHOUR,\N,151,\N
\N,CREWWORKANDRESTHOUR,\N,152,\N
\N,CREWWORKANDRESTHOUR,\N,153,\N
\N,CREWWORKANDRESTHOUR,\N,154,\N
\N,CREWWORKANDRESTHOUR,\N,184,\N
\N,CREWWORKANDRESTHOUR,\N,185,\N
\N,CREWWORKANDRESTHOUR,\N,186,\N
\N,CREWWORKANDRESTHOUR,\N,187,\N
\N,CREWWORKANDRESTHOUR,\N,188,\N
\N,CREWWORKANDRESTHOUR,\N,189,\N
\N,CREWWORKANDRESTHOUR,\N,190,\N
\N,CREWWORKANDRESTHOUR,\N,191,\N
\N,CREWWORKANDRESTHOUR,\N,192,\N
\N,CREWWORKANDRESTHOUR,\N,193,\N
\N,CREWWORKANDRESTHOUR,\N,194,\N
\N,CREWWORKANDRESTHOUR,\N,195,\N
\N,CREWWORKANDRESTHOUR,\N,196,\N
\N,CREWWORKANDRESTHOUR,\N,197,\N
\N,CREWWORKANDRESTHOUR,\N,198,\N
\N,CREWWORKANDRESTHOUR,\N,199,\N
\N,CREWWORKANDRESTHOUR,\N,200,\N
\N,VESSELBREAKDOWN,12,\N,\N
\N,VESSELBREAKDOWN,22,\N,\N
\N,VESSELBREAKDOWN,3,\N,\N
\N,VESSELBREAKDOWN,15,\N,\N
\N,VESSELBREAKDOWN,4,\N,\N
\N,VESSELBREAKDOWN,11,\N,\N
\N,VESSELBREAKDOWN,10,\N,\N
\N,VESSELBREAKDOWN,7,\N,\N
\N,VESSELBREAKDOWN,5,\N,\N
\N,VESSELREPORT,15,\N,\N
\N,DAILYLOG,15,\N,\N
\N,VESSELREPORT,5,\N,\N
\N,VESSELREPORT,22,\N,\N
\N,VESSELREPORT,12,\N,\N
\N,VESSELREPORT,4,\N,\N
\N,VESSELREPORT,10,\N,\N
\N,VESSELREPORT,14,\N,\N
\N,VESSELREPORT,8,\N,\N
\N,VESSELREPORT,16,\N,\N
\N,VESSELBREAKDOWN,2,\N,\N
\N,VESSELBREAKDOWN,1,\N,\N
\N,DAILYLOG,8,\N,\N
\N,VESSELREPORT,7,\N,\N
\N,VESSELREPORT,9,\N,\N
\N,CREWTEMPERATURELOG,1,\N,\N
\N,VESSELDISINFECTION,1,\N,\N
\N,VESSELREPORT,23,\N,\N
\N,VESSELREPORT,17,\N,\N
\N,VESSELREPORT,1,\N,\N
\N,DAILYLOG,23,\N,\N
\N,CREWTEMPERATURELOG,4,\N,\N
\N,VESSELREPORT,18,\N,\N
\N,VESSELDISINFECTION,4,\N,\N
\N,VESSELREPORT,6,\N,\N
\N,VESSELREPORT,13,\N,\N
\N,VESSELBREAKDOWN,23,\N,\N
\N,DAILYLOG,18,\N,\N
\N,VESSELBREAKDOWN,6,\N,\N
\N,DAILYLOG,4,\N,\N
\N,DAILYLOG,14,\N,\N
\N,VESSELREPORT,11,\N,\N
\N,VESSELREPORT,2,\N,\N
\N,CREWPLANNING,\N,\N,\N
\N,DAILYLOG,11,\N,\N
\N,DAILYLOG,2,\N,\N
\N,DAILYLOG,21,\N,\N
\N,DAILYLOG,9,\N,\N
\N,CREWTEMPERATURELOG,18,\N,\N
\N,DAILYLOG,1,\N,\N
\N,DAILYLOG,5,\N,\N
\N,DAILYLOG,13,\N,\N
\N,VESSELDISINFECTION,5,\N,\N
\N,CREWTEMPERATURELOG,12,\N,\N
\N,CREWTEMPERATURELOG,6,\N,\N
\N,VESSELDISINFECTION,19,\N,\N
\N,VESSELBREAKDOWN,19,\N,\N
\N,CREWTEMPERATURELOG,13,\N,\N
\N,DAILYLOG,6,\N,\N
\N,VESSELDISINFECTION,3,\N,\N
\N,DAILYLOG,20,\N,\N
\N,DAILYLOG,7,\N,\N
\N,VESSELREPORT,20,\N,\N
\N,VESSELDISINFECTION,18,\N,\N
\N,DAILYLOG,17,\N,\N
\N,CREWWORKANDRESTHOUR,\N,23,\N
\N,CREWWORKANDRESTHOUR,\N,24,\N
\N,DAILYLOG,3,\N,\N
\N,CREWWORKANDRESTHOUR,\N,25,\N
\N,CREWTEMPERATURELOG,2,\N,\N
\N,VESSELBREAKDOWN,8,\N,\N
\N,VESSELDISINFECTION,16,\N,\N
\N,VESSELDISINFECTION,13,\N,\N
\N,VESSELDISINFECTION,17,\N,\N
\N,CREWTEMPERATURELOG,10,\N,\N
\N,CREWTEMPERATURELOG,22,\N,\N
\N,VESSELREPORT,24,\N,\N
\N,CREWTEMPERATURELOG,16,\N,\N
\N,CREWTEMPERATURELOG,8,\N,\N
\N,CREWTEMPERATURELOG,7,\N,\N
\N,VESSELREPORT,25,\N,\N
\N,VESSELDISINFECTION,22,\N,\N
\N,CREWTEMPERATURELOG,23,\N,\N
\N,VESSELDISINFECTION,7,\N,\N
\N,CREWTEMPERATURELOG,3,\N,\N
\N,VESSELDISINFECTION,2,\N,\N
\N,VESSELDISINFECTION,10,\N,\N
\N,VESSELBREAKDOWN,17,\N,\N
\N,CREWTEMPERATURELOG,20,\N,\N
\N,VESSELREPORT,3,\N,\N
\N,VESSELDISINFECTION,8,\N,\N
\N,CREWTEMPERATURELOG,9,\N,\N
\N,CREWTEMPERATURELOG,15,\N,\N
\N,VESSELDISINFECTION,15,\N,\N
\N,VESSELDISINFECTION,24,\N,\N
\N,VESSELDISINFECTION,25,\N,\N
\N,CREWTEMPERATURELOG,24,\N,\N
\N,CREWTEMPERATURELOG,25,\N,\N
\N,CREWWORKANDRESTHOUR,\N,1,\N
\N,CREWWORKANDRESTHOUR,\N,2,\N
\N,CREWWORKANDRESTHOUR,\N,3,\N
\N,CREWWORKANDRESTHOUR,\N,4,\N
\N,CREWWORKANDRESTHOUR,\N,5,\N
\N,CREWWORKANDRESTHOUR,\N,6,\N
\N,CREWWORKANDRESTHOUR,\N,7,\N
\N,CREWWORKANDRESTHOUR,\N,8,\N
\N,CREWWORKANDRESTHOUR,\N,9,\N
\N,CREWWORKANDRESTHOUR,\N,10,\N
\N,CREWWORKANDRESTHOUR,\N,11,\N
\N,CREWWORKANDRESTHOUR,\N,12,\N
\N,CREWWORKANDRESTHOUR,\N,13,\N
\N,CREWWORKANDRESTHOUR,\N,14,\N
\N,CREWWORKANDRESTHOUR,\N,15,\N
\N,CREWWORKANDRESTHOUR,\N,16,\N
\N,CREWWORKANDRESTHOUR,\N,17,\N
\N,CREWWORKANDRESTHOUR,\N,18,\N
\N,CREWWORKANDRESTHOUR,\N,19,\N
\N,CREWWORKANDRESTHOUR,\N,179,\N
\N,CREWWORKANDRESTHOUR,\N,20,\N
\N,CREWWORKANDRESTHOUR,\N,21,\N
\N,CREWWORKANDRESTHOUR,\N,22,\N
\N,VESSELBREAKDOWN,24,\N,\N
\N,VESSELBREAKDOWN,20,\N,\N
\N,CREWWORKANDRESTHOUR,\N,155,\N
\N,VESSELBREAKDOWN,13,\N,\N
\N,VESSELBREAKDOWN,9,\N,\N
\N,CREWWORKANDRESTHOUR,\N,156,\N
\N,CREWWORKANDRESTHOUR,\N,157,\N
\N,CREWWORKANDRESTHOUR,\N,158,\N
\N,CREWWORKANDRESTHOUR,\N,159,\N
\N,CREWWORKANDRESTHOUR,\N,160,\N
\N,CREWWORKANDRESTHOUR,\N,161,\N
\N,CREWWORKANDRESTHOUR,\N,162,\N
\N,CREWWORKANDRESTHOUR,\N,163,\N
\N,CREWWORKANDRESTHOUR,\N,164,\N
\N,CREWWORKANDRESTHOUR,\N,165,\N
\N,CREWWORKANDRESTHOUR,\N,166,\N
\N,CREWWORKANDRESTHOUR,\N,167,\N
\N,CREWWORKANDRESTHOUR,\N,168,\N
\N,CREWWORKANDRESTHOUR,\N,169,\N
\N,CREWWORKANDRESTHOUR,\N,170,\N
\N,CREWWORKANDRESTHOUR,\N,171,\N
\N,CREWWORKANDRESTHOUR,\N,172,\N
\N,CREWWORKANDRESTHOUR,\N,173,\N
\N,CREWWORKANDRESTHOUR,\N,174,\N
\N,CREWWORKANDRESTHOUR,\N,175,\N
\N,CREWWORKANDRESTHOUR,\N,176,\N
\N,CREWWORKANDRESTHOUR,\N,177,\N
\N,CREWWORKANDRESTHOUR,\N,178,\N
\N,CREWWORKANDRESTHOUR,\N,180,\N
\N,CREWWORKANDRESTHOUR,\N,181,\N
\N,CREWWORKANDRESTHOUR,\N,182,\N
\N,CREWWORKANDRESTHOUR,\N,183,\N
\.


--
-- Data for Name: rob; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rob (rob_identifier, vessel_id, order_id) FROM stdin  DELIMITER ',';
Fuel Oil,1,1
Fresh Water,1,2
MDO 4015,1,3
15W-40,1,4
Hydraulic 46,1,5
Hydraulic 100,1,6
Compressor Oil 100,1,7
Super CS,1,8
CS2,1,9
Fuel Oil,2,1
Fresh Water,2,2
MDO 4015,2,3
15W-40,2,4
Hydraulic 46,2,5
Compressor Oil 100,2,6
Super CS,2,7
CS2,2,8
Fuel Oil,3,1
Fresh Water,3,2
MDO 4012,3,3
MDO 4015,3,4
Hydraulic 46,3,5
Hydraulic 100,3,6
Compressor Oil 100,3,7
Gear Oil 68,3,8
Cooloil 68,3,9
Super CS,3,10
CS2,3,11
Fuel Oil,4,1
Fresh Water,4,2
MDO 4015,4,3
15W-40,4,4
Hydraulic 32,4,5
Hydraulic 68,4,6
Hydraulic 100,4,7
Compressor Oil 100,4,8
Gear Oil 68,4,9
Gear Oil 100,4,10
Gear Oil 150,4,11
Super CS,4,12
CS2,4,13
Fuel Oil,5,1
Fresh Water,5,2
Hydraulic 32,5,3
Hydraulic 46,5,4
Hydraulic 68,5,5
Compressor Oil 68,5,6
Gear Oil 68,5,7
Gear Oil 150,5,8
Super CS,5,9
CS2,5,10
Fuel Oil,6,1
Fresh Water,6,2
MDO 4015,6,3
15W-40,6,4
Hydraulic 46,6,5
Hydraulic 68,6,6
Hydraulic 100,6,7
Compressor Oil 100,6,8
Cooloil 32,6,9
Super CS,6,10
CS2,6,11
Fuel Oil,7,1
Fresh Water,7,2
MDO 4015,7,3
15W-40,7,4
Hydraulic 46,7,5
Hydraulic 100,7,6
Hydraulic 150,7,7
Compressor Oil 100,7,8
Gear Oil 68,7,9
Super CS,7,10
CS2,7,11
Fuel Oil,8,1
Fresh Water,8,2
MDO 4015,8,3
15W-40,8,4
Hydraulic 46,8,5
Hydraulic 100,8,6
Hydraulic 150,8,7
Compressor Oil 100,8,8
Gear Oil 68,8,9
Super CS,8,10
CS2,8,11
Fuel Oil,9,1
Fresh Water,9,2
15W-40,9,3
Hydraulic 32,9,4
Hydraulic 46,9,5
Hydraulic 68,9,6
Compressor Oil 68,9,7
Gear Oil 68,9,8
Gear Oil 150,9,9
Super CS,9,10
CS2,9,11
Fuel Oil,10,1
Fresh Water,10,2
MDO 4015,10,3
15W-40,10,4
Hydraulic 68,10,5
Hydraulic 100,10,6
Compressor Oil 100,10,7
Gear Oil 68,10,8
Super CS,10,9
CS2,10,10
Fuel Oil,11,1
Fresh Water,11,2
MDO 4015,11,3
15W-40,11,4
Hydraulic 68,11,5
Hydraulic 100,11,6
Compressor Oil 100,11,7
Gear Oil 68,11,8
Super CS,11,9
CS2,11,10
Fuel Oil,12,1
Fresh Water,12,2
MDO 4015,12,3
15W-40,12,4
Hydraulic 68,12,5
Hydraulic 100,12,6
Compressor Oil 100,12,7
Gear Oil 68,12,8
Gear Oil 100,12,9
Gear Oil 220,12,10
Cooloil 68,12,11
Super CS,12,12
CS2,12,13
Fuel Oil,13,1
Fresh Water,13,2
MDO 4015,13,3
15W-40,13,4
Hydraulic 68,13,5
Hydraulic 100,13,6
Compressor Oil 100,13,7
Gear Oil 68,13,8
Gear Oil 100,13,9
Gear Oil 220,13,10
Cooloil 68,13,11
Super CS,13,12
CS2,13,13
Fuel Oil,14,1
Fresh Water,14,2
MDO 4015,14,3
15W-40,14,4
Hydraulic 32,14,5
Hydraulic 46,14,6
Hydraulic 68,14,7
Compressor Oil 100,14,8
Gear Oil 68,14,9
Gear Oil 100,14,10
Gear Oil 150,14,11
Super CS,14,12
CS2,14,13
Fuel Oil,15,1
Fresh Water,15,2
MDO 4015,15,3
Hydraulic 68,15,4
Hydraulic 100,15,5
Compressor Oil 100,15,6
Gear Oil 68,15,7
Gear Oil 150,15,8
Cooloil 68,15,9
Super CS,15,10
CS2,15,11
Fuel Oil,16,1
Fresh Water,16,2
MDO 4015,16,3
Hydraulic 68,16,4
Hydraulic 100,16,5
Compressor Oil 100,16,6
Gear Oil 68,16,7
Gear Oil 150,16,8
Cooloil 68,16,9
Super CS,16,10
CS2,16,11
Fuel Oil,17,1
Fresh Water,17,2
15W-40,17,3
Hydraulic 32,17,4
Hydraulic 46,17,5
Hydraulic 68,17,6
Compressor Oil 100,17,7
Gear Oil 68,17,8
Gear Oil 100,17,9
Gear Oil 150,17,10
Super CS,17,11
CS2,17,12
Fuel Oil,18,1
Fresh Water,18,2
15W-40,18,3
Hydraulic 32,18,4
Hydraulic 46,18,5
Hydraulic 68,18,6
Compressor Oil 100,18,7
Gear Oil 68,18,8
Gear Oil 100,18,9
Gear Oil 150,18,10
Super CS,18,11
CS2,18,12
Fuel Oil,19,1
Fresh Water,19,2
MDO 4015,19,3
15W-40,19,4
Hydraulic 46,19,5
Hydraulic 68,19,6
Hydraulic 100,19,7
Compressor Oil 100,19,8
Super CS,19,9
CS2,19,10
Fuel Oil,20,1
Fresh Water,20,2
MDO 4015,20,3
15W-40,20,4
Hydraulic 46,20,5
Hydraulic 68,20,6
Hydraulic 100,20,7
Compressor Oil 100,20,8
Super CS,20,9
CS2,20,10
Fuel Oil,21,1
Fresh Water,21,2
MDO 4012,21,3
MDO 4015,21,4
Hydraulic 46,21,5
Hydraulic 100,21,6
Compressor Oil 100,21,7
Gear Oil 68,21,8
Cooloil 68,21,9
Super CS,21,10
CS2,21,11
Fuel Oil,22,1
Fresh Water,22,2
MDO 4015,22,3
15W-40,22,4
Hydraulic 68,22,5
Hydraulic 100,22,6
Gear Oil 68,22,7
Cooloil 68,22,8
Super CS,22,9
CS2,22,10
Fuel Oil,23,1
Fresh Water,23,2
MDO 4015,23,3
15W-40,23,4
Hydraulic 46,23,5
Hydraulic 100,23,6
Compressor Oil 100,23,7
Gear Oil 68,23,8
Fuel Oil,24,1
Fresh Water,24,2
MDO 4015,24,3
15W-40,24,4
Hydraulic 46,24,5
Hydraulic 100,24,6
Compressor Oil 100,24,7
Gear Oil 68,24,8
Gear Oil 100,24,9
Super CS,24,10
CS2,24,11
Fuel Oil,25,1
Fresh Water,25,2
MDO 4015,25,3
Hydraulic 68,25,4
Hydraulic 100,25,5
Compressor Oil 100,25,6
Gear Oil 68,25,7
Gear Oil 150,25,8
Cooloil 68,25,9
Super CS,25,10
CS2,25,11
LNG,11,11
LNG,10,11
\.


--
-- Data for Name: spare_crew; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spare_crew (spare_crew_id, location, shift, shift_details, ops, nationality, rank, name, employee_no, joining_date, months_as_of_31jul2021, remarks) FROM stdin  DELIMITER ',';
1,\N,Half,,Singapore HT,Singaporean,Master, ANDIN,\N,\N,\N,\N
2,\N,Half,,Singapore HT,Singaporean,Master, RAHIM,\N,\N,\N,\N
3,\N,Half,,Singapore HT,Singaporean,Master,Haron ,\N,\N,\N,\N
4,\N,Half,,Singapore HT,Singaporean,Master,Lim Kim Huat,\N,\N,\N,\N
5,\N,Half,,Singapore HT,Singaporean,Master,SUHAIMI,\N,\N,\N,\N
6,\N,Half,,Singapore HT ,Singaporean,Master, JUFRI,\N,\N,\N,\N
7,\N,Half,,Singapore HT,Singaporean,Master,ANAF,\N,\N,\N,\N
8,\N,Half,,Singapore HT,Singaporean,Cadet, SAINI,\N,\N,\N,\N
9,\N,Half,\N,Singapore HT,Singaporean,Cadet, ZAHIR,,\N,\N,\N
10,\N,\N,\N,\N,\N,\N,\N,\N,\N,\N,\N
\.


--
-- Data for Name: tank_sounding; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tank_sounding (identifier, max_depth, max_volume, order_id, vessel_id) FROM stdin  DELIMITER ',';
FP SW BALLAST TANK(C),3.942,44.31,1,1
AP SW BALLAST TANK(C),4.002,21.05,2,1
FRESHWATER TANK(C),2.665,14.64,3,1
NO1 DB FUEL OIL TANK (C),0.521,12.22,4,1
NO2 DB FUEL OIL TANK (P),1.156,28.42,5,1
NO2 DB FUEL OIL TANK (S),1.156,28.42,6,1
DB LUBE OIL SUMP TK (P),0.733,2.78,7,1
DB LUBE OIL SUMP TK (S),0.733,2.78,8,1
SLUDGE TANK (P),0.744,0.49,9,1
FORE PEAK SWB TK (C),3.937,44.073,1,2
AFT PEAK SWB TK (P),2.624,5.035,2,2
AFT PEAK SWB TK (S),2.624,5.035,3,2
FRESHWATER TANK(C),4.014,13.605,4,2
NO1 FO DB TK (C),0.518,12.999,5,2
NO2 FO DB TK (P),1.182,26.137,6,2
NO2 FO DB TK (S),1.191,27.301,7,2
FO SERVICE TK (C),3.776,4.083,8,2
LO STORAGE TK (P),3.89,0.882,9,2
LO STORAGE TK (S),3.9,0.43,10,2
HYD OIL TANK (S),4.115,0.171,11,2
SLUDGE TANK (P),0.735,0.526,12,2
FOAM TANK (C),1.399,6.654,13,2
DISPERSANT TANK (S),1.932,2.221,14,2
CHAIN LOCKER (P),3.712,4.858,15,2
CHAIN LOCKER (S),3.712,4.858,16,2
FP WATER BALLAST TANK (C),3.998,46.63,1,19
AP WATER BALLAST TANK (P),4.018,8.69,2,19
AP WATER BALLAST TANK (S),4.018,8.69,3,19
FRESHWATER TANK(C),4.02,13.33,4,19
NO1 FUEL OIL DB TANK (C),0.523,13.16,5,19
NO2 FUEL OIL DB TANK (P),1.258,31.82,6,19
NO2 FUEL OIL DB TANK (S),1.269,30.02,7,19
SLUDGE TANK (P),0.71,0.69,8,19
FOAM TANK (C),1.395,6.65,9,19
DETERGENT TANK (S),1.927,2.4,10,19
FO SERVICE TK (C),3.817,4.13,11,19
ME LO STORAGE TK,3.9,0.88,12,19
LO STORAGE TK (S),4.05,0.42,13,19
HYD OIL TANK (S),4.05,0.18,14,19
NO1 FW EXPANSION TK (S),6.95,0.26,15,19
NO2 FW EXPANSION TK (S),6.95,0.26,16,19
SW CHAINLKR (P),3.795,5,1,20
SW CHAINLKR (S),3.795,5,2,20
FP WB TK (C),3.998,47,3,20
AFT PK TK (P),4.018,9,4,20
AFT PK TK (S),4.018,9,5,20
VOID TK (P),3.625,11,6,20
VOID TK (S),4.105,8,7,20
FW TK (C),4.02,13,8,20
NO1 FO TK (C),0.523,13,9,20
NO2 FO TK (P),1.258,32,10,20
NO2 FO TK (S),1.269,30,11,20
FO SERVICE TK,3.817,4,12,20
SLUDGE TANK (P),0.71,1,13,20
DETERGENT TK (S),1.927,2,14,20
FOAM TK (C),1.418,7,15,20
ME LO TK (P),3.9,1,16,20
PROP LO TK (S),4.05,1,17,20
PROP HYD TK (P),4.05,0.92,18,20
NO1 FWEXP TK (S),6.95,1,19,20
NO2 FWEXP TK (S),6.95,1,20,20
WASTE HOLDING TK (P),0.743,4,21,20
WASTE HOLDING TK (S),0.743,4,22,20
NO1 FO TK (P),0.88,17.07,1,7
NO1 FO TK (S),0.88,17.07,2,7
NO2 FO TK (C),0.79,21.42,3,7
NO2 FO TK (P),0.93,14.26,4,7
NO2 FO TK (S),0.93,14.26,5,7
FO DAY TK (P),0.93,14.26,6,7
FO DAY TK (S),0.93,14.26,7,7
OVER FLOW TK (C),0.92,6.3,8,7
LO TK (P),3.23,4.23,9,7
OILY BILGE TANK,1.04,3.57,10,7
HYD OIL TANK (S),3.93,2.52,11,7
FRESHWATER TANK(C),2.05,16.67,12,7
DISPERSANT TANK (C),1.67,19.54,13,7
SLUDGE TANK (P),1.04,3.57,14,7
F P TK (C),2.74,17.15,15,7
NO1 WB TK (P),2.14,11.82,16,7
NO1 WB TK (S),2.14,11.82,17,7
A P TK (C),4.23,9.94,18,7
FOAM TK (P),3.82,794,19,7
FOAM TK (S),3.82,794,20,7
FO TK (P),0.88,17.07,1,8
FO TK (S),0.88,17.07,2,8
FO TK (C),0.79,21.42,3,8
A FO TK (P),0.93,14.26,4,8
A FO TK (S),0.93,14.26,5,8
FO DAY TANK (P),4.14,4.57,6,8
FO DAY TANK (S),4.14,4.57,7,8
FO OVERFLOW TK (C),0.92,6.3,8,8
LO TK (P),3.23,4.23,9,8
OILY BILGE TANK,1.04,3.57,10,8
HYD OIL TANK (S),3.93,2.52,11,8
FW TK (C),2.05,16.67,12,8
DISPERSANT TANK,1.67,19.54,13,8
SLUDGE TANK (P),1.04,3.57,14,8
F P TK (C),2.74,17.15,15,8
NO1 WB TK (P),2.14,11.82,16,8
NO1 WB TK (S),2.14,11.82,17,8
A P TK (C),4.23,9.94,18,8
FOAM TK (P),3.82,7.94,19,8
FOAM TK (S),3.82,7.94,20,8
CH LKR (P),4.724,5.1,1,10
CH LKR (S),4.724,5.1,2,10
FPBW TK NO1 (P),4.611,22.2,3,10
FPBW TK NO1 (S),4.611,22.2,4,10
APBW TK NO2 (P),4.311,20.19,5,10
APBW TK NO2 (S),4.311,20.19,6,10
FW TK NO1 (P),2.085,32.2,7,10
FW TK NO1 (S),2.085,32.2,8,10
FO TK NO1 (P),4.6,11,9,10
FO TK NO1 (S),4.6,11,10,10
FO TK NO2 (P),1.229,10.3,11,10
FO TK NO2 (S),1.232,8.9,12,10
FO TK NO3 (P),2.148,8.2,13,10
FO TK NO3 (S),2.148,8.2,14,10
FO TK NO3 (C),1.909,40.4,15,10
OVER FLOW TK (P),0.832,3.7,16,10
FOAM TANK (C),0.832,7.4,17,10
SLUDGE TANK (S),0.832,3.7,18,10
BILGE TANK (P),0.832,3.7,19,10
GREY TK (P),0.912,1.3,20,10
BLACK TK (S),0.832,3.7,21,10
DISPERSANT TK (S),0.832,3.7,22,10
HYD OIL TANK (P),4.25,3.5,23,10
HYD OIL TANK (S),4.25,3.5,24,10
LUB TK (P),4.25,3.5,25,10
LUB TK (S),4.25,3.5,26,10
LNG TK (P),6.831,21.8,27,10
LNG TK (S),6.831,21.8,28,10
F FO TK (P),\N,\N,1,17
F FO TK (S),\N,\N,2,17
DBB FO TK (C),\N,\N,3,17
DBB FO TK (P),\N,\N,4,17
DBB FO TK (S),\N,\N,5,17
FO DAY TK (P),\N,\N,6,17
FO DAY TK (S),\N,\N,7,17
A FO TK (C),\N,\N,8,17
A FO TK (P),\N,\N,9,17
A FO TK (S),\N,\N,10,17
GREY WATER TK (C),\N,\N,11,17
SLUDGE TK (P),\N,\N,12,17
OILY WATER TK (S),\N,\N,13,17
SEWAGE TK (P),\N,\N,14,17
FO OVERFLOW TK (S),\N,\N,15,17
FOAM TK (P),\N,\N,16,17
DISPERSANT TK (S),\N,\N,17,17
COOLANT TK (P),\N,\N,18,17
COOLANT TK (S),\N,\N,19,17
MAIN ENGINE LO TK (S),\N,\N,20,17
ZDRIVE LO TK (P),\N,\N,21,17
ZDRIVE HYD TK (S),\N,\N,22,17
FW TK (P),\N,\N,23,17
FW TK (S),\N,\N,24,17
F BALLAST TK (C),\N,\N,25,17
A BALLAST TK (P),\N,\N,26,17
A BALLAST TK (S),\N,\N,27,17
F FO TK (P),\N,\N,1,18
F FO TK (S),\N,\N,2,18
DBB FO TK (C),\N,\N,3,18
DBB FO TK (P),\N,\N,4,18
DBB FO TK (S),\N,\N,5,18
FO DAY TK (P),\N,\N,6,18
FO DAY TK (S),\N,\N,7,18
A FO TK (C),\N,\N,8,18
A FO TK (P),\N,\N,9,18
A FO TK (S),\N,\N,10,18
GREY WATER TK (C),\N,\N,11,18
SLUDGE TK (P),\N,\N,12,18
OILY WATER TK (S),\N,\N,13,18
SEWAGE TK (P),\N,\N,14,18
FO OVERFLOW TK (S),\N,\N,15,18
FOAM TK (P),\N,\N,16,18
DISPERSANT TK (S),\N,\N,17,18
COOLANT TK (P),\N,\N,18,18
COOLANT TK (S),\N,\N,19,18
MAIN ENGINE LO TK (S),\N,\N,20,18
ZDRIVE LO TK (P),\N,\N,21,18
ZDRIVE HYD TK (S),\N,\N,22,18
FW TK (P),\N,\N,23,18
FW TK (S),\N,\N,24,18
F BALLAST TK (C),\N,\N,25,18
A BALLAST TK (P),\N,\N,26,18
A BALLAST TK (S),\N,\N,27,18
FW TK (C),3.01,25.8,1,4
FW WB TK (C),4.131,11.4,2,4
FW WB TK (P),4.097,8,3,4
FW WB TK (S),4.097,8,4,4
FP WB TK (C),3.472,13.1,5,4
FO TK (P),2.723,48,6,4
FO TK (S),2.723,48,7,4
F O O B TK (P),0.76,8.5,8,4
F O O B TK (S),0.751,13.4,9,4
F O O S TK (P),3.585,19.9,10,4
F O O S TK (S),3.585,19.9,11,4
FO TK (C),3.546,16.6,12,4
LUB OIL TK (P),1.338,4.3,13,4
HYD OIL OB TK (P),0.937,2.1,14,4
FOAM TK,2.487,10.6,15,4
DISPERSANT TK,2.487,10.6,16,4
DIRTY OIL DB TK (S),0.937,2.1,17,4
FW TK (C),3.01,25.8,1,14
FW WB TK (C),4.131,11.4,2,14
FW WB TK (P),4.097,8,3,14
FW WB TK (S),4.097,8,4,14
F P WB TK (C),3.472,13.1,5,14
FO TK (P),2.723,48,6,14
FO TK (S),2.723,48,7,14
FO DB TK (P),0.76,8.5,8,14
FO DB TK (S),0.751,13.4,9,14
FO DS TK (P),3.585,19.9,10,14
FO DS TK (S),3.585,19.9,11,14
FO TK (C),3.546,16.6,12,14
LUB OIL TK (P),1.338,4.3,13,14
HYD OIL DB TK (P),0.937,2.1,14,14
FOAM TK,2.487,10.6,15,14
DISPERSANT TK,2.487,10.6,16,14
DIRTY OIL DB TK (S),0.937,2.1,17,14
CHAIN LKR (P),3.782,5,1,5
CHAIN LKR (S),3.782,5,2,5
WB TK (C),4.266,19.2,3,5
FW TK (C),3.318,13.5,4,5
FW TK (P),4.023,10.6,5,5
FW TK (S),4.023,10.6,6,5
FO SV C,3.75,7.8,7,5
NO1 FOTK (P),4.088,8.4,8,5
NO1 FOTK (S),4.086,8.3,9,5
NO2 FOTK (C),0.544,14.8,10,5
NO 2 FOTK (P),0.744,6.4,11,5
NO 2 FOTK (S),0.744,6.4,12,5
NO 3 FOTK (P),1.243,31,13,5
NO 3 FOTK (S),1.243,31,14,5
DISPERSANT TK (S),1.632,5.7,15,5
SLUDGE TK (C),0.518,2.8,16,5
FOAM TK (P),1.632,5.7,17,5
ZP HYD TK (P),4.641,0.4,18,5
ZP LUB TK (S),4.641,0.4,19,5
CHAIN LKR (P),3.782,5,1,6
CHAIN LKR (S),3.782,5,2,6
WB TK (C),4.266,19.2,3,6
FW TK (C),3.318,13.5,4,6
FW TK (P),4.023,10.6,5,6
FW TK (S),4.023,10.6,6,6
FO SV C,3.75,7.8,7,6
NO1 FOTK (P),4.088,8.4,8,6
NO1 FOTK (S),4.086,8.3,9,6
NO2 FOTK (C),0.544,14.8,10,6
NO 2 FOTK (P),0.744,6.4,11,6
NO 2 FOTK (S),0.744,6.4,12,6
NO 3 FOTK (P),1.243,31,13,6
NO 3 FOTK (S),1.243,31,14,6
DISPERSANT TK (S),1.632,5.7,15,6
SLUDGE TK (C),0.518,2.8,16,6
FOAM TK (P),1.632,5.7,17,6
ZP HYD TK (P),4.641,0.4,18,6
ZP LUB TK (S),4.641,0.4,19,6
FW TK (P),1.449,11.7,1,9
FW TK (S),1.449,11.7,2,9
FO DAY TK (P),3.378,11.4,3,9
FO DAY TK (S),3.378,11.4,4,9
FO DB TK (P),1.158,21.4,5,9
FO DB TK (C),0.983,40.1,6,9
FO DB TK (S),1.155,21.2,7,9
FO OVFL (S),1.06,3,8,9
AFT PEAK (C),2.577,59.4,9,9
GRAY WATER TK (S),0.86,1,10,9
WASTE OILY TK (P),1.06,2.85,11,9
OILY WATER TK (S),0.884,3.5,12,9
FOAM TK (S),3.678,3,13,9
DISPERSANT TK (P),3.678,3,14,9
SEWAGE TK (P),0.884,3.5,15,9
LUBE OIL TK (P),2.974,0.7,16,9
WINCH HYD OIL,0.08,0.25,17,9
ZDRIVE LUB OIL (P),3.75,0.25,18,9
ZDRIVE LUB OIL (S),3.75,0.25,19,9
CL (C),4.665,15.2,1,13
FP BW TK (P),4.813,18.8,2,13
FP BW TK (S),4.813,18.8,3,13
BW TK (C),1.66,36.4,4,13
AP BW TK (P),3.84,20.9,5,13
AP BW TK (S),3.84,20.9,6,13
FW TK (P),1.419,27.6,7,13
FW TK (S),1.419,27.6,8,13
NO1 FO TK (P),3.11,23,9,13
NO1 FO TK (S),3.11,23,10,13
NO2 FO TK (C),0.799,16.4,11,13
NO2 FO TK (P),1.933,16.3,12,13
NO2 FO TK (S),1.933,16.3,13,13
NO3 FO TK (P),3.144,36.1,14,13
NO3 FO TK (S),3.144,36.1,15,13
NO4 FO TK (C),3.727,26.6,16,13
FO DAY TK (P),4.201,9.2,17,13
FO DAY TK (S),4.201,9.2,18,13
BILGE TK (S),0.77,2.9,19,13
SLUDGE TK (S),0.771,4.3,20,13
SEWAGE TK (P),0.771,4.3,21,13
DISPERSANT TK (P),0.771,2.9,22,13
FOAM TK (C),0.979,7.5,23,13
LO TK (P),4.2,3.1,24,13
LO TK (S),4.2,3.1,25,13
CH LKR (P),4.724,5.1,1,11
CH LKR (S),4.724,5.1,2,11
FP BW TK (P),4.606,22.27,3,11
FP BW TK (S),4.606,22.27,4,11
AP BW TK (P),4.309,20.6,5,11
AP BW TK (S),4.309,20.6,6,11
FW TK (P),2.082,32.2,7,11
FW TK (S),2.082,32.2,8,11
FO DAY TK (P),4.6,11,9,11
FO DAY TK (S),4.6,11,10,11
FO TK NO1 (P),2.177,12.2,11,11
FO TK NO1 (S),2.177,12.2,12,11
FO TK NO2 (P),1.229,10.3,13,11
FO TK NO2 (S),1.231,8.9,14,11
FO TK NO2 (C),0.878,23.9,15,11
FO TK NO3 (P),2.147,8.2,16,11
FO TK NO3 (S),2.147,8.2,17,11
FO TK NO3 (C),1.908,40.4,18,11
OVERFLOW TK (P),0.832,3.7,19,11
FOAM TK (C),0.832,7.4,20,11
SLUDGE TK (S),0.832,3.7,21,11
BILGE TK (P),0.832,3.7,22,11
GREY TK (P),0.911,1.3,23,11
BLACK TK (S),0.832,3.7,24,11
DISPERSANT TK (S),0.832,3.7,25,11
HYD TK (P),4.25,3.55,26,11
HYD TK (S),4.25,3.55,27,11
LUB TK (P),4.25,3.55,28,11
LUB TK (S),4.25,3.55,29,11
LNG TK (P),6.831,21.8,30,11
LNG TK (S),6.831,21.8,31,11
AP BW FW TK (P),4.508,9.2,1,23
AP BW FW TK (S),4.508,9.2,2,23
FP BW FW TK,4.501,21.19,3,23
NO1 FW TK (C),1.184,15.72,4,23
NO2 FW TK (C),3.514,25.16,5,23
AP BW FW TK (P),4.506,9.2,6,23
AP BW FW TK (S),4.506,9.2,7,23
FP WB FW TK,4.391,21.19,8,23
NO1 FO TK (C),1.96,31.6,9,23
NO1 FO TK (P),3.26,18.3,10,23
NO1 FO TK (S),3.26,18.3,11,23
NO2 FO TK (P),0.707,8.4,12,23
NO2 FO TK (S),0.707,8.4,13,23
NO3 FO TK (C),1.138,21.4,14,23
NO3 FO TK (P),1.41,18.4,15,23
NO3 FO TK (S),1.41,18.4,16,23
FO DAY TK (P),3.911,9.2,17,23
FO DAY TK (S),3.878,9.7,18,23
BILGE TK,0.522,2.9,19,23
AP BW FW TK (P),4.506,9.2,1,22
AP BW FW TK (S),4.506,9.2,2,22
FP BW FW TK (S),4.391,21.19,3,22
NO1 FW TK (C),1.484,15.72,4,22
NO1 FW TK (C),1.484,15.72,5,22
NO2 FW TK (C),3.544,25.16,6,22
AP BW FW TK (P),4.506,9.2,7,22
AP BW FW TK (S),4.506,9.2,8,22
FP WB FW TK,4.391,21.19,9,22
NO1 FO TK (C),1.98,34.58,10,22
NO1 FO TK (P),3.26,18.31,11,22
NO1 FO TK (S),3.26,18.31,12,22
NO2 FO TK (P),0.707,8.43,13,22
NO2 FO TK (S),0.707,8.43,14,22
NO3 FO TK (C),1.138,21.44,15,22
NO3 FO TK (P),1.41,18.42,16,22
NO3 FO TK (S),1.41,18.42,17,22
FO DAY TK (P),3.911,8.23,18,22
FO DAY TK (S),3.878,9.7,19,22
BILGE TK,0.522,2.9,20,22
SEWAGE TK,0.522,2.9,21,22
SLUDGE TK,0.564,2.5,22,22
DISPERSANT TANK,0.549,3.6,23,22
FOAM TK,0.538,11.1,24,22
ZP  GB LO TK (LOOSE),3.95,2,25,22
ME LO TK,3.7,2.1,26,22
ZP GB HO TK (LOOSE),3.7,1,27,22
W HO TK (LOOSE),3.7,1.1,28,22
FPK WATER BALLAST TK (C),3.758,30.029,1,3
WATER BALLAST TK (P),3.775,9.824,2,3
WATER BALLAST TK (S),3.775,9.824,3,3
AFT PEAK WATER BALLAST,3.73,25.073,4,3
FRESH WATER DB TK (P),1.539,15.22,5,3
FRESH WATER DB TK (S),1.539,15.22,6,3
NO1 FO TK (C),0.635,11.321,7,3
NO2 FO TK (P),2.423,48.762,8,3
NO2 FO TK (S),3.036,12.071,9,3
FO DAY TK (P),3.1,8.798,10,3
FO DAY TK (S),3.1,8.798,11,3
DISPERSANT TK (C),0.595,4.193,12,3
FOAM TK (C),0.565,13.655,13,3
BILGE HOLDING TK (P),0.561,2.335,14,3
SLUDGE TK (S),0.561,2.335,15,3
NO1 VOID TK (P),0.607,3.22,16,3
NO1 VOID TK (S),0.607,3.22,17,3
NO2 VOID TK (P),3.32,9.834,18,3
NO2 VOID TK (S),3.32,9.834,19,3
NO1 LO TK (P),4.354,2.1,20,3
NO1 LO TK (S),4.354,2.1,21,3
NO2 LO TK (P),3.251,1.71,22,3
NO2 LO TK (S),3.251,1.71,23,3
CL (C),4.665,15.2,1,15
FP BW TK (P),4.813,18.8,2,15
FP BW TK (S),4.813,18.8,3,15
BW TK (C),1.66,36.4,4,15
AP BW TK (P),3.796,34.2,5,15
AP BW TK (S),3.796,34.2,6,15
FW TK (P),1.419,27.6,7,15
FW TK (S),1.419,27.6,8,15
NO1 FO TK (P),3.11,23,9,15
NO1 FO TK (S),3.11,23,10,15
NO2 FO TK (C),0.799,16.4,11,15
NO2 FO TK (P),1.933,16.3,12,15
NO2 FO TK (S),1.933,16.3,13,15
NO3 FO TK (P),3.144,36.1,14,15
NO3 FO TK (S),3.144,36.1,15,15
FO DAY TK (P),4.201,9.2,16,15
FO DAY TK (S),4.201,9.2,17,15
BILGE TK (S),0.77,2.9,18,15
SLUDGE TK (S),0.771,4.3,19,15
SEWAGE TK (P),0.771,4.3,20,15
DISP TK (P),0.771,2.9,21,15
FOAM TK (C),0.979,7.5,22,15
LO TK (P),4.2,3.1,23,15
LO TK (S),4.2,3.1,24,15
CL (C),4.665,15.2,1,16
FP BW TK (P),4.813,18.8,2,16
FP BW TK (S),4.813,18.8,3,16
BW TK (C),1.66,36.4,4,16
AP BW TK (P),3.796,34.2,5,16
AP BW TK (S),3.796,34.2,6,16
FW TK (P),1.419,27.6,7,16
FW TK (S),1.419,27.6,8,16
NO1 FO TK (P),3.11,23,9,16
NO1 FO TK (S),3.11,23,10,16
NO2 FO TK (C),0.799,16.4,11,16
NO2 FO TK (P),1.933,16.3,12,16
NO2 FO TK (S),1.933,16.3,13,16
NO3 FO TK (P),3.144,36.1,14,16
NO3 FO TK (S),3.144,36.1,15,16
FO DAY TK (P),4.201,9.2,16,16
FO DAY TK (S),4.201,9.2,17,16
BILGE TK (S),0.77,2.9,18,16
SLUDGE TK (S),0.771,4.3,19,16
SEWAGE TK (P),0.771,4.3,20,16
DISP TK (P),0.771,2.9,21,16
FOAM TK (C),0.979,7.5,22,16
LO TK (P),4.2,3.1,23,16
LO TK (S),4.2,3.1,24,16
SW CHAIN LOCKER (P),3.795,5.1,1,21
SW CHAIN LOCKER (S),3.795,5.1,2,21
AFT PEAK FW TK (P),4.027,10.6,3,21
AFT PEAK FW TK (S),4.027,10.6,4,21
AFT PEAK FW TK (C),3.318,13.5,5,21
FWD PEAK FW TK (C),3.904,9.7,6,21
NO1 FO TK (C),0.545,14.2,7,21
NO1 FO TK (P),0.744,6.4,8,21
NO1 FO TK (S),0.744,6.4,9,21
NO2 FO TK (P),1.243,31,10,21
NO2 FO TK (S),1.243,31,11,21
FO SERVICE TK (C),3.94,8.1,12,21
FO TK (P),3.627,10.8,13,21
FO TK (S),4.105,8.4,14,21
SLUDGE TK (C),0.518,2.8,15,21
FOAM TK (C),1.423,6.6,16,21
DETERGENT TK (S),1.926,2.4,17,21
CL (C),4.665,15.2,1,12
FP BW TK (P),4.813,18.8,2,12
FP BW TK (S),4.813,18.8,3,12
BW TK (C),1.66,36.4,4,12
AP BW TK (P),3.796,34.2,5,12
AP BW TK (S),3.796,34.2,6,12
FW TK (P),1.419,27.6,7,12
FW TK (S),1.419,27.6,8,12
NO1 FO TK (P),3.11,23,9,12
NO1 FO TK (S),3.11,23,10,12
NO2 FO TK (C),0.799,16.4,11,12
NO2 FO TK (P),1.933,16.3,12,12
NO2 FO TK (S),1.933,16.3,13,12
NO3 FO TK (P),3.144,36.1,14,12
NO3 FO TK (S),3.144,36.1,15,12
FO DAY TK (P),4.201,9.2,16,12
FO DAY TK (S),4.201,9.2,17,12
BILGE TK (S),0.77,2.9,18,12
SLUDGE TK (S),0.771,4.3,19,12
SEWAGE TK (P),0.771,4.3,20,12
DISP TK (P),0.771,2.9,21,12
FOAM TK (C),0.979,7.5,22,12
LO TK (P),4.2,3.1,23,12
LO TK (S),4.2,3.1,24,12
\.


--
-- Data for Name: user_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_account (account_id, username, password, salt, account_type, name) FROM stdin  DELIMITER ',';
1,superadmin,826aed1cb0fafa29d627f9a6a73f298022ad5ba844cf77a182013fea080b5eda,98235652,admin,Super Admin
2,Keppel,5f36945f363af0534294635a2864cd63d90b3d094b2faf5b58ccbd643c351fc0,b20d0ee9,management,Keppel
3,kst,65cd0b1e2aadba12a7844b690c5f81fe2a6b8694f58c30015b16f7e7d5de196a,a543458f,admin,KST
27,Fleet,10011c9c3505eafc9a6413fb11809b33bb78d67cd802891e2d37b4b8542ad807,402c8ab3,management,Fleet123
30,Opsroom,743c1b064e73dfb63c01d585b6e273a4951fde3508089f2b9f4c19ef3a6ca820,7d9cbf6d,management,KST Opsroom
31,NHM,cbbfc9840a3c6d07c3cbf4fd6d6aca0e1426e676118fed362f54bd0624966641,815ef4a4,management,Ng Hak Mun
32,MK,16f763ac49df2e20c931b20e6930d65fe61a7b38dcf0a6b6b29a549d4a8c3d24,376fdc44,management,Mark Koh
33,KM,31c6578a26e3c02a4d9a39b657eb70ade7165b698678a4bcabceb40beb7fce40,899dfabc,management,Khairundin 
35,SL,0efc4034eb7b214d4d8b7e699361b10f3dcad59fd119fa3c2b3d5c5f8a5e6a05,7575f821,management,Stanley
40,yan.lin,ea45f508c9c532b8171f76d417863a24168f44f01c2efc3ec7509c608cbf0c6a,87c45c47,management,Yan Lin
41,TY,bcd4d34cb7eea2dc853496d2150ff34afe41c70e29434bd76e1dd9dd08361cbf,8aa2af9f,management,Thu Ya
42,DL,286268a514ba6b639600dde5cb966fe9e5796c07d79e7291facf2f91b028c32b,284dfd1f,management,David Liu
43,BT,ec2d0a3496de6cf1f3ffee73f76b080e398f54857ce27742bb2b0aabbc4cfc27,1badeb8e,management,Bernard Tan
44,Officer_15,85ad42552f31917366700c013dd911007266e6ce8660bc87d56efc8793e69801,ffec638d,management,Officer 15
45,Officer_16,b05fa9bddfc46021c71036a070ebc9266073f24c9647e79a9c5b2724aa4e2921,1fadb334,management,Officer 16
36,SZ,365440dc752653d7bae9d0e557f6933124d5fc2e025d289868121aae285abb7e,bfd72cdb,management,Siti Zainun
37,SR,b73e5295dada4b0ba0e8bc23363631caa93ae89cf4fb35d2be2cea665b83132b,dcabecb1,management,Siti Raudhah
4,31,7e89d5845ea7e0309e8cf0605ffd67e9d168d6bd4ac69d4fce0d68c72768bab8,ecf140f6,vessel,KST 31
5,33,e37bdf13108cb873701a34462a22c5e26d3a37aac3fcdcedf145d4d3f82761fe,1758f929,vessel,KST 33
6,Sky,9e739910c3dd5fcffec144861feaebefcd11e0eaba3e28ec7a91453c0cbf9803,eacf394e,vessel,KST Sky
7,Skill,5581948481793b9cb75bc39e5f95fb27c5a7d14a759f4597aec5a85352be6365,ef35a6be,vessel,KST Skill
8,Success,731a764b1a74cde0ac48ff1386d25484f554d566c629981c72a680f460cdf665,8884ec81,vessel,KST Success
9,Summit,43323eb65b8c75ca845cc2daa5e09f4007ad3f85295bd22c8729c8b47683737b,744152f1,vessel,KST Summit
10,Kancil,fca68d78950d6da500646c89ccf0e2fa15050838d72b9906fdc12011a2cc9acd,65087a6b,vessel,KST Kancil
11,Kijang,f8174437e8888837a5364086db939fb96611586aa335a563be76f918764a66d7,026d7ed3,vessel,KST Kijang
12,Zodiac,886d9ab748c0370e433ba737eff8aa3139a8e403971359b7f0aa4eb1b2bcf42a,2ba2e38c,vessel,KST Zodiac
13,Liberty,47aea7ab4e5bbf953bd4c6bd370bca172bdbb496ba62285428dd5e2e2e7b8bcf,1ee7fcae,vessel,KST Liberty
14,Loyalty,03179aacf76e1a95afcaca86e67993ce9d08a7ea3a415483e5a510fa90b13457,7d5b5f87,vessel,KST Loyalty
15,510,e1408b9bcad8fd671656a77b886d89e30454a36a98f411eb98b7dfd72e3add0a,33285ce8,vessel,Maju 510
16,511,654257e21c60d19db96a7631f13ba196972086b7cc53cfc448a8c523077cf113,abe7e601,vessel,Maju 511
17,Stellar,7fe2749212eb7c490b38be79557de6ca2390dcad6bb566f7366fa6a30812f32d,9a4df1af,vessel,KST Stellar
18,56,7a10156d095599d00dcaa6801ff81148d687a586250ae1b4163d7c4f90f570c3,f0db787c,vessel,KST 56
19,58,52f9349521488a2024856b341da7e32da25f81ec2cdd74089bbc84641063b8e6,76e51219,vessel,KST 58
20,Passion,c9bc6313c7e30c863d79e02b4f1855d47095c5a45b60ee6922972dcd743096ac,447789f4,vessel,KST Passion
21,Pride,63a1cbb96837224753be8d4c17c98c1c0e890c96f023e098350ddbe45463cdf8,0f67ec7a,vessel,KST Pride
22,35,820ba4bf4c3769677fb8608830525421977fab7143ab4fa352a73b470eff1da4,88f1db0a,vessel,KST 35
23,36,8097a19ba7178490831c56b8b8a52f320f9862f97c51f19dfc235154fb157ed2,df61811c,vessel,KST 36
24,Super,610f31bfdf487a8ffc699a5ba6b953c7d3aa8daa026a8b8f86a22101abf86aac,30092fc5,vessel,KST Super
25,Mercury,801072987761a67734f22d138b47474f13f7784102705bf2006349df1ad9b658,f3a85aad,vessel,KST Mercury
26,Mars,fcdbc143ff26dc174605dbe3cec6c280c8bf6383ddf25e10417461f5e9fd8dbc,edfb4c9f,vessel,Maju Mars
46,Kelly.Aw,2e7c0efa8d510402d8ff45f901616b51d0bf708ca764f8ac6dcef0513ea35cd8,b89a0701,management,Kelly Aw
47,Teri.Lee,626252c26b58082fbe3d9e0ff358dc3b2202f522f4d9a09573a25f24a19562f6,a971b6da,management,Teri Lee
48,Support,68afe10db87324441b669d4bae687b35dfc6176477c3c5101bd73064d5d987ec,df4e789b,admin,Support
49,Gunalan,2d8c7e2e03735039ee888061b0df8cca234b1737182d9efa548e77cfd4693399,d6559f74,management,Gunalan
50,Romi,3f43205cd5dd700cca10d97c88e34e581391f073fda753894a01c10f5d647a52,da0d0615,management,Romi
51,Tserpara,9efeaff821ee7f7ea2e653d835ad835b09a49493f9448943fc62b3ea6d1f093b,9bb27fe7,management,Tserpara
52,Laks,7b6cf28f0ecbf6160dbbe3a97009a2a4fc916623b7184f0bf156147cb68eab34,caef3f67,management,Laks
53,Thonce,a8322b89a8172e62e35c01a85fa6aba43160bcd28f97c9ef0f8571e7148aba2a,24c6b63d,management,Thonce
54,Support1,ad62ce964ec9b4e40fffd9844bac58d860fdb05dc2b2ffc6302df4ce0ca5cb6b,251116f2,management,Chia CJ
55,joseph.seah@keppelsmit.com.sg,7de5333ef265e8d0ffecca6db75aaa525edb8e640e369598b04e2c534a2c76c8,97577a25,management,Joseph Seah
56,kumaran,77fcd9b768bca79f02e69312b1f45587db2ad565a59b21ec5ec2c8ac74947125,561e66e6,management,Kumaran
\.


--
-- Data for Name: user_account_app; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_account_app (account_id, module, app) FROM stdin  DELIMITER ',';
\.


--
-- Data for Name: user_account_vessel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_account_vessel (account_id, vessel_id) FROM stdin  DELIMITER ',';
3,1
4,1
5,2
6,3
7,4
8,5
9,6
10,7
11,8
12,9
13,10
14,11
15,12
16,13
17,14
18,15
19,16
20,17
21,18
22,19
23,20
24,21
25,22
26,23
27,1
30,1
31,1
32,1
33,1
35,1
36,1
37,1
40,1
41,1
42,1
43,1
44,1
45,1
46,1
47,1
48,1
49,1
50,1
51,1
52,1
53,1
\.


--
-- Data for Name: vessel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vessel (vessel_id, name, timezone, location, shift, ops, crew_management_order_id, optimum_crew) FROM stdin  DELIMITER ',';
19,KST 35,\N,TC,Full,Diego Garcia,1,6
20,KST 36,\N,TC,Full,Diego Garcia,2,6
17,KST Passion,\N,TC,Full,Shell Bukom SGP,3,9
18,KST Pride,\N,TC,Full,Shell Bukom SGP,4,5
1,KST 31,\N,HBR,Full,SINGAPORE HT,5,3
2,KST 33,\N,HBR,Full,SINGAPORE HT,6,3
5,KST Success,\N,HBR,Full,SINGAPORE HT,7,6
6,KST Summit,\N,HBR,Full,SINGAPORE HT,8,6
3,KST Sky,\N,HBR,Full,SINGAPORE HT,9,6
21,KST Super,\N,HBR,Full,SINGAPORE HT,10,3
9,KST Zodiac,\N,HBR,Full,SINGAPORE HT,11,6
10,KST Liberty,\N,HBR,Full,SINGAPORE HT,12,6
11,Maju Loyalty,\N,HBR,Full,SINGAPORE HT,13,6
23,Maju Mars,\N,HBR,Full,SINGAPORE HT,14,3
12,Maju 510,\N,HBR,Full,SINGAPORE HT,15,6
13,Maju 511,\N,HBR,Full,SINGAPORE HT,16,6
4,KST Skill,\N,HBR,Full,SINGAPORE HT,17,3
14,KST Stellar,\N,HBR,Full,SINGAPORE HT,18,3
8,KST Kijang,\N,HBR,Full,SINGAPORE HT,19,6
7,KST Kancil,\N,HBR,Full,SINGAPORE HT,20,3
15,KST 56,\N,HBR,Full,SINGAPORE HT,21,5
16,KST 58,\N,HBR,Full,SINGAPORE HT,22,3
22,Maju Mercury,\N,COLD LAY-OUT,,SINGAPORE,24,6
\.


--
-- Name: backdated_form_submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.backdated_form_submission_id_seq', 1, false);


--
-- Name: chat_msgs_msg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_msgs_msg_id_seq', 1, true);


--
-- Name: chats_chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chats_chat_id_seq', 1, true);


--
-- Name: crew_crew_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crew_crew_id_seq', 1, false);


--
-- Name: crew_work_rest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crew_work_rest_id_seq', 1, true);


--
-- Name: crew_work_rest_update_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crew_work_rest_update_id_seq', 1, true);


--
-- Name: daily_log_enginelog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.daily_log_enginelog_id_seq', 1, true);


--
-- Name: daily_log_form_form_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.daily_log_form_form_id_seq', 1, true);


--
-- Name: decklog_decklog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.decklog_decklog_id_seq', 1, true);


--
-- Name: disinfection_record_record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disinfection_record_record_id_seq', 1, true);


--
-- Name: file_folder_id; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.file_folder_id', 1, true);


--
-- Name: file_id; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.file_id', 1, true);


--
-- Name: folder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.folder_id_seq', 1, true);


--
-- Name: spare_crew_spare_crew_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spare_crew_spare_crew_id_seq', 1, true);


--
-- Name: temperature_log_record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.temperature_log_record_id_seq', 1, true);


--
-- Name: user_account_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_account_account_id_seq', 1, true);


--
-- Name: vessel_breakdown_event_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vessel_breakdown_event_event_id_seq', 1, true);


--
-- Name: vessel_breakdown_support_record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vessel_breakdown_support_record_id_seq', 1, true);


--
-- Name: vessel_report_enginelog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vessel_report_enginelog_id_seq', 1, true);


--
-- Name: vessel_report_form_form_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vessel_report_form_form_id_seq', 1, true);


--
-- Name: vessel_vessel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vessel_vessel_id_seq', 1, true);


--
-- Name: crew_crew_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.crew_crew_id_seq', 1, true);


--
-- Name: crew_work_rest_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.crew_work_rest_id_seq', 1, false);


--
-- Name: crew_work_rest_update_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.crew_work_rest_update_id_seq', 1, false);


--
-- Name: decklog_decklog_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.decklog_decklog_id_seq', 1, true);


--
-- Name: disinfection_record_record_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.disinfection_record_record_id_seq', 1, true);


--
-- Name: folder_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.folder_id_seq', 1, false);


--
-- Name: spare_crew_spare_crew_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.spare_crew_spare_crew_id_seq', 1, false);


--
-- Name: temperature_log_record_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.temperature_log_record_id_seq', 1, true);


--
-- Name: user_account_account_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.user_account_account_id_seq', 1, true);


--
-- Name: vessel_breakdown_event_event_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.vessel_breakdown_event_event_id_seq', 1, true);


--
-- Name: vessel_breakdown_support_record_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.vessel_breakdown_support_record_id_seq', 1, true);


--
-- Name: vessel_report_enginelog_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.vessel_report_enginelog_id_seq', 1, true);


--
-- Name: vessel_report_form_form_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.vessel_report_form_form_id_seq', 1, true);


--
-- Name: vessel_vessel_id_seq; Type: SEQUENCE SET; Schema: test; Owner: postgres
--

SELECT pg_catalog.setval('test.vessel_vessel_id_seq', 1, true);


--
-- Name: backdated_form_submission backdated_form_submission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backdated_form_submission
    ADD CONSTRAINT backdated_form_submission_pkey PRIMARY KEY (id);


--
-- Name: chat_msgs chat_msgs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_msgs
    ADD CONSTRAINT chat_msgs_pkey PRIMARY KEY (msg_id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (chat_id);


--
-- Name: crew crew_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crew
    ADD CONSTRAINT crew_pkey PRIMARY KEY (crew_id);


--
-- Name: daily_log_enginelog daily_log_enginelog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_log_enginelog
    ADD CONSTRAINT daily_log_enginelog_pkey PRIMARY KEY (id);


--
-- Name: daily_log_form daily_log_form_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_log_form
    ADD CONSTRAINT daily_log_form_pkey PRIMARY KEY (form_id);


--
-- Name: decklog decklog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decklog
    ADD CONSTRAINT decklog_pkey PRIMARY KEY (decklog_id);


--
-- Name: disinfection_record disinfection_record_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disinfection_record
    ADD CONSTRAINT disinfection_record_pkey PRIMARY KEY (record_id);


--
-- Name: marinem_orders marinem_orders_order_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marinem_orders
    ADD CONSTRAINT marinem_orders_order_no_key UNIQUE (order_no);


--
-- Name: marinem_orders marinem_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marinem_orders
    ADD CONSTRAINT marinem_orders_pkey PRIMARY KEY (order_id);


--
-- Name: marinem_task_details marinem_task_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marinem_task_details
    ADD CONSTRAINT marinem_task_details_pkey PRIMARY KEY (task_id);


--
-- Name: spare_crew spare_crew_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spare_crew
    ADD CONSTRAINT spare_crew_pkey PRIMARY KEY (spare_crew_id);


--
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (account_id);


--
-- Name: user_account user_account_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_username_key UNIQUE (username);


--
-- Name: vessel_breakdown_event vessel_breakdown_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_breakdown_event
    ADD CONSTRAINT vessel_breakdown_event_pkey PRIMARY KEY (event_id);


--
-- Name: vessel_breakdown_support vessel_breakdown_support_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_breakdown_support
    ADD CONSTRAINT vessel_breakdown_support_pkey PRIMARY KEY (record_id);


--
-- Name: vessel vessel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel
    ADD CONSTRAINT vessel_pkey PRIMARY KEY (vessel_id);


--
-- Name: vessel_report_enginelog vessel_report_enginelog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_enginelog
    ADD CONSTRAINT vessel_report_enginelog_pkey PRIMARY KEY (id);


--
-- Name: vessel_report_form vessel_report_form_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_form
    ADD CONSTRAINT vessel_report_form_pkey PRIMARY KEY (form_id);


--
-- Name: crew crew_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.crew
    ADD CONSTRAINT crew_pkey PRIMARY KEY (crew_id);


--
-- Name: decklog decklog_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.decklog
    ADD CONSTRAINT decklog_pkey PRIMARY KEY (decklog_id);


--
-- Name: disinfection_record disinfection_record_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.disinfection_record
    ADD CONSTRAINT disinfection_record_pkey PRIMARY KEY (record_id);


--
-- Name: spare_crew spare_crew_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.spare_crew
    ADD CONSTRAINT spare_crew_pkey PRIMARY KEY (spare_crew_id);


--
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (account_id);


--
-- Name: vessel_breakdown_event vessel_breakdown_event_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_breakdown_event
    ADD CONSTRAINT vessel_breakdown_event_pkey PRIMARY KEY (event_id);


--
-- Name: vessel_breakdown_support vessel_breakdown_support_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_breakdown_support
    ADD CONSTRAINT vessel_breakdown_support_pkey PRIMARY KEY (record_id);


--
-- Name: vessel vessel_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel
    ADD CONSTRAINT vessel_pkey PRIMARY KEY (vessel_id);


--
-- Name: vessel_report_enginelog vessel_report_enginelog_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_enginelog
    ADD CONSTRAINT vessel_report_enginelog_pkey PRIMARY KEY (id);


--
-- Name: vessel_report_form vessel_report_form_pkey; Type: CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_form
    ADD CONSTRAINT vessel_report_form_pkey PRIMARY KEY (form_id);


--
-- Name: fki_fk_user_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_user_account ON public.user_account_app USING btree (account_id);


--
-- Name: fki_fk_vessel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_vessel ON public.lock USING btree (vessel_id);


--
-- Name: fk_vessel_idx; Type: INDEX; Schema: test; Owner: postgres
--

CREATE INDEX fk_vessel_idx ON test.lock USING btree (vessel_id);


--
-- Name: fki_fk_user_account; Type: INDEX; Schema: test; Owner: postgres
--

CREATE INDEX fki_fk_user_account ON test.user_account_app USING btree (account_id);


--
-- Name: fki_fk_vessel; Type: INDEX; Schema: test; Owner: postgres
--

CREATE INDEX fki_fk_vessel ON test.user_account_vessel USING btree (vessel_id);


--
-- Name: vessel_breakdown_support updateTime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "updateTime" BEFORE INSERT OR UPDATE ON public.vessel_breakdown_support FOR EACH ROW EXECUTE FUNCTION public."updateTimeForBreakdownSupport"();


--
-- Name: vessel_breakdown_support updateTime; Type: TRIGGER; Schema: test; Owner: postgres
--

CREATE TRIGGER "updateTime" BEFORE INSERT OR UPDATE ON test.vessel_breakdown_support FOR EACH ROW EXECUTE FUNCTION test."updateTimeForBreakdownSupport"();


--
-- Name: vessel_report_form_crew fk_crew; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_form_crew
    ADD CONSTRAINT fk_crew FOREIGN KEY (crew_id) REFERENCES public.crew(crew_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_breakdown_support fk_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_breakdown_support
    ADD CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES public.vessel_breakdown_event(event_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_form_crew fk_form; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_form_crew
    ADD CONSTRAINT fk_form FOREIGN KEY (form_id) REFERENCES public.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: decklog fk_form; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decklog
    ADD CONSTRAINT fk_form FOREIGN KEY (form_id) REFERENCES public.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_account_app fk_user_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account_app
    ADD CONSTRAINT fk_user_account FOREIGN KEY (account_id) REFERENCES public.user_account(account_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: user_account_vessel fk_user_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account_vessel
    ADD CONSTRAINT fk_user_account FOREIGN KEY (account_id) REFERENCES public.user_account(account_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: crew fk_vessel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crew
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES public.vessel(vessel_id);


--
-- Name: lock fk_vessel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lock
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES public.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: user_account_vessel fk_vessel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account_vessel
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES public.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: vessel_report_form fk_vessel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_form
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES public.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: disinfection_record fk_vessel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disinfection_record
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES public.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_breakdown_event fk_vessel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_breakdown_event
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES public.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_zpclutch fk_vesselreport; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_zpclutch
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES public.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_generator fk_vesselreport; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_generator
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES public.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_air_conditioning fk_vesselreport; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_air_conditioning
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES public.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_rob fk_vesselreport; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_rob
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES public.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_tank_sounding fk_vesselreport; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_tank_sounding
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES public.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_enginelog fk_vesselreportform; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vessel_report_enginelog
    ADD CONSTRAINT fk_vesselreportform FOREIGN KEY (form_id) REFERENCES public.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: marinem_task_details marinem_task_details_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marinem_task_details
    ADD CONSTRAINT marinem_task_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.marinem_orders(order_id) ON DELETE CASCADE;


--
-- Name: marinem_task_stages_details marinem_task_stages_details_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marinem_task_stages_details
    ADD CONSTRAINT marinem_task_stages_details_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.marinem_task_details(task_id) ON DELETE CASCADE;


--
-- Name: vessel_report_form_crew fk_crew; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_form_crew
    ADD CONSTRAINT fk_crew FOREIGN KEY (crew_id) REFERENCES test.crew(crew_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_breakdown_support fk_event; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_breakdown_support
    ADD CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES test.vessel_breakdown_event(event_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_form_crew fk_form; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_form_crew
    ADD CONSTRAINT fk_form FOREIGN KEY (form_id) REFERENCES test.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: decklog fk_form; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.decklog
    ADD CONSTRAINT fk_form FOREIGN KEY (form_id) REFERENCES test.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_account_app fk_user_account; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.user_account_app
    ADD CONSTRAINT fk_user_account FOREIGN KEY (account_id) REFERENCES test.user_account(account_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: user_account_vessel fk_user_account; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.user_account_vessel
    ADD CONSTRAINT fk_user_account FOREIGN KEY (account_id) REFERENCES test.user_account(account_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: lock fk_vessel; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.lock
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES test.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: user_account_vessel fk_vessel; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.user_account_vessel
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES test.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: crew fk_vessel; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.crew
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES test.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: vessel_report_form fk_vessel; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_form
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES test.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: disinfection_record fk_vessel; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.disinfection_record
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES test.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_breakdown_event fk_vessel; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_breakdown_event
    ADD CONSTRAINT fk_vessel FOREIGN KEY (vessel_id) REFERENCES test.vessel(vessel_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_zpclutch fk_vesselreport; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_zpclutch
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES test.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_generator fk_vesselreport; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_generator
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES test.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_air_conditioning fk_vesselreport; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_air_conditioning
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES test.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_rob fk_vesselreport; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_rob
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES test.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_tank_sounding fk_vesselreport; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_tank_sounding
    ADD CONSTRAINT fk_vesselreport FOREIGN KEY (form_id) REFERENCES test.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vessel_report_enginelog fk_vesselreportform; Type: FK CONSTRAINT; Schema: test; Owner: postgres
--

ALTER TABLE ONLY test.vessel_report_enginelog
    ADD CONSTRAINT fk_vesselreportform FOREIGN KEY (form_id) REFERENCES test.vessel_report_form(form_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA test; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA test TO test_user;


--
-- Name: TABLE crew; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.crew TO test_user;


--
-- Name: TABLE decklog; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.decklog TO test_user;


--
-- Name: TABLE disinfection_record; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.disinfection_record TO test_user;


--
-- Name: TABLE generator; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.generator TO test_user;


--
-- Name: TABLE lock; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.lock TO test_user;


--
-- Name: TABLE rob; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.rob TO test_user;


--
-- Name: TABLE tank_sounding; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.tank_sounding TO test_user;


--
-- Name: TABLE temperature_log; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.temperature_log TO test_user;


--
-- Name: TABLE user_account; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.user_account TO test_user;


--
-- Name: TABLE user_account_app; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.user_account_app TO test_user;


--
-- Name: TABLE user_account_vessel; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.user_account_vessel TO test_user;


--
-- Name: TABLE vessel; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel TO test_user;


--
-- Name: TABLE vessel_breakdown_event; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_breakdown_event TO test_user;


--
-- Name: TABLE vessel_breakdown_support; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_breakdown_support TO test_user;


--
-- Name: TABLE vessel_report_air_conditioning; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_report_air_conditioning TO test_user;


--
-- Name: TABLE vessel_report_enginelog; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_report_enginelog TO test_user;


--
-- Name: TABLE vessel_report_form; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_report_form TO test_user;


--
-- Name: TABLE vessel_report_form_crew; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_report_form_crew TO test_user;


--
-- Name: TABLE vessel_report_generator; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_report_generator TO test_user;


--
-- Name: TABLE vessel_report_rob; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_report_rob TO test_user;


--
-- Name: TABLE vessel_report_tank_sounding; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_report_tank_sounding TO test_user;


--
-- Name: TABLE vessel_report_zpclutch; Type: ACL; Schema: test; Owner: postgres
--

GRANT ALL ON TABLE test.vessel_report_zpclutch TO test_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: test; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA test REVOKE ALL ON TABLES  FROM postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA test GRANT ALL ON TABLES  TO test_user;


--
-- PostgreSQL database dump complete
--

