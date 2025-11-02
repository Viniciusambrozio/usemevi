"use client";
import { Star, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface RatingBadgesProps {
  rating: number;
  likes: number;
  productId: string;
}

export function RatingBadges({ rating, likes, productId }: RatingBadgesProps) {
  const [ratingClicked, setRatingClicked] = useState(false);
  const [likesClicked, setLikesClicked] = useState(false);
  const [localRating, setLocalRating] = useState(rating);
  const [localLikes, setLocalLikes] = useState(likes);

  const handleRatingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setRatingClicked(true);
    setTimeout(() => setRatingClicked(false), 600);
    
    // Vibração tátil se disponível
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleLikesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLikesClicked(true);
    setTimeout(() => setLikesClicked(false), 600);
    
    // Incrementa o número de likes localmente
    setLocalLikes(prev => prev + 1);
    
    // Vibração tátil se disponível
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  if (rating === 0 && likes === 0) return null;

  return (
    <div className="flex gap-2 mt-2">
      {rating > 0 && (
        <button
          onClick={handleRatingClick}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold
            transition-all duration-300 cursor-pointer
            ${ratingClicked 
              ? 'scale-110 shadow-lg' 
              : 'hover:scale-105 hover:shadow-md'
            }
          `}
          style={{ 
            backgroundColor: '#ffe472',
            color: '#333'
          }}
          aria-label={`Avaliação: ${localRating} estrelas`}
        >
          <Star 
            className={`h-4 w-4 transition-all duration-300 ${
              ratingClicked ? 'rotate-180 scale-125' : ''
            }`}
            style={{ color: '#fc0055' }}
            fill="#fc0055"
          />
          <span className={`transition-all duration-300 ${
            ratingClicked ? 'scale-110' : ''
          }`}>
            {localRating.toFixed(1)}
          </span>
        </button>
      )}

      {likes > 0 && (
        <button
          onClick={handleLikesClick}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold
            transition-all duration-300 cursor-pointer relative overflow-hidden
            ${likesClicked 
              ? 'scale-110 shadow-lg' 
              : 'hover:scale-105 hover:shadow-md'
            }
          `}
          style={{ 
            backgroundColor: '#ffe472',
            color: '#333'
          }}
          aria-label={`${localLikes} curtidas`}
        >
          {/* Efeito de partícula ao clicar */}
          {likesClicked && (
            <>
              <span className="absolute inset-0 animate-ping" style={{ backgroundColor: '#fc0055', opacity: 0.4 }} />
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full animate-bounce text-xs" style={{ color: '#fc0055' }}>
                +1
              </span>
            </>
          )}
          
          <ThumbsUp 
            className={`h-4 w-4 transition-all duration-300 ${
              likesClicked ? 'scale-125 -rotate-12' : ''
            }`}
            style={{ color: '#fc0055' }}
            fill={likesClicked ? '#fc0055' : 'none'}
          />
          <span className={`transition-all duration-300 ${
            likesClicked ? 'scale-110' : ''
          }`}>
            {localLikes}
          </span>
        </button>
      )}
    </div>
  );
}

