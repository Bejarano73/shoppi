package com.shoppi.shoppi.Config;

import io.github.cdimascio.dotenv.Dotenv;
import org.postgresql.ds.PGSimpleDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() {
        // Cargar archivo config.env desde el directorio raíz
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .filename("config.env")
                .load();

        PGSimpleDataSource ds = new PGSimpleDataSource();
        ds.setServerNames(new String[]{dotenv.get("DB_HOST")});
        ds.setPortNumbers(new int[]{Integer.parseInt(dotenv.get("DB_PORT"))});
        ds.setDatabaseName(dotenv.get("DB_NAME"));
        ds.setUser(dotenv.get("DB_USER"));
        ds.setPassword(dotenv.get("DB_PASSWORD"));

        // Configurar SSL si DB_SSLMODE está presente
        String sslmode = dotenv.get("DB_SSLMODE", "disable"); // default disable
        if (sslmode.equalsIgnoreCase("require")) {
            ds.setSsl(true);
            ds.setSslfactory("org.postgresql.ssl.NonValidatingFactory"); // útil si no tienes certificados locales
        }

        return ds;
    }
}
