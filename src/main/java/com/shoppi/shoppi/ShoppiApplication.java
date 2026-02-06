package com.shoppi.shoppi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * @author Brahyan_Bejarano
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.shoppi.shoppi", "com.cootras.flota"})
@EnableJpaRepositories(basePackages = {"com.shoppi.shoppi.Repository", "com.cootras.flota.repository"})
@EntityScan(basePackages = {"com.shoppi.shoppi.Entity", "com.cootras.flota.model"}) // <--- ¡Vital!
public class ShoppiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoppiApplication.class, args);
    }
}
