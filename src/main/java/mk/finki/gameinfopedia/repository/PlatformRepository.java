package mk.finki.gameinfopedia.repository;

import mk.finki.gameinfopedia.domain.Platform;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Platform entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlatformRepository extends JpaRepository<Platform, Long> {

}
