IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'MovieDux')
BEGIN
    CREATE DATABASE MovieDux;
END
GO

USE MovieDux;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Movies' AND xtype='U')
BEGIN
    CREATE TABLE Movies (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        title       NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX)
    );

    INSERT INTO Movies (title, description) VALUES
    ('Inception',     'Un ladrón que roba secretos corporativos a través de la tecnología para compartir sueños.'),
    ('The Matrix',    'Un hacker descubre la verdadera naturaleza de la realidad y su papel en la guerra contra sus controladores.'),
    ('Interstellar',  'Un equipo de exploradores viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.'),
    ('The Dark Knight','Batman enfrenta al Joker, un criminal cuya anarquía y caos sumerge a Gotham en la violencia.');
END
GO
