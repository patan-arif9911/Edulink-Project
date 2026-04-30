package com.edulink.complianceservice.repository;

import com.edulink.complianceservice.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RuleRepository extends JpaRepository<Rule,Long> {
}
