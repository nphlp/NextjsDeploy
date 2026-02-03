--
-- PostgreSQL database dump
--

\restrict rNsPKipu4arhrgKBhoMqr66aZdVIg8YqEkw8l9x82pkomKUepgwLO1R4LGxgCpS

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

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

ALTER TABLE IF EXISTS ONLY public."Task" DROP CONSTRAINT IF EXISTS "Task_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Quantity" DROP CONSTRAINT IF EXISTS "Quantity_fruitId_fkey";
ALTER TABLE IF EXISTS ONLY public."Quantity" DROP CONSTRAINT IF EXISTS "Quantity_basketId_fkey";
ALTER TABLE IF EXISTS ONLY public."Fruit" DROP CONSTRAINT IF EXISTS "Fruit_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Basket" DROP CONSTRAINT IF EXISTS "Basket_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
DROP INDEX IF EXISTS public."Verification_identifier_idx";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."User_email_idx";
DROP INDEX IF EXISTS public."Task_userId_idx";
DROP INDEX IF EXISTS public."Task_title_idx";
DROP INDEX IF EXISTS public."Session_userId_idx";
DROP INDEX IF EXISTS public."Session_token_key";
DROP INDEX IF EXISTS public."Session_token_idx";
DROP INDEX IF EXISTS public."Quantity_fruitId_idx";
DROP INDEX IF EXISTS public."Quantity_fruitId_basketId_idx";
DROP INDEX IF EXISTS public."Quantity_basketId_idx";
DROP INDEX IF EXISTS public."Quantity_basketId_fruitId_key";
DROP INDEX IF EXISTS public."Fruit_userId_idx";
DROP INDEX IF EXISTS public."Fruit_name_key";
DROP INDEX IF EXISTS public."Fruit_name_idx";
DROP INDEX IF EXISTS public."Basket_userId_idx";
DROP INDEX IF EXISTS public."Account_userId_idx";
DROP INDEX IF EXISTS public."Account_providerId_idx";
DROP INDEX IF EXISTS public."Account_accountId_idx";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."Verification" DROP CONSTRAINT IF EXISTS "Verification_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Task" DROP CONSTRAINT IF EXISTS "Task_pkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_pkey";
ALTER TABLE IF EXISTS ONLY public."Quantity" DROP CONSTRAINT IF EXISTS "Quantity_pkey";
ALTER TABLE IF EXISTS ONLY public."Fruit" DROP CONSTRAINT IF EXISTS "Fruit_pkey";
ALTER TABLE IF EXISTS ONLY public."Basket" DROP CONSTRAINT IF EXISTS "Basket_pkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."Verification";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Task";
DROP TABLE IF EXISTS public."Session";
DROP TABLE IF EXISTS public."Quantity";
DROP TABLE IF EXISTS public."Fruit";
DROP TABLE IF EXISTS public."Basket";
DROP TABLE IF EXISTS public."Account";
DROP TYPE IF EXISTS public."Status";
DROP TYPE IF EXISTS public."Role";
--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN',
    'VENDOR'
);


--
-- Name: Status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Status" AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'DONE'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: Basket; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Basket" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Fruit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Fruit" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL
);


--
-- Name: Quantity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Quantity" (
    id text NOT NULL,
    quantity integer NOT NULL,
    "basketId" text NOT NULL,
    "fruitId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: Task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    title text NOT NULL,
    status public."Status" NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: Verification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Verification" (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Basket Basket_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Basket"
    ADD CONSTRAINT "Basket_pkey" PRIMARY KEY (id);


--
-- Name: Fruit Fruit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Fruit"
    ADD CONSTRAINT "Fruit_pkey" PRIMARY KEY (id);


--
-- Name: Quantity Quantity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quantity"
    ADD CONSTRAINT "Quantity_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Verification Verification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Verification"
    ADD CONSTRAINT "Verification_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_accountId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Account_accountId_idx" ON public."Account" USING btree ("accountId");


--
-- Name: Account_providerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Account_providerId_idx" ON public."Account" USING btree ("providerId");


--
-- Name: Account_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Account_userId_idx" ON public."Account" USING btree ("userId");


--
-- Name: Basket_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Basket_userId_idx" ON public."Basket" USING btree ("userId");


--
-- Name: Fruit_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Fruit_name_idx" ON public."Fruit" USING btree (name);


--
-- Name: Fruit_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Fruit_name_key" ON public."Fruit" USING btree (name);


--
-- Name: Fruit_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Fruit_userId_idx" ON public."Fruit" USING btree ("userId");


--
-- Name: Quantity_basketId_fruitId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Quantity_basketId_fruitId_key" ON public."Quantity" USING btree ("basketId", "fruitId");


--
-- Name: Quantity_basketId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Quantity_basketId_idx" ON public."Quantity" USING btree ("basketId");


--
-- Name: Quantity_fruitId_basketId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Quantity_fruitId_basketId_idx" ON public."Quantity" USING btree ("fruitId", "basketId");


--
-- Name: Quantity_fruitId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Quantity_fruitId_idx" ON public."Quantity" USING btree ("fruitId");


--
-- Name: Session_token_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Session_token_idx" ON public."Session" USING btree (token);


--
-- Name: Session_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Session_token_key" ON public."Session" USING btree (token);


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: Task_title_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Task_title_idx" ON public."Task" USING btree (title);


--
-- Name: Task_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Task_userId_idx" ON public."Task" USING btree ("userId");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Verification_identifier_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Verification_identifier_idx" ON public."Verification" USING btree (identifier);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Basket Basket_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Basket"
    ADD CONSTRAINT "Basket_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Fruit Fruit_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Fruit"
    ADD CONSTRAINT "Fruit_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quantity Quantity_basketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quantity"
    ADD CONSTRAINT "Quantity_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES public."Basket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quantity Quantity_fruitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quantity"
    ADD CONSTRAINT "Quantity_fruitId_fkey" FOREIGN KEY ("fruitId") REFERENCES public."Fruit"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Task Task_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rNsPKipu4arhrgKBhoMqr66aZdVIg8YqEkw8l9x82pkomKUepgwLO1R4LGxgCpS

