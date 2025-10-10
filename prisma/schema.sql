--
-- PostgreSQL database dump
--

\restrict 3Xltr9oXfuBifFBBHAmPG0bsGnC5Uy2xEcgOmCz0MKziW7h21NiapsB4o46XDqE

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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
-- Name: ContractType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContractType" AS ENUM (
    'CDI',
    'CDD',
    'INTERIM',
    'STAGE'
);


ALTER TYPE public."ContractType" OWNER TO postgres;

--
-- Name: DayOfWeek; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DayOfWeek" AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);


ALTER TYPE public."DayOfWeek" OWNER TO postgres;

--
-- Name: LeaveStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LeaveStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."LeaveStatus" OWNER TO postgres;

--
-- Name: LeaveType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LeaveType" AS ENUM (
    'CP',
    'RTT',
    'MALADIE',
    'SANS_SOLDE'
);


ALTER TYPE public."LeaveType" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Status" AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'DONE'
);


ALTER TYPE public."Status" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    "idToken" text,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Contract; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Contract" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "contractType" public."ContractType" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Contract" OWNER TO postgres;

--
-- Name: Leave; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Leave" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "leaveType" public."LeaveType" NOT NULL,
    status public."LeaveStatus" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Leave" OWNER TO postgres;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    status public."Status" DEFAULT 'TODO'::public."Status" NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: TimeEntry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TimeEntry" (
    id text NOT NULL,
    date date NOT NULL,
    "employeeId" text NOT NULL,
    "checkIn" timestamp(3) without time zone,
    "checkOut" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TimeEntry" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    lastname text,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Verification" (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Verification" OWNER TO postgres;

--
-- Name: WorkDay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkDay" (
    id text NOT NULL,
    "scheduleId" text NOT NULL,
    "dayOfWeek" public."DayOfWeek" NOT NULL,
    "isWorking" boolean NOT NULL,
    "morningStart" text,
    "morningEnd" text,
    "afternoonStart" text,
    "afternoonEnd" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."WorkDay" OWNER TO postgres;

--
-- Name: WorkSchedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkSchedule" (
    id text NOT NULL,
    "employeeId" text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."WorkSchedule" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Contract Contract_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_pkey" PRIMARY KEY (id);


--
-- Name: Leave Leave_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Leave"
    ADD CONSTRAINT "Leave_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: TimeEntry TimeEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TimeEntry"
    ADD CONSTRAINT "TimeEntry_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Verification Verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Verification"
    ADD CONSTRAINT "Verification_pkey" PRIMARY KEY (id);


--
-- Name: WorkDay WorkDay_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkDay"
    ADD CONSTRAINT "WorkDay_pkey" PRIMARY KEY (id);


--
-- Name: WorkSchedule WorkSchedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkSchedule"
    ADD CONSTRAINT "WorkSchedule_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_accessToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_accessToken_idx" ON public."Account" USING btree ("accessToken");


--
-- Name: Account_accountId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_accountId_idx" ON public."Account" USING btree ("accountId");


--
-- Name: Account_idToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_idToken_idx" ON public."Account" USING btree ("idToken");


--
-- Name: Account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_id_idx" ON public."Account" USING btree (id);


--
-- Name: Account_providerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_providerId_idx" ON public."Account" USING btree ("providerId");


--
-- Name: Account_refreshToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_refreshToken_idx" ON public."Account" USING btree ("refreshToken");


--
-- Name: Account_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_userId_idx" ON public."Account" USING btree ("userId");


--
-- Name: Contract_employeeId_endDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Contract_employeeId_endDate_idx" ON public."Contract" USING btree ("employeeId", "endDate");


--
-- Name: Contract_employeeId_startDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Contract_employeeId_startDate_idx" ON public."Contract" USING btree ("employeeId", "startDate");


--
-- Name: Leave_employeeId_startDate_endDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Leave_employeeId_startDate_endDate_idx" ON public."Leave" USING btree ("employeeId", "startDate", "endDate");


--
-- Name: Leave_employeeId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Leave_employeeId_status_idx" ON public."Leave" USING btree ("employeeId", status);


--
-- Name: Session_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_id_idx" ON public."Session" USING btree (id);


--
-- Name: Session_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_token_idx" ON public."Session" USING btree (token);


--
-- Name: Session_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_token_key" ON public."Session" USING btree (token);


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: Task_authorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Task_authorId_idx" ON public."Task" USING btree ("authorId");


--
-- Name: Task_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Task_id_idx" ON public."Task" USING btree (id);


--
-- Name: Task_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Task_slug_key" ON public."Task" USING btree (slug);


--
-- Name: Task_title_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Task_title_idx" ON public."Task" USING btree (title);


--
-- Name: Task_title_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Task_title_key" ON public."Task" USING btree (title);


--
-- Name: TimeEntry_employeeId_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TimeEntry_employeeId_date_idx" ON public."TimeEntry" USING btree ("employeeId", date DESC);


--
-- Name: TimeEntry_employeeId_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TimeEntry_employeeId_date_key" ON public."TimeEntry" USING btree ("employeeId", date);


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_id_idx" ON public."User" USING btree (id);


--
-- Name: Verification_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Verification_id_idx" ON public."Verification" USING btree (id);


--
-- Name: Verification_identifier_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Verification_identifier_idx" ON public."Verification" USING btree (identifier);


--
-- Name: WorkDay_scheduleId_dayOfWeek_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkDay_scheduleId_dayOfWeek_key" ON public."WorkDay" USING btree ("scheduleId", "dayOfWeek");


--
-- Name: WorkDay_scheduleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkDay_scheduleId_idx" ON public."WorkDay" USING btree ("scheduleId");


--
-- Name: WorkSchedule_employeeId_endDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkSchedule_employeeId_endDate_idx" ON public."WorkSchedule" USING btree ("employeeId", "endDate");


--
-- Name: WorkSchedule_employeeId_startDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkSchedule_employeeId_startDate_idx" ON public."WorkSchedule" USING btree ("employeeId", "startDate");


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Contract Contract_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Leave Leave_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Leave"
    ADD CONSTRAINT "Leave_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Task Task_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TimeEntry TimeEntry_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TimeEntry"
    ADD CONSTRAINT "TimeEntry_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkDay WorkDay_scheduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkDay"
    ADD CONSTRAINT "WorkDay_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES public."WorkSchedule"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkSchedule WorkSchedule_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkSchedule"
    ADD CONSTRAINT "WorkSchedule_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 3Xltr9oXfuBifFBBHAmPG0bsGnC5Uy2xEcgOmCz0MKziW7h21NiapsB4o46XDqE

