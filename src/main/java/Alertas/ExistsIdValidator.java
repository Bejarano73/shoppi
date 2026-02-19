/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Alertas;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 *
 * @author Brahyan_Bejarano
 */
public class ExistsIdValidator implements ConstraintValidator<ExistsId, Integer> {

    @PersistenceContext
    private EntityManager entityManager;

    private Class<?> entityClass;

    @Override
    public void initialize(ExistsId constraintAnnotation) {
        this.entityClass = constraintAnnotation.entity();
    }

    @Override
    public boolean isValid(Integer id, ConstraintValidatorContext context) {
        if (id == null) {
            return true; // Se asume válido si es null (para eso está @NotNull aparte)
        }
        // Verifica si el ID existe en la tabla de la entidad proporcionada
        Object entity = entityManager.find(entityClass, id);
        return entity != null;
    }
}
