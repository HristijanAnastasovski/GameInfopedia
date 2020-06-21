import React from 'react';
import { Card, Button, CardImg, CardTitle, CardText, CardSubtitle, CardBody } from 'reactstrap';
import './game.scss';
import { Link } from 'react-router-dom';

const Game = props => {
  const game = props.game;
  return (
    <Card>
      <CardImg
        className="game-image"
        top
        width="100%"
        src={`data:${game.imageContentType};base64, ${game.image}`}
        type={game.imageContentType}
        alt={`Game: ${game.id}`}
      />
      <CardBody>
        <CardTitle>{game.title}</CardTitle>
        <CardSubtitle>Rating: {game.averageRating}</CardSubtitle>
        <CardText>Release Date: {game.releasedate}</CardText>
        <Link to={`game/${game.id}`}>
          <Button className="button" color="primary">
            Read More
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
};

export default Game;
