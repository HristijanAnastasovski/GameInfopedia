package mk.finki.gameinfopedia.repository;

import mk.finki.gameinfopedia.domain.GPU;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the GPU entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GPURepository extends JpaRepository<GPU, Long> {

}
