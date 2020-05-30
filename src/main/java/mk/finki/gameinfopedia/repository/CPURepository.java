package mk.finki.gameinfopedia.repository;

import mk.finki.gameinfopedia.domain.CPU;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CPU entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CPURepository extends JpaRepository<CPU, Long> {

}
