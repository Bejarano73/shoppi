package com.shoppi.shoppi.Config;

import io.github.cdimascio.dotenv.Dotenv;
import java.nio.file.Paths;
import org.postgresql.ds.PGSimpleDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() {
        // Detectar la ruta absoluta de config.env según el sistema operativo
        String os = System.getProperty("os.name").toLowerCase();
        String configPath;

        if (os.contains("win")) {
            // Windows
            configPath = "D:/basededatos/config.env";
        } else {
            // Linux / macOS
            configPath = "/home/brahyan-bejarano/config.env"; // Cambia según tu Linux
        }

        // Cargar archivo config.env
        Dotenv dotenv = Dotenv.configure()
                .directory(Paths.get(configPath).getParent().toString())
                .filename(Paths.get(configPath).getFileName().toString())
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
            ds.setSslfactory("org.postgresql.ssl.NonValidatingFactory");
        }

        return ds;
    }
}
