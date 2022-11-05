CREATE TABLE "user" (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username varchar(40) NOT NULL,
    email varchar(40)
)