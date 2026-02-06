/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.shoppi.shoppi.Config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;

/**
 * @author Brahyan_Bejarano
 */
@Configuration
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() {
        Dotenv dotenv = Dotenv.configure().directory("./").filename("config.env").load();
        String url = "jdbc:postgresql://" + dotenv.get("DB_HOST") + ":" + dotenv.get("DB_PORT") + "/" + dotenv.get("DB_NAME");
        return DataSourceBuilder.create().driverClassName("org.postgresql.Driver").url(url).username(dotenv.get("DB_USER")).password(dotenv.get("DB_PASS")).build();
    }
}
