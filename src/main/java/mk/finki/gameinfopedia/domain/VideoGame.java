package mk.finki.gameinfopedia.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * A VideoGame.
 */
@Entity
@Table(name = "video_game")
public class VideoGame implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "releasedate")
    private LocalDate releasedate;

    @Column(name = "price")
    private Double price;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "minimum_storage_required")
    private Integer minimumStorageRequired;

    @Column(name = "minimum_ram_required")
    private Integer minimumRAMRequired;

    @ManyToOne
    @JsonIgnoreProperties("games")
    private Publisher publisher;

    @ManyToOne
    @JsonIgnoreProperties("videoGames")
    private CPU minimumCPURequired;

    @ManyToOne
    @JsonIgnoreProperties("videoGames")
    private GPU minimumGPURequired;

    @ManyToMany
    @JoinTable(name = "video_game_platforms",
               joinColumns = @JoinColumn(name = "video_game_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "platforms_id", referencedColumnName = "id"))
    private Set<Platform> platforms = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "video_game_genres",
               joinColumns = @JoinColumn(name = "video_game_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "genres_id", referencedColumnName = "id"))
    private Set<Genre> genres = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public VideoGame title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getReleasedate() {
        return releasedate;
    }

    public VideoGame releasedate(LocalDate releasedate) {
        this.releasedate = releasedate;
        return this;
    }

    public void setReleasedate(LocalDate releasedate) {
        this.releasedate = releasedate;
    }

    public Double getPrice() {
        return price;
    }

    public VideoGame price(Double price) {
        this.price = price;
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public byte[] getImage() {
        return image;
    }

    public VideoGame image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public VideoGame imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getDescription() {
        return description;
    }

    public VideoGame description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public VideoGame averageRating(Double averageRating) {
        this.averageRating = averageRating;
        return this;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getMinimumStorageRequired() {
        return minimumStorageRequired;
    }

    public VideoGame minimumStorageRequired(Integer minimumStorageRequired) {
        this.minimumStorageRequired = minimumStorageRequired;
        return this;
    }

    public void setMinimumStorageRequired(Integer minimumStorageRequired) {
        this.minimumStorageRequired = minimumStorageRequired;
    }

    public Integer getMinimumRAMRequired() {
        return minimumRAMRequired;
    }

    public VideoGame minimumRAMRequired(Integer minimumRAMRequired) {
        this.minimumRAMRequired = minimumRAMRequired;
        return this;
    }

    public void setMinimumRAMRequired(Integer minimumRAMRequired) {
        this.minimumRAMRequired = minimumRAMRequired;
    }

    public Publisher getPublisher() {
        return publisher;
    }

    public VideoGame publisher(Publisher publisher) {
        this.publisher = publisher;
        return this;
    }

    public void setPublisher(Publisher publisher) {
        this.publisher = publisher;
    }

    public CPU getMinimumCPURequired() {
        return minimumCPURequired;
    }

    public VideoGame minimumCPURequired(CPU cPU) {
        this.minimumCPURequired = cPU;
        return this;
    }

    public void setMinimumCPURequired(CPU cPU) {
        this.minimumCPURequired = cPU;
    }

    public GPU getMinimumGPURequired() {
        return minimumGPURequired;
    }

    public VideoGame minimumGPURequired(GPU gPU) {
        this.minimumGPURequired = gPU;
        return this;
    }

    public void setMinimumGPURequired(GPU gPU) {
        this.minimumGPURequired = gPU;
    }

    public Set<Platform> getPlatforms() {
        return platforms;
    }

    public VideoGame platforms(Set<Platform> platforms) {
        this.platforms = platforms;
        return this;
    }

    public VideoGame addPlatforms(Platform platform) {
        this.platforms.add(platform);
        platform.getGames().add(this);
        return this;
    }

    public VideoGame removePlatforms(Platform platform) {
        this.platforms.remove(platform);
        platform.getGames().remove(this);
        return this;
    }

    public void setPlatforms(Set<Platform> platforms) {
        this.platforms = platforms;
    }

    public Set<Genre> getGenres() {
        return genres;
    }

    public VideoGame genres(Set<Genre> genres) {
        this.genres = genres;
        return this;
    }

    public VideoGame addGenres(Genre genre) {
        this.genres.add(genre);
        genre.getGames().add(this);
        return this;
    }

    public VideoGame removeGenres(Genre genre) {
        this.genres.remove(genre);
        genre.getGames().remove(this);
        return this;
    }

    public void setGenres(Set<Genre> genres) {
        this.genres = genres;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VideoGame)) {
            return false;
        }
        return id != null && id.equals(((VideoGame) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "VideoGame{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", releasedate='" + getReleasedate() + "'" +
            ", price=" + getPrice() +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", description='" + getDescription() + "'" +
            ", averageRating=" + getAverageRating() +
            ", minimumStorageRequired=" + getMinimumStorageRequired() +
            ", minimumRAMRequired=" + getMinimumRAMRequired() +
            "}";
    }
}
