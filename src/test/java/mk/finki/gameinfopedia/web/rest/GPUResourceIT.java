package mk.finki.gameinfopedia.web.rest;

import mk.finki.gameinfopedia.GameInfopediaApp;
import mk.finki.gameinfopedia.domain.GPU;
import mk.finki.gameinfopedia.repository.GPURepository;
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
 * Integration tests for the {@Link GPUResource} REST controller.
 */
@SpringBootTest(classes = GameInfopediaApp.class)
public class GPUResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private GPURepository gPURepository;

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

    private MockMvc restGPUMockMvc;

    private GPU gPU;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GPUResource gPUResource = new GPUResource(gPURepository);
        this.restGPUMockMvc = MockMvcBuilders.standaloneSetup(gPUResource)
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
    public static GPU createEntity(EntityManager em) {
        GPU gPU = new GPU()
            .name(DEFAULT_NAME);
        return gPU;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GPU createUpdatedEntity(EntityManager em) {
        GPU gPU = new GPU()
            .name(UPDATED_NAME);
        return gPU;
    }

    @BeforeEach
    public void initTest() {
        gPU = createEntity(em);
    }

    @Test
    @Transactional
    public void createGPU() throws Exception {
        int databaseSizeBeforeCreate = gPURepository.findAll().size();

        // Create the GPU
        restGPUMockMvc.perform(post("/api/gpus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gPU)))
            .andExpect(status().isCreated());

        // Validate the GPU in the database
        List<GPU> gPUList = gPURepository.findAll();
        assertThat(gPUList).hasSize(databaseSizeBeforeCreate + 1);
        GPU testGPU = gPUList.get(gPUList.size() - 1);
        assertThat(testGPU.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createGPUWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = gPURepository.findAll().size();

        // Create the GPU with an existing ID
        gPU.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGPUMockMvc.perform(post("/api/gpus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gPU)))
            .andExpect(status().isBadRequest());

        // Validate the GPU in the database
        List<GPU> gPUList = gPURepository.findAll();
        assertThat(gPUList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllGPUS() throws Exception {
        // Initialize the database
        gPURepository.saveAndFlush(gPU);

        // Get all the gPUList
        restGPUMockMvc.perform(get("/api/gpus?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gPU.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getGPU() throws Exception {
        // Initialize the database
        gPURepository.saveAndFlush(gPU);

        // Get the gPU
        restGPUMockMvc.perform(get("/api/gpus/{id}", gPU.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(gPU.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGPU() throws Exception {
        // Get the gPU
        restGPUMockMvc.perform(get("/api/gpus/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGPU() throws Exception {
        // Initialize the database
        gPURepository.saveAndFlush(gPU);

        int databaseSizeBeforeUpdate = gPURepository.findAll().size();

        // Update the gPU
        GPU updatedGPU = gPURepository.findById(gPU.getId()).get();
        // Disconnect from session so that the updates on updatedGPU are not directly saved in db
        em.detach(updatedGPU);
        updatedGPU
            .name(UPDATED_NAME);

        restGPUMockMvc.perform(put("/api/gpus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGPU)))
            .andExpect(status().isOk());

        // Validate the GPU in the database
        List<GPU> gPUList = gPURepository.findAll();
        assertThat(gPUList).hasSize(databaseSizeBeforeUpdate);
        GPU testGPU = gPUList.get(gPUList.size() - 1);
        assertThat(testGPU.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingGPU() throws Exception {
        int databaseSizeBeforeUpdate = gPURepository.findAll().size();

        // Create the GPU

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGPUMockMvc.perform(put("/api/gpus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gPU)))
            .andExpect(status().isBadRequest());

        // Validate the GPU in the database
        List<GPU> gPUList = gPURepository.findAll();
        assertThat(gPUList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteGPU() throws Exception {
        // Initialize the database
        gPURepository.saveAndFlush(gPU);

        int databaseSizeBeforeDelete = gPURepository.findAll().size();

        // Delete the gPU
        restGPUMockMvc.perform(delete("/api/gpus/{id}", gPU.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GPU> gPUList = gPURepository.findAll();
        assertThat(gPUList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GPU.class);
        GPU gPU1 = new GPU();
        gPU1.setId(1L);
        GPU gPU2 = new GPU();
        gPU2.setId(gPU1.getId());
        assertThat(gPU1).isEqualTo(gPU2);
        gPU2.setId(2L);
        assertThat(gPU1).isNotEqualTo(gPU2);
        gPU1.setId(null);
        assertThat(gPU1).isNotEqualTo(gPU2);
    }
}
