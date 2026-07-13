package com.career.navigator;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    // JpaRepository already contains methods like save(), findAll(), deleteById()
    // You don't need to write any code here for basic operations!
}