package com.edulink.complianceservice.repository;

import com.edulink.complianceservice.entity.Regulator;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegulatorRepository extends JpaRepository<Regulator,Long> {



    @Transactional
    @Modifying
    @Query("DELETE FROM Regulator r where r.ruleId= :id")
    void deleteByRuleId(@Param("id") long id);

    @Query("SELECT COUNT(r) from Regulator r where r.ruleId= :id")
    long existsByRuleId(@Param("id") long id);

    Optional<Regulator> findByRuleId(Long id);
}
