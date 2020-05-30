package mk.finki.gameinfopedia.web.rest;

import mk.finki.gameinfopedia.domain.GPU;
import mk.finki.gameinfopedia.repository.GPURepository;
import mk.finki.gameinfopedia.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link mk.finki.gameinfopedia.domain.GPU}.
 */
@RestController
@RequestMapping("/api")
public class GPUResource {

    private final Logger log = LoggerFactory.getLogger(GPUResource.class);

    private static final String ENTITY_NAME = "gPU";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GPURepository gPURepository;

    public GPUResource(GPURepository gPURepository) {
        this.gPURepository = gPURepository;
    }

    /**
     * {@code POST  /gpus} : Create a new gPU.
     *
     * @param gPU the gPU to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gPU, or with status {@code 400 (Bad Request)} if the gPU has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/gpus")
    public ResponseEntity<GPU> createGPU(@RequestBody GPU gPU) throws URISyntaxException {
        log.debug("REST request to save GPU : {}", gPU);
        if (gPU.getId() != null) {
            throw new BadRequestAlertException("A new gPU cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GPU result = gPURepository.save(gPU);
        return ResponseEntity.created(new URI("/api/gpus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /gpus} : Updates an existing gPU.
     *
     * @param gPU the gPU to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gPU,
     * or with status {@code 400 (Bad Request)} if the gPU is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gPU couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/gpus")
    public ResponseEntity<GPU> updateGPU(@RequestBody GPU gPU) throws URISyntaxException {
        log.debug("REST request to update GPU : {}", gPU);
        if (gPU.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        GPU result = gPURepository.save(gPU);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, gPU.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /gpus} : get all the gPUS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gPUS in body.
     */
    @GetMapping("/gpus")
    public List<GPU> getAllGPUS() {
        log.debug("REST request to get all GPUS");
        return gPURepository.findAll();
    }

    /**
     * {@code GET  /gpus/:id} : get the "id" gPU.
     *
     * @param id the id of the gPU to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gPU, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/gpus/{id}")
    public ResponseEntity<GPU> getGPU(@PathVariable Long id) {
        log.debug("REST request to get GPU : {}", id);
        Optional<GPU> gPU = gPURepository.findById(id);
        return ResponseUtil.wrapOrNotFound(gPU);
    }

    /**
     * {@code DELETE  /gpus/:id} : delete the "id" gPU.
     *
     * @param id the id of the gPU to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/gpus/{id}")
    public ResponseEntity<Void> deleteGPU(@PathVariable Long id) {
        log.debug("REST request to delete GPU : {}", id);
        gPURepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
