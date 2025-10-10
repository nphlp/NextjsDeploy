-- Custom SQL constraint
-- -> Composite Foreign Key to enforce WorkSchedule.employeeId === Contract.employeeId
--
-- Purpose:
--   Ensures data integrity at the database level by preventing WorkSchedule records
--   from referencing a Contract that belongs to a different employee.
--
-- Examples:
--
-- ✅ Allowed: WorkSchedule with matching employeeId
--    Contract: { id: "c1", employeeId: "alice" }
--    WorkSchedule: { contractId: "c1", employeeId: "alice" }  ← Valid
--
-- ❌ Blocked: WorkSchedule with mismatched employeeId
--    Contract: { id: "c1", employeeId: "alice" }
--    WorkSchedule: { contractId: "c1", employeeId: "bob" }    ← PostgreSQL Error

-- Step 1: Add UNIQUE constraint on Contract(id, employeeId)
-- This is required to create a composite foreign key
-- Note: This does not change behavior since "id" is already unique (PK)
--       But PostgreSQL requires explicit UNIQUE on both columns for composite FK

ALTER TABLE "Contract"
ADD CONSTRAINT unique_contract_id_employee
UNIQUE (id, "employeeId");

-- Step 2: Drop the existing simple foreign key
-- The simple FK only checks: WorkSchedule.contractId → Contract.id
-- We need to replace it with a composite FK

ALTER TABLE "WorkSchedule"
DROP CONSTRAINT "WorkSchedule_contractId_fkey";

-- Step 3: Create composite foreign key
-- Composite FK checks TWO columns at once:
--   (WorkSchedule.contractId, WorkSchedule.employeeId) → (Contract.id, Contract.employeeId)
--
-- How it works:
--   - When inserting/updating a WorkSchedule, PostgreSQL verifies that a Contract row exists
--     where BOTH id = contractId AND employeeId = employeeId match
--   - This automatically enforces: WorkSchedule.employeeId === Contract.employeeId
--   - ON DELETE CASCADE: If Contract is deleted, all its WorkSchedules are deleted too
--   - ON UPDATE CASCADE: If Contract.id or Contract.employeeId change, WorkSchedules follow

ALTER TABLE "WorkSchedule"
ADD CONSTRAINT same_employeeid_for_contract_and_workschedule
FOREIGN KEY ("contractId", "employeeId")
REFERENCES "Contract"(id, "employeeId")
ON DELETE CASCADE
ON UPDATE CASCADE;
