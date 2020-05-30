package mk.finki.gameinfopedia.web.rest;

import mk.finki.gameinfopedia.GameInfopediaApp;
import mk.finki.gameinfopedia.domain.CPU;
import mk.finki.gameinfopedia.repository.CPURepository;
import mk.finki.gameinfopedia.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static mk.finki.gameinfopedia.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link CPUResource} REST controller.
 */
@SpringBootTest(classes = GameInfopediaApp.class)
public class CPUResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CPURepository cPURepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restCPUMockMvc;

    private CPU cPU;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CPUResource cPUResource = new CPUResource(cPURepository);
        this.restCPUMockMvc = MockMvcBuilders.standaloneSetup(cPUResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CPU createEntity(EntityManager em) {
        CPU cPU = new CPU()
            .name(DEFAULT_NAME);
        return cPU;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CPU createUpdatedEntity(EntityManager em) {
        CPU cPU = new CPU()
            .name(UPDATED_NAME);
        return cPU;
    }

    @BeforeEach
    public void initTest() {
        cPU = createEntity(em);
    }

    @Test
    @Transactional
    public void createCPU() throws Exception {
        int databaseSizeBeforeCreate = cPURepository.findAll().size();

        // Create the CPU
        restCPUMockMvc.perform(post("/api/cpus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cPU)))
            .andExpect(status().isCreated());

        // Validate the CPU in the database
        List<CPU> cPUList = cPURepository.findAll();
        assertThat(cPUList).hasSize(databaseSizeBeforeCreate + 1);
        CPU testCPU = cPUList.get(cPUList.size() - 1);
        assertThat(testCPU.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createCPUWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cPURepository.findAll().size();

        // Create the CPU with an existing ID
        cPU.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCPUMockMvc.perform(post("/api/cpus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cPU)))
            .andExpect(status().isBadRequest());

        // Validate the CPU in the database
        List<CPU> cPUList = cPURepository.findAll();
        assertThat(cPUList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCPUS() throws Exception {
        // Initialize the database
        cPURepository.saveAndFlush(cPU);

        // Get all the cPUList
        restCPUMockMvc.perform(get("/api/cpus?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cPU.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getCPU() throws Exception {
        // Initialize the database
        cPURepository.saveAndFlush(cPU);

        // Get the cPU
        restCPUMockMvc.perform(get("/api/cpus/{id}", cPU.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cPU.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCPU() throws Exception {
        // Get the cPU
        restCPUMockMvc.perform(get("/api/cpus/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCPU() throws Exception {
        // Initialize the database
        cPURepository.saveAndFlush(cPU);

        int databaseSizeBeforeUpdate = cPURepository.findAll().size();

        // Update the cPU
        CPU updatedCPU = cPURepository.findById(cPU.getId()).get();
        // Disconnect from session so that the updates on updatedCPU are not directly saved in db
        em.detach(updatedCPU);
        updatedCPU
            .name(UPDATED_NAME);

        restCPUMockMvc.perform(put("/api/cpus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCPU)))
            .andExpect(status().isOk());

        // Validate the CPU in the database
        List<CPU> cPUList = cPURepository.findAll();
        assertThat(cPUList).hasSize(databaseSizeBeforeUpdate);
        CPU testCPU = cPUList.get(cPUList.size() - 1);
        assertThat(testCPU.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingCPU() throws Exception {
        int databaseSizeBeforeUpdate = cPURepository.findAll().size();

        // Create the CPU

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCPUMockMvc.perform(put("/api/cpus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cPU)))
            .andExpect(status().isBadRequest());

        // Validate the CPU in the database
        List<CPU> cPUList = cPURepository.findAll();
        assertThat(cPUList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCPU() throws Exception {
        // Initialize the database
        cPURepository.saveAndFlush(cPU);

        int databaseSizeBeforeDelete = cPURepository.findAll().size();

        // Delete the cPU
        restCPUMockMvc.perform(delete("/api/cpus/{id}", cPU.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CPU> cPUList = cPURepository.findAll();
        assertThat(cPUList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CPU.class);
        CPU cPU1 = new CPU();
        cPU1.setId(1L);
        CPU cPU2 = new CPU();
        cPU2.setId(cPU1.getId());
        assertThat(cPU1).isEqualTo(cPU2);
        cPU2.setId(2L);
        assertThat(cPU1).isNotEqualTo(cPU2);
        cPU1.setId(null);
        assertThat(cPU1).isNotEqualTo(cPU2);
    }
}
