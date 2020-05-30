package mk.finki.gameinfopedia.repository;

import mk.finki.gameinfopedia.domain.VideoGame;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the VideoGame entity.
 */
@Repository
public interface VideoGameRepository extends JpaRepository<VideoGame, Long> {

    @Query(value = "select distinct videoGame from VideoGame videoGame left join fetch videoGame.platforms left join fetch videoGame.genres",
        countQuery = "select count(distinct videoGame) from VideoGame videoGame")
    Page<VideoGame> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct videoGame from VideoGame videoGame left join fetch videoGame.platforms left join fetch videoGame.genres")
    List<VideoGame> findAllWithEagerRelationships();

    @Query("select videoGame from VideoGame videoGame left join fetch videoGame.platforms left join fetch videoGame.genres where videoGame.id =:id")
    Optional<VideoGame> findOneWithEagerRelationships(@Param("id") Long id);

}
