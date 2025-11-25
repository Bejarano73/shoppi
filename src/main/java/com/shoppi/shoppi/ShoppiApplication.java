package com.shoppi.shoppi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.shoppi.shoppi", "com.cootras.flota"})
public class ShoppiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoppiApplication.class, args);
    }
}
