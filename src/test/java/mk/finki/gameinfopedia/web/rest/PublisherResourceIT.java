package mk.finki.gameinfopedia.web.rest;

import mk.finki.gameinfopedia.GameInfopediaApp;
import mk.finki.gameinfopedia.domain.Publisher;
import mk.finki.gameinfopedia.repository.PublisherRepository;
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
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static mk.finki.gameinfopedia.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link PublisherResource} REST controller.
 */
@SpringBootTest(classes = GameInfopediaApp.class)
public class PublisherResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COUNTRY = "AAAAAAAAAA";
    private static final String UPDATED_COUNTRY = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private PublisherRepository publisherRepository;

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

    private MockMvc restPublisherMockMvc;

    private Publisher publisher;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PublisherResource publisherResource = new PublisherResource(publisherRepository);
        this.restPublisherMockMvc = MockMvcBuilders.standaloneSetup(publisherResource)
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
    public static Publisher createEntity(EntityManager em) {
        Publisher publisher = new Publisher()
            .name(DEFAULT_NAME)
            .country(DEFAULT_COUNTRY)
            .description(DEFAULT_DESCRIPTION);
        return publisher;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Publisher createUpdatedEntity(EntityManager em) {
        Publisher publisher = new Publisher()
            .name(UPDATED_NAME)
            .country(UPDATED_COUNTRY)
            .description(UPDATED_DESCRIPTION);
        return publisher;
    }

    @BeforeEach
    public void initTest() {
        publisher = createEntity(em);
    }

    @Test
    @Transactional
    public void createPublisher() throws Exception {
        int databaseSizeBeforeCreate = publisherRepository.findAll().size();

        // Create the Publisher
        restPublisherMockMvc.perform(post("/api/publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(publisher)))
            .andExpect(status().isCreated());

        // Validate the Publisher in the database
        List<Publisher> publisherList = publisherRepository.findAll();
        assertThat(publisherList).hasSize(databaseSizeBeforeCreate + 1);
        Publisher testPublisher = publisherList.get(publisherList.size() - 1);
        assertThat(testPublisher.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPublisher.getCountry()).isEqualTo(DEFAULT_COUNTRY);
        assertThat(testPublisher.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createPublisherWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = publisherRepository.findAll().size();

        // Create the Publisher with an existing ID
        publisher.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPublisherMockMvc.perform(post("/api/publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(publisher)))
            .andExpect(status().isBadRequest());

        // Validate the Publisher in the database
        List<Publisher> publisherList = publisherRepository.findAll();
        assertThat(publisherList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllPublishers() throws Exception {
        // Initialize the database
        publisherRepository.saveAndFlush(publisher);

        // Get all the publisherList
        restPublisherMockMvc.perform(get("/api/publishers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(publisher.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getPublisher() throws Exception {
        // Initialize the database
        publisherRepository.saveAndFlush(publisher);

        // Get the publisher
        restPublisherMockMvc.perform(get("/api/publishers/{id}", publisher.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(publisher.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPublisher() throws Exception {
        // Get the publisher
        restPublisherMockMvc.perform(get("/api/publishers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePublisher() throws Exception {
        // Initialize the database
        publisherRepository.saveAndFlush(publisher);

        int databaseSizeBeforeUpdate = publisherRepository.findAll().size();

        // Update the publisher
        Publisher updatedPublisher = publisherRepository.findById(publisher.getId()).get();
        // Disconnect from session so that the updates on updatedPublisher are not directly saved in db
        em.detach(updatedPublisher);
        updatedPublisher
            .name(UPDATED_NAME)
            .country(UPDATED_COUNTRY)
            .description(UPDATED_DESCRIPTION);

        restPublisherMockMvc.perform(put("/api/publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPublisher)))
            .andExpect(status().isOk());

        // Validate the Publisher in the database
        List<Publisher> publisherList = publisherRepository.findAll();
        assertThat(publisherList).hasSize(databaseSizeBeforeUpdate);
        Publisher testPublisher = publisherList.get(publisherList.size() - 1);
        assertThat(testPublisher.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPublisher.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testPublisher.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingPublisher() throws Exception {
        int databaseSizeBeforeUpdate = publisherRepository.findAll().size();

        // Create the Publisher

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPublisherMockMvc.perform(put("/api/publishers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(publisher)))
            .andExpect(status().isBadRequest());

        // Validate the Publisher in the database
        List<Publisher> publisherList = publisherRepository.findAll();
        assertThat(publisherList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePublisher() throws Exception {
        // Initialize the database
        publisherRepository.saveAndFlush(publisher);

        int databaseSizeBeforeDelete = publisherRepository.findAll().size();

        // Delete the publisher
        restPublisherMockMvc.perform(delete("/api/publishers/{id}", publisher.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Publisher> publisherList = publisherRepository.findAll();
        assertThat(publisherList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Publisher.class);
        Publisher publisher1 = new Publisher();
        publisher1.setId(1L);
        Publisher publisher2 = new Publisher();
        publisher2.setId(publisher1.getId());
        assertThat(publisher1).isEqualTo(publisher2);
        publisher2.setId(2L);
        assertThat(publisher1).isNotEqualTo(publisher2);
        publisher1.setId(null);
        assertThat(publisher1).isNotEqualTo(publisher2);
    }
}
