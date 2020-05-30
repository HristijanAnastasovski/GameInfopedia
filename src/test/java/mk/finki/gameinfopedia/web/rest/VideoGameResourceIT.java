package mk.finki.gameinfopedia.web.rest;

import mk.finki.gameinfopedia.GameInfopediaApp;
import mk.finki.gameinfopedia.domain.VideoGame;
import mk.finki.gameinfopedia.repository.VideoGameRepository;
import mk.finki.gameinfopedia.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import static mk.finki.gameinfopedia.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link VideoGameResource} REST controller.
 */
@SpringBootTest(classes = GameInfopediaApp.class)
public class VideoGameResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_RELEASEDATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_RELEASEDATE = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_AVERAGE_RATING = 1D;
    private static final Double UPDATED_AVERAGE_RATING = 2D;

    private static final Integer DEFAULT_MINIMUM_STORAGE_REQUIRED = 1;
    private static final Integer UPDATED_MINIMUM_STORAGE_REQUIRED = 2;

    private static final Integer DEFAULT_MINIMUM_RAM_REQUIRED = 1;
    private static final Integer UPDATED_MINIMUM_RAM_REQUIRED = 2;

    @Autowired
    private VideoGameRepository videoGameRepository;

    @Mock
    private VideoGameRepository videoGameRepositoryMock;

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

    private MockMvc restVideoGameMockMvc;

    private VideoGame videoGame;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final VideoGameResource videoGameResource = new VideoGameResource(videoGameRepository);
        this.restVideoGameMockMvc = MockMvcBuilders.standaloneSetup(videoGameResource)
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
    public static VideoGame createEntity(EntityManager em) {
        VideoGame videoGame = new VideoGame()
            .title(DEFAULT_TITLE)
            .releasedate(DEFAULT_RELEASEDATE)
            .price(DEFAULT_PRICE)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .description(DEFAULT_DESCRIPTION)
            .averageRating(DEFAULT_AVERAGE_RATING)
            .minimumStorageRequired(DEFAULT_MINIMUM_STORAGE_REQUIRED)
            .minimumRAMRequired(DEFAULT_MINIMUM_RAM_REQUIRED);
        return videoGame;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VideoGame createUpdatedEntity(EntityManager em) {
        VideoGame videoGame = new VideoGame()
            .title(UPDATED_TITLE)
            .releasedate(UPDATED_RELEASEDATE)
            .price(UPDATED_PRICE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .averageRating(UPDATED_AVERAGE_RATING)
            .minimumStorageRequired(UPDATED_MINIMUM_STORAGE_REQUIRED)
            .minimumRAMRequired(UPDATED_MINIMUM_RAM_REQUIRED);
        return videoGame;
    }

    @BeforeEach
    public void initTest() {
        videoGame = createEntity(em);
    }

    @Test
    @Transactional
    public void createVideoGame() throws Exception {
        int databaseSizeBeforeCreate = videoGameRepository.findAll().size();

        // Create the VideoGame
        restVideoGameMockMvc.perform(post("/api/video-games")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(videoGame)))
            .andExpect(status().isCreated());

        // Validate the VideoGame in the database
        List<VideoGame> videoGameList = videoGameRepository.findAll();
        assertThat(videoGameList).hasSize(databaseSizeBeforeCreate + 1);
        VideoGame testVideoGame = videoGameList.get(videoGameList.size() - 1);
        assertThat(testVideoGame.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testVideoGame.getReleasedate()).isEqualTo(DEFAULT_RELEASEDATE);
        assertThat(testVideoGame.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testVideoGame.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testVideoGame.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testVideoGame.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVideoGame.getAverageRating()).isEqualTo(DEFAULT_AVERAGE_RATING);
        assertThat(testVideoGame.getMinimumStorageRequired()).isEqualTo(DEFAULT_MINIMUM_STORAGE_REQUIRED);
        assertThat(testVideoGame.getMinimumRAMRequired()).isEqualTo(DEFAULT_MINIMUM_RAM_REQUIRED);
    }

    @Test
    @Transactional
    public void createVideoGameWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = videoGameRepository.findAll().size();

        // Create the VideoGame with an existing ID
        videoGame.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVideoGameMockMvc.perform(post("/api/video-games")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(videoGame)))
            .andExpect(status().isBadRequest());

        // Validate the VideoGame in the database
        List<VideoGame> videoGameList = videoGameRepository.findAll();
        assertThat(videoGameList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllVideoGames() throws Exception {
        // Initialize the database
        videoGameRepository.saveAndFlush(videoGame);

        // Get all the videoGameList
        restVideoGameMockMvc.perform(get("/api/video-games?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(videoGame.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].releasedate").value(hasItem(DEFAULT_RELEASEDATE.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].averageRating").value(hasItem(DEFAULT_AVERAGE_RATING.doubleValue())))
            .andExpect(jsonPath("$.[*].minimumStorageRequired").value(hasItem(DEFAULT_MINIMUM_STORAGE_REQUIRED)))
            .andExpect(jsonPath("$.[*].minimumRAMRequired").value(hasItem(DEFAULT_MINIMUM_RAM_REQUIRED)));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllVideoGamesWithEagerRelationshipsIsEnabled() throws Exception {
        VideoGameResource videoGameResource = new VideoGameResource(videoGameRepositoryMock);
        when(videoGameRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restVideoGameMockMvc = MockMvcBuilders.standaloneSetup(videoGameResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restVideoGameMockMvc.perform(get("/api/video-games?eagerload=true"))
        .andExpect(status().isOk());

        verify(videoGameRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllVideoGamesWithEagerRelationshipsIsNotEnabled() throws Exception {
        VideoGameResource videoGameResource = new VideoGameResource(videoGameRepositoryMock);
            when(videoGameRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restVideoGameMockMvc = MockMvcBuilders.standaloneSetup(videoGameResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restVideoGameMockMvc.perform(get("/api/video-games?eagerload=true"))
        .andExpect(status().isOk());

            verify(videoGameRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getVideoGame() throws Exception {
        // Initialize the database
        videoGameRepository.saveAndFlush(videoGame);

        // Get the videoGame
        restVideoGameMockMvc.perform(get("/api/video-games/{id}", videoGame.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(videoGame.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.releasedate").value(DEFAULT_RELEASEDATE.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.averageRating").value(DEFAULT_AVERAGE_RATING.doubleValue()))
            .andExpect(jsonPath("$.minimumStorageRequired").value(DEFAULT_MINIMUM_STORAGE_REQUIRED))
            .andExpect(jsonPath("$.minimumRAMRequired").value(DEFAULT_MINIMUM_RAM_REQUIRED));
    }

    @Test
    @Transactional
    public void getNonExistingVideoGame() throws Exception {
        // Get the videoGame
        restVideoGameMockMvc.perform(get("/api/video-games/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateVideoGame() throws Exception {
        // Initialize the database
        videoGameRepository.saveAndFlush(videoGame);

        int databaseSizeBeforeUpdate = videoGameRepository.findAll().size();

        // Update the videoGame
        VideoGame updatedVideoGame = videoGameRepository.findById(videoGame.getId()).get();
        // Disconnect from session so that the updates on updatedVideoGame are not directly saved in db
        em.detach(updatedVideoGame);
        updatedVideoGame
            .title(UPDATED_TITLE)
            .releasedate(UPDATED_RELEASEDATE)
            .price(UPDATED_PRICE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .averageRating(UPDATED_AVERAGE_RATING)
            .minimumStorageRequired(UPDATED_MINIMUM_STORAGE_REQUIRED)
            .minimumRAMRequired(UPDATED_MINIMUM_RAM_REQUIRED);

        restVideoGameMockMvc.perform(put("/api/video-games")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedVideoGame)))
            .andExpect(status().isOk());

        // Validate the VideoGame in the database
        List<VideoGame> videoGameList = videoGameRepository.findAll();
        assertThat(videoGameList).hasSize(databaseSizeBeforeUpdate);
        VideoGame testVideoGame = videoGameList.get(videoGameList.size() - 1);
        assertThat(testVideoGame.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testVideoGame.getReleasedate()).isEqualTo(UPDATED_RELEASEDATE);
        assertThat(testVideoGame.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testVideoGame.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testVideoGame.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testVideoGame.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVideoGame.getAverageRating()).isEqualTo(UPDATED_AVERAGE_RATING);
        assertThat(testVideoGame.getMinimumStorageRequired()).isEqualTo(UPDATED_MINIMUM_STORAGE_REQUIRED);
        assertThat(testVideoGame.getMinimumRAMRequired()).isEqualTo(UPDATED_MINIMUM_RAM_REQUIRED);
    }

    @Test
    @Transactional
    public void updateNonExistingVideoGame() throws Exception {
        int databaseSizeBeforeUpdate = videoGameRepository.findAll().size();

        // Create the VideoGame

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVideoGameMockMvc.perform(put("/api/video-games")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(videoGame)))
            .andExpect(status().isBadRequest());

        // Validate the VideoGame in the database
        List<VideoGame> videoGameList = videoGameRepository.findAll();
        assertThat(videoGameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteVideoGame() throws Exception {
        // Initialize the database
        videoGameRepository.saveAndFlush(videoGame);

        int databaseSizeBeforeDelete = videoGameRepository.findAll().size();

        // Delete the videoGame
        restVideoGameMockMvc.perform(delete("/api/video-games/{id}", videoGame.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VideoGame> videoGameList = videoGameRepository.findAll();
        assertThat(videoGameList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VideoGame.class);
        VideoGame videoGame1 = new VideoGame();
        videoGame1.setId(1L);
        VideoGame videoGame2 = new VideoGame();
        videoGame2.setId(videoGame1.getId());
        assertThat(videoGame1).isEqualTo(videoGame2);
        videoGame2.setId(2L);
        assertThat(videoGame1).isNotEqualTo(videoGame2);
        videoGame1.setId(null);
        assertThat(videoGame1).isNotEqualTo(videoGame2);
    }
}
