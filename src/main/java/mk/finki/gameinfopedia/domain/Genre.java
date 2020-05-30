package mk.finki.gameinfopedia.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Genre.
 */
@Entity
@Table(name = "genre")
public class Genre implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "genres")
    @JsonIgnore
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

    public Genre name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<VideoGame> getGames() {
        return games;
    }

    public Genre games(Set<VideoGame> videoGames) {
        this.games = videoGames;
        return this;
    }

    public Genre addGames(VideoGame videoGame) {
        this.games.add(videoGame);
        videoGame.getGenres().add(this);
        return this;
    }

    public Genre removeGames(VideoGame videoGame) {
        this.games.remove(videoGame);
        videoGame.getGenres().remove(this);
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
        if (!(o instanceof Genre)) {
            return false;
        }
        return id != null && id.equals(((Genre) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Genre{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
