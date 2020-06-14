package mk.finki.gameinfopedia.repository;

import mk.finki.gameinfopedia.domain.Genre;
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

    @Query("select distinct videoGame from VideoGame videoGame join videoGame.genres genre where genre.name = :name")
    List<VideoGame> findByGenreName(@Param("name") String name);

    @Query("select distinct videoGame from VideoGame videoGame join videoGame.platforms platform where platform.name = :name")
    List<VideoGame> findByPlatformName(@Param("name") String name);

    List<VideoGame> findByPublisherName(String name);

    @Query("from VideoGame videoGame where (videoGame.title like %:input%)")
    List<VideoGame> findVideoGameTitleContains(@Param("input") String input);

    @Query("from VideoGame videoGame where (videoGame.price >= :min) and (videoGame.price <= :max) order by videoGame.price ASC")
    List<VideoGame> findByPriceMinMaxAsc(@Param("min") Double min, @Param("max") Double max);

    @Query("from VideoGame videoGame where (videoGame.price >= :min) and (videoGame.price <= :max) order by videoGame.price DESC")
    List<VideoGame> findByPriceMinMaxDesc(@Param("min") Double min, @Param("max") Double max);

    @Query("from VideoGame videoGame where (videoGame.averageRating >= :min) and (videoGame.averageRating <= :max) order by videoGame.averageRating ASC")
    List<VideoGame> findByRatingMinMaxAsc(@Param("min") Double min, @Param("max") Double max);

    @Query("from VideoGame videoGame where (videoGame.averageRating >= :min) and (videoGame.averageRating <= :max) order by videoGame.averageRating DESC")
    List<VideoGame> findByRatingMinMaxDesc(@Param("min") Double min, @Param("max") Double max);
}
