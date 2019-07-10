create table Pastes (
    id integer primary key,
    views integer not null default 0,
    language text,
    text text not null
)
