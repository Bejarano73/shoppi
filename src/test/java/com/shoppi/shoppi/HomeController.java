package com.shoppi.shoppi;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String shoppi() {
        System.err.println("hey");
        return "newhtml"; // apunta a shoppi.html en templates
    }

}
