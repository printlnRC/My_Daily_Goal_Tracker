CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

ALTER TABLE "Goal"
    ADD COLUMN IF NOT EXISTS "day" TEXT NOT NULL DEFAULT 'LUNDI';
ALTER TABLE "Goal"
    ADD COLUMN IF NOT EXISTS "userId" INTEGER;
UPDATE "Goal" SET "day" = 'LUNDI' WHERE "day" IS NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Goal" WHERE "userId" IS NULL) THEN
        RAISE EXCEPTION 'Existing goals without an owner must be assigned to a user before applying this migration.';
    END IF;
END $$;

ALTER TABLE "Goal" ALTER COLUMN "day" SET NOT NULL;
ALTER TABLE "Goal" ALTER COLUMN "day" DROP DEFAULT;
ALTER TABLE "Goal" ALTER COLUMN "userId" SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Goal_userId_fkey'
    ) THEN
        ALTER TABLE "Goal"
            ADD CONSTRAINT "Goal_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "GoalOccurrence" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "goalId" INTEGER,
    "weekStart" DATE NOT NULL,
    "text" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalOccurrence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Badge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BadgeAward" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "badgeId" INTEGER NOT NULL,
    "weekStart" DATE NOT NULL,
    "obtainedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BadgeAward_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "GoalOccurrence_userId_goalId_weekStart_key"
    ON "GoalOccurrence"("userId", "goalId", "weekStart");
CREATE INDEX IF NOT EXISTS "GoalOccurrence_userId_weekStart_idx"
    ON "GoalOccurrence"("userId", "weekStart");
CREATE UNIQUE INDEX IF NOT EXISTS "Badge_name_key" ON "Badge"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "BadgeAward_userId_weekStart_key"
    ON "BadgeAward"("userId", "weekStart");
CREATE INDEX IF NOT EXISTS "BadgeAward_userId_badgeId_idx"
    ON "BadgeAward"("userId", "badgeId");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GoalOccurrence_userId_fkey') THEN
        ALTER TABLE "GoalOccurrence"
            ADD CONSTRAINT "GoalOccurrence_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GoalOccurrence_goalId_fkey') THEN
        ALTER TABLE "GoalOccurrence"
            ADD CONSTRAINT "GoalOccurrence_goalId_fkey"
            FOREIGN KEY ("goalId") REFERENCES "Goal"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BadgeAward_userId_fkey') THEN
        ALTER TABLE "BadgeAward"
            ADD CONSTRAINT "BadgeAward_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BadgeAward_badgeId_fkey') THEN
        ALTER TABLE "BadgeAward"
            ADD CONSTRAINT "BadgeAward_badgeId_fkey"
            FOREIGN KEY ("badgeId") REFERENCES "Badge"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

INSERT INTO "Badge" ("name", "threshold")
VALUES
    ('noob_badge', 25),
    ('beginner_badge', 50),
    ('mid_badge', 75),
    ('sigma_badge', 100)
ON CONFLICT ("name") DO UPDATE
SET "threshold" = EXCLUDED."threshold";

INSERT INTO "GoalOccurrence"
    ("userId", "goalId", "weekStart", "text", "priority", "day", "completed")
SELECT
    "userId",
    "id",
    date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Paris')::date,
    "text",
    "priority",
    "day",
    "completed"
FROM "Goal"
ON CONFLICT ("userId", "goalId", "weekStart") DO NOTHING;
