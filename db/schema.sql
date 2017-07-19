DROP TABLE IF EXISTS "times";
DROP TABLE IF EXISTS "polls";
DROP TABLE IF EXISTS "events";
DROP TABLE IF EXISTS "admins";

CREATE TABLE "admins" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(32) NOT NULL,
  "email" VARCHAR(64) NOT NULL,
  "admin_code" VARCHAR(8) NOT NULL
);

CREATE TABLE "events" (
  "id" BIGSERIAL PRIMARY KEY,
  "title" VARCHAR(50) NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "description" VARCHAR(255),
  "admin_id" INTEGER REFERENCES "admins" NOT NULL,
  "event_date" VARCHAR(10) NOT NULL,
  "location" VARCHAR(80) NOT NULL,
  "event_code" VARCHAR(8) NOT NULL
);

CREATE TABLE "times" (
  "event_id" INTEGER REFERENCES "events" NOT NULL,
  "time1" VARCHAR(10) NOT NULL,
  "time2" VARCHAR(10),
  "time3" VARCHAR(10),
  "time4" VARCHAR(10)
);

CREATE TABLE "polls" (
  "id" BIGSERIAL PRIMARY KEY,
  "event_id" INTEGER REFERENCES "events" NOT NULL,
  "name" VARCHAR(32) NOT NULL,
  "time1" BOOLEAN,
  "time2" BOOLEAN,
  "time3" BOOLEAN,
  "time4" BOOLEAN
);
