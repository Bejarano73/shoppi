/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.cootras.flota.repository;

import com.shoppi.shoppi.Entity.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Brahyan_Bejarano
 */
@Repository
public interface CiudadResponsity extends JpaRepository<Ciudad, Integer> {

}
