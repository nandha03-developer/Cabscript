-- Change Contact ID from String (cuid) to Integer (autoincrement)

-- Step 1: Create a temporary sequence for new IDs
CREATE SEQUENCE contacts_id_seq;

-- Step 2: Add a new temporary integer column
ALTER TABLE contacts ADD COLUMN new_id INTEGER;

-- Step 3: Populate new_id with sequential numbers for existing records
UPDATE contacts SET new_id = nextval('contacts_id_seq');

-- Step 4: Drop the old primary key constraint
ALTER TABLE contacts DROP CONSTRAINT contacts_pkey;

-- Step 5: Drop the old id column
ALTER TABLE contacts DROP COLUMN id;

-- Step 6: Rename new_id to id
ALTER TABLE contacts RENAME COLUMN new_id TO id;

-- Step 7: Set the id column as NOT NULL
ALTER TABLE contacts ALTER COLUMN id SET NOT NULL;

-- Step 8: Set the sequence as the default for the id column
ALTER TABLE contacts ALTER COLUMN id SET DEFAULT nextval('contacts_id_seq');

-- Step 9: Set the sequence ownership to the id column
ALTER SEQUENCE contacts_id_seq OWNED BY contacts.id;

-- Step 10: Add primary key constraint back
ALTER TABLE contacts ADD PRIMARY KEY (id);

-- Step 11: Reset sequence to continue from current max + 1
SELECT setval('contacts_id_seq', COALESCE((SELECT MAX(id) FROM contacts), 0) + 1, false);
