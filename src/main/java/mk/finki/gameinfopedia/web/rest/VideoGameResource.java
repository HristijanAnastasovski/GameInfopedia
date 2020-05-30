package mk.finki.gameinfopedia.web.rest;

import mk.finki.gameinfopedia.domain.VideoGame;
import mk.finki.gameinfopedia.repository.VideoGameRepository;
import mk.finki.gameinfopedia.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link mk.finki.gameinfopedia.domain.VideoGame}.
 */
@RestController
@RequestMapping("/api")
public class VideoGameResource {

    private final Logger log = LoggerFactory.getLogger(VideoGameResource.class);

    private static final String ENTITY_NAME = "videoGame";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VideoGameRepository videoGameRepository;

    public VideoGameResource(VideoGameRepository videoGameRepository) {
        this.videoGameRepository = videoGameRepository;
    }

    /**
     * {@code POST  /video-games} : Create a new videoGame.
     *
     * @param videoGame the videoGame to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new videoGame, or with status {@code 400 (Bad Request)} if the videoGame has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/video-games")
    public ResponseEntity<VideoGame> createVideoGame(@RequestBody VideoGame videoGame) throws URISyntaxException {
        log.debug("REST request to save VideoGame : {}", videoGame);
        if (videoGame.getId() != null) {
            throw new BadRequestAlertException("A new videoGame cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VideoGame result = videoGameRepository.save(videoGame);
        return ResponseEntity.created(new URI("/api/video-games/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /video-games} : Updates an existing videoGame.
     *
     * @param videoGame the videoGame to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated videoGame,
     * or with status {@code 400 (Bad Request)} if the videoGame is not valid,
     * or with status {@code 500 (Internal Server Error)} if the videoGame couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/video-games")
    public ResponseEntity<VideoGame> updateVideoGame(@RequestBody VideoGame videoGame) throws URISyntaxException {
        log.debug("REST request to update VideoGame : {}", videoGame);
        if (videoGame.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        VideoGame result = videoGameRepository.save(videoGame);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, videoGame.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /video-games} : get all the videoGames.
     *
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of videoGames in body.
     */
    @GetMapping("/video-games")
    public ResponseEntity<List<VideoGame>> getAllVideoGames(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of VideoGames");
        Page<VideoGame> page;
        if (eagerload) {
            page = videoGameRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = videoGameRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /video-games/:id} : get the "id" videoGame.
     *
     * @param id the id of the videoGame to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the videoGame, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/video-games/{id}")
    public ResponseEntity<VideoGame> getVideoGame(@PathVariable Long id) {
        log.debug("REST request to get VideoGame : {}", id);
        Optional<VideoGame> videoGame = videoGameRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(videoGame);
    }

    /**
     * {@code DELETE  /video-games/:id} : delete the "id" videoGame.
     *
     * @param id the id of the videoGame to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/video-games/{id}")
    public ResponseEntity<Void> deleteVideoGame(@PathVariable Long id) {
        log.debug("REST request to delete VideoGame : {}", id);
        videoGameRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
