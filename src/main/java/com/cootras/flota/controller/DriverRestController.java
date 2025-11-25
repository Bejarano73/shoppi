package com.cootras.flota.controller;

import com.cootras.flota.dto.DriverDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/conductores")
public class DriverRestController {

    private final List<DriverDTO> seed;

    public DriverRestController() {
        seed = new ArrayList<>();
        seed.add(DriverDTO.builder().id(1L).nombre("Carlos Rodríguez Martínez").estado("Activo")
                .email("carlos.rodriguez@cootrasmateriales.com").telefono("+57 301 2345678")
                .rating(4.8).kilometros(156_789).viajes(1245)
                .licenciaNumero("C-12345678").licenciaCategoria("C").licenciaVencimiento("2025-12-30")
                .vehiculoAsignado("VOL-001").fechaContratacion("2020-03-14").ultimaInspeccion("2024-01-14")
                .build());
        seed.add(DriverDTO.builder().id(2L).nombre("Juan Pablo Gómez Silva").estado("Activo")
                .email("juan.gomez@cootrasmateriales.com").telefono("+57 302 3456789")
                .rating(4.6).kilometros(234_567).viajes(1856)
                .licenciaNumero("C-23456789").licenciaCategoria("C").licenciaVencimiento("2026-11-20")
                .vehiculoAsignado("VOL-002").fechaContratacion("2019-05-01").ultimaInspeccion("2024-02-01")
                .build());
        seed.add(DriverDTO.builder().id(3L).nombre("Miguel Ángel Pérez López").estado("Activo")
                .email("miguel.perez@cootrasmateriales.com").telefono("+57 303 4567890")
                .rating(4.9).kilometros(112_345).viajes(892)
                .licenciaNumero("C-34567890").licenciaCategoria("C").licenciaVencimiento("2025-09-10")
                .vehiculoAsignado("VOL-003").fechaContratacion("2021-07-20").ultimaInspeccion("2024-03-10")
                .build());
        seed.add(DriverDTO.builder().id(4L).nombre("Fernando José Morales Castro").estado("Inactivo")
                .email("fernando.morales@cootrasmateriales.com").telefono("+57 304 5678901")
                .rating(4.4).kilometros(45_678).viajes(345)
                .licenciaNumero("C-45678901").licenciaCategoria("C").licenciaVencimiento("2024-12-01")
                .vehiculoAsignado("VOL-004").fechaContratacion("2018-11-12").ultimaInspeccion("2023-12-20")
                .build());
        seed.add(DriverDTO.builder().id(5L).nombre("Daniel Alfonso Ruiz García").estado("Activo")
                .email("daniel.ruiz@cootrasmateriales.com").telefono("+57 305 6789012")
                .rating(4.7).kilometros(78_901).viajes(500)
                .licenciaNumero("C-56789012").licenciaCategoria("C").licenciaVencimiento("2026-05-05")
                .vehiculoAsignado("VOL-005").fechaContratacion("2022-02-02").ultimaInspeccion("2024-04-15")
                .build());
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "") String estado,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String qq = q.trim().toLowerCase(Locale.ROOT);
        String ee = estado.trim().toLowerCase(Locale.ROOT);
        List<DriverDTO> filtered = seed.stream().filter(d -> {
            boolean okQ = qq.isEmpty() || (d.getNombre()+" "+d.getEmail()+" "+d.getTelefono()).toLowerCase(Locale.ROOT).contains(qq);
            boolean okE = ee.isEmpty() || d.getEstado().toLowerCase(Locale.ROOT).equals(ee);
            return okQ && okE;
        }).toList();
        int total = filtered.size();
        int pages = (int)Math.ceil(total / (double)size);
        int p = Math.max(1, Math.min(page, Math.max(pages, 1)));
        int from = Math.max(0, (p-1)*size);
        int to = Math.min(total, from+size);
        List<DriverDTO> items = filtered.subList(from, to);
        return ResponseEntity.ok(Map.of(
                "items", items,
                "page", p,
                "size", size,
                "total", total,
                "pages", pages
        ));
    }
}

