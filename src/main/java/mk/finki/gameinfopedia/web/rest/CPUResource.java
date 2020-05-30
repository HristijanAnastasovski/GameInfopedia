package mk.finki.gameinfopedia.web.rest;

import mk.finki.gameinfopedia.domain.CPU;
import mk.finki.gameinfopedia.repository.CPURepository;
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
 * REST controller for managing {@link mk.finki.gameinfopedia.domain.CPU}.
 */
@RestController
@RequestMapping("/api")
public class CPUResource {

    private final Logger log = LoggerFactory.getLogger(CPUResource.class);

    private static final String ENTITY_NAME = "cPU";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CPURepository cPURepository;

    public CPUResource(CPURepository cPURepository) {
        this.cPURepository = cPURepository;
    }

    /**
     * {@code POST  /cpus} : Create a new cPU.
     *
     * @param cPU the cPU to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cPU, or with status {@code 400 (Bad Request)} if the cPU has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cpus")
    public ResponseEntity<CPU> createCPU(@RequestBody CPU cPU) throws URISyntaxException {
        log.debug("REST request to save CPU : {}", cPU);
        if (cPU.getId() != null) {
            throw new BadRequestAlertException("A new cPU cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CPU result = cPURepository.save(cPU);
        return ResponseEntity.created(new URI("/api/cpus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cpus} : Updates an existing cPU.
     *
     * @param cPU the cPU to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cPU,
     * or with status {@code 400 (Bad Request)} if the cPU is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cPU couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cpus")
    public ResponseEntity<CPU> updateCPU(@RequestBody CPU cPU) throws URISyntaxException {
        log.debug("REST request to update CPU : {}", cPU);
        if (cPU.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CPU result = cPURepository.save(cPU);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, cPU.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /cpus} : get all the cPUS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cPUS in body.
     */
    @GetMapping("/cpus")
    public List<CPU> getAllCPUS() {
        log.debug("REST request to get all CPUS");
        return cPURepository.findAll();
    }

    /**
     * {@code GET  /cpus/:id} : get the "id" cPU.
     *
     * @param id the id of the cPU to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cPU, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cpus/{id}")
    public ResponseEntity<CPU> getCPU(@PathVariable Long id) {
        log.debug("REST request to get CPU : {}", id);
        Optional<CPU> cPU = cPURepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cPU);
    }

    /**
     * {@code DELETE  /cpus/:id} : delete the "id" cPU.
     *
     * @param id the id of the cPU to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cpus/{id}")
    public ResponseEntity<Void> deleteCPU(@PathVariable Long id) {
        log.debug("REST request to delete CPU : {}", id);
        cPURepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
