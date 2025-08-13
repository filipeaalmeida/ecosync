drop table exigencia;
drop table licenca;

CREATE TABLE licenca (
    id SERIAL PRIMARY KEY,
    processo varchar(255) UNIQUE NOT NULL,
    titulo VARCHAR(255),
    caracterizacao TEXT,
    razao_social VARCHAR(255),
    municipio VARCHAR(255),
    data_emissao DATE,
    data_validade DATE,
    prazo_renovacao DATE,
    exigencias TEXT,
    status VARCHAR(255),
    data_criacao timestamp without time zone,
    data_remocao timestamp without time zone,
    data_alteracao timestamp without time zone,
    data_processamento timestamp without time zone,
);

CREATE TABLE exigencia (
    id SERIAL PRIMARY KEY,
    agrupada boolean default false,
    licenca_id INTEGER,
    descricao TEXT NOT NULL,
    prazo DATE,
    status VARCHAR(255),
    data_criacao timestamp without time zone,
    data_remocao timestamp without time zone,
    data_alteracao timestamp without time zone,
    FOREIGN KEY (licenca_id) REFERENCES licenca(id)
);
