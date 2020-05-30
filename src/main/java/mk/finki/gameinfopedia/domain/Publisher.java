package mk.finki.gameinfopedia.domain;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Publisher.
 */
@Entity
@Table(name = "publisher")
public class Publisher implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "country")
    private String country;

    @Lob
    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "publisher")
    private Set<VideoGame> games = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Publisher name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountry() {
        return country;
    }

    public Publisher country(String country) {
        this.country = country;
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getDescription() {
        return description;
    }

    public Publisher description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<VideoGame> getGames() {
        return games;
    }

    public Publisher games(Set<VideoGame> videoGames) {
        this.games = videoGames;
        return this;
    }

    public Publisher addGames(VideoGame videoGame) {
        this.games.add(videoGame);
        videoGame.setPublisher(this);
        return this;
    }

    public Publisher removeGames(VideoGame videoGame) {
        this.games.remove(videoGame);
        videoGame.setPublisher(null);
        return this;
    }

    public void setGames(Set<VideoGame> videoGames) {
        this.games = videoGames;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Publisher)) {
            return false;
        }
        return id != null && id.equals(((Publisher) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Publisher{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", country='" + getCountry() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
