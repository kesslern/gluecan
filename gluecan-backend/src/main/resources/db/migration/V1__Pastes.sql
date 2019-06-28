create table Pastes (
    id integer primary key autoincrement,
    views integer not null default 0,
    language text,
    text text not null
)
