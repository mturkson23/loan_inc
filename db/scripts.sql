-- Table: agent_state

-- DROP TABLE agent_state;

CREATE TABLE agent_state
(
    "id" bigserial NOT NULL,
    "name" character varying COLLATE pg_catalog."default" NOT NULL,
	score integer NOT NULL DEFAULT 1,
    description text,
    CONSTRAINT pkey_agent_state_id PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE agent_state OWNER to postgres;

-- Table: transaction_state

-- DROP TABLE transaction_state;

CREATE TABLE transaction_state
(
    "id" bigserial NOT NULL,
    "name" character varying COLLATE pg_catalog."default" NOT NULL,
	score integer NOT NULL DEFAULT 1,
    description text,
    CONSTRAINT pkey_transaction_state_id PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE transaction_state OWNER to postgres;

-- Table: loan_state

-- DROP TABLE loan_state;

CREATE TABLE loan_state
(
    "id" bigserial NOT NULL,
    "name" character varying COLLATE pg_catalog."default" NOT NULL,
	score integer NOT NULL DEFAULT 1,
    description text,
    CONSTRAINT pkey_loan_state_id PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE loan_state OWNER to postgres;

-- Table: city

-- DROP TABLE city;

CREATE TABLE city
(
    "id" bigserial NOT NULL,
    "name" character varying COLLATE pg_catalog."default" NOT NULL,
    description text,
    CONSTRAINT pkey_city_id PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE city OWNER to postgres;

-- Table: region

-- DROP TABLE region;

CREATE TABLE region
(
    "id" bigserial NOT NULL,
    "name" character varying COLLATE pg_catalog."default" NOT NULL,
    description text,
    CONSTRAINT pkey_region_id PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE region OWNER to postgres;

-- Table: customer

-- DROP TABLE customer;

CREATE TABLE customer
(
    "id" bigserial NOT NULL,
    date_created timestamp without time zone NOT NULL DEFAULT now(),
    status integer NOT NULL DEFAULT 1,
    stamp timestamp without time zone NOT NULL DEFAULT now(),
    customer_no character varying NOT NULL,
    first_name character varying NOT NULL,
    surname character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL,
    address text DEFAULT '',
    city_id bigint NOT NULL,
    region_id bigint NOT NULL,
    x_coordinate double precision NOT NULL DEFAULT 0.000000,
    y_coordinate double precision NOT NULL DEFAULT 0.000000,
    CONSTRAINT pkey_customer_id PRIMARY KEY (id),
    CONSTRAINT fkey_customer_city_id FOREIGN KEY (city_id)
        REFERENCES city (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fkey_customer_region_id FOREIGN KEY (region_id)
        REFERENCES region (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE customer OWNER to postgres;

-- Index: uidx_customer_id

-- DROP INDEX uidx_customer_id;

CREATE UNIQUE INDEX uidx_customer_id
    ON customer USING btree
    ("id" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: agent

-- DROP TABLE agent;

CREATE TABLE agent
(
    "id" bigserial NOT NULL,
    date_created timestamp without time zone NOT NULL DEFAULT now(),
    status integer NOT NULL DEFAULT 1,
    stamp timestamp without time zone NOT NULL DEFAULT now(),
    agent_no character varying NOT NULL,
    first_name character varying NOT NULL,
    surname character varying NOT NULL,
    phone character varying NOT NULL,
    password_hash text NOT NULL,
    state_id bigint NOT NULL,
    CONSTRAINT pkey_agent_id PRIMARY KEY (id),
    CONSTRAINT fkey_agent_state_id FOREIGN KEY (state_id)
        REFERENCES agent_state (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE agent OWNER to postgres;

-- Index: uidx_agent_id

-- DROP INDEX uidx_agent_id;

CREATE UNIQUE INDEX uidx_agent_id
    ON agent USING btree
    ("id" ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: loan

-- DROP TABLE loan;

CREATE TABLE loan
(
    "id" bigserial NOT NULL,
    date_created timestamp without time zone NOT NULL DEFAULT now(),
    status integer NOT NULL DEFAULT 1,
    stamp timestamp without time zone NOT NULL DEFAULT now(),
    customer_id bigint NOT NULL,
	amount double precision NOT NULL,
	rate double precision NOT NULL,
	begin_date date NOT NULL,
    state_id bigint NOT NULL,
    CONSTRAINT pkey_loan_id PRIMARY KEY (id),
    CONSTRAINT fkey_loan_state_id FOREIGN KEY (state_id)
        REFERENCES loan_state (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fkey_loan_customer_id FOREIGN KEY (customer_id)
        REFERENCES customer (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE loan OWNER to postgres;

-- Index: uidx_loan_id

-- DROP INDEX uidx_loan_id;

CREATE UNIQUE INDEX uidx_loan_id
    ON loan USING btree
    ("id" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: transaction

-- DROP TABLE transaction;

CREATE TABLE transaction
(
    "id" bigserial NOT NULL,
    date_created timestamp without time zone NOT NULL DEFAULT now(),
    status integer NOT NULL DEFAULT 1,
    stamp timestamp without time zone NOT NULL DEFAULT now(),
    loan_id bigint NOT NULL,
    date_paid date NOT NULL,
	amount_paid double precision NOT NULL,
    state_id bigint NOT NULL,
    agent_id bigint NOT NULL,
    CONSTRAINT pkey_transaction_id PRIMARY KEY (id),
    CONSTRAINT fkey_transaction_loan_id FOREIGN KEY (loan_id)
        REFERENCES loan (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fkey_transaction_state_id FOREIGN KEY (state_id)
        REFERENCES transaction_state (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fkey_transaction_agent_id FOREIGN KEY (agent_id)
        REFERENCES agent (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)
TABLESPACE pg_default;

ALTER TABLE transaction OWNER to postgres;

-- Index: uidx_transaction_id

-- DROP INDEX uidx_transaction_id;

CREATE UNIQUE INDEX uidx_transaction_id
    ON transaction USING btree
    ("id" ASC NULLS LAST)
    TABLESPACE pg_default;
