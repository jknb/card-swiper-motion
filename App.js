import { useRef, useState } from "react";
import "./App.css";
import Card from "./components/Card";
import Layout from "./components/Layout";

const CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function App() {
  const ref = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState(
    CARDS.map((n) => ({
      isVisible: true,
      id: n,
    }))
  );

  const swipeCard = (direction) => {
    setCards((prevCards) =>
      prevCards.map((c, i) =>
        i === currentIndex ? { ...c, isVisible: false, direction } : c
      )
    );
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <Layout>
      <div ref={ref} className="cards-layout">
        {cards.map((c, i) => (
          <Card
            key={c.id}
            id={c.id}
            footer={c.id}
            position={cards.length - i + currentIndex}
            direction={c.direction}
            isActive={currentIndex === i}
            isVisible={c.isVisible && Math.abs(i - currentIndex) < 3}
            swipeCard={swipeCard}
            ref={ref}
          />
        ))}
        <div className="buttons-layout">
          <button className="swipe-button" onClick={() => swipeCard(-1)}>
            Nope
          </button>
          <button className="swipe-button" onClick={() => swipeCard(1)}>
            Like
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default App;
