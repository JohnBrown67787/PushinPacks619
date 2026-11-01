'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Badge, Button, Tooltip } from './ui';
import { IconShoppingCart, IconHeart, IconArrowRight } from './Icons';
import { formatPrice } from '../lib/utils';
import styles from './ProductCard.module.css';

/**
 * Reusable product card component
 * Demonstrates UI component integration
 */
export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  badge,
  rating,
  inStock = true,
  isFavorite = false,
  onAddToCart = () => {},
  onToggleFavorite = () => {},
  onNavigate = () => {},
}) {
  const [isHovering, setIsHovering] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart({
      id,
      name,
      price,
      image,
      category,
    });
  };

  return (
    <Card
      variant="elevated"
      hoverable
      className={styles.productCard}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Container */}
      <div className={styles.imageContainer}>
        <Link href={`/${category}/products/${id}`}>
          <Image
            src={image}
            alt={name}
            fill
            className={styles.productImage}
            quality={75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          />
        </Link>

        {/* Badge */}
        {badge && (
          <Badge variant="success" className={styles.badge}>
            {badge}
          </Badge>
        )}

        {/* Stock Status */}
        {!inStock && (
          <div className={styles.outOfStock}>
            Out of Stock
          </div>
        )}

        {/* Favorite Button */}
        <Tooltip content={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <button
            className={styles.favoriteButton}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(id);
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <IconHeart
              size={18}
              color={isFavorite ? '#ef4444' : 'white'}
              fill={isFavorite ? '#ef4444' : 'none'}
            />
          </button>
        </Tooltip>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Category */}
        <Badge
          variant="info"
          size="sm"
          className={styles.categoryBadge}
        >
          {category}
        </Badge>

        {/* Title */}
        <h3 className={styles.title}>
          <Link href={`/${category}/products/${id}`}>
            {name}
          </Link>
        </h3>

        {/* Rating (if provided) */}
        {rating && (
          <div className={styles.rating}>
            <span className={styles.stars}>
              {'⭐'.repeat(Math.round(rating))}
            </span>
            <span className={styles.ratingText}>
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price */}
        <div className={styles.priceSection}>
          <span className={styles.price}>
            {formatPrice(price)}
          </span>
        </div>

        {/* Hover Actions */}
        {isHovering && (
          <div className={styles.actions}>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              disabled={!inStock}
              className={styles.addButton}
            >
              <IconShoppingCart size={14} />
              Add
            </Button>
            <Link href={`/${category}/products/${id}`} className={styles.viewButton}>
              <Button
                variant="secondary"
                size="sm"
                className={styles.viewButtonInner}
              >
                <IconArrowRight size={14} />
                View
              </Button>
            </Link>
          </div>
        )}

        {/* Static Button (visible on mobile) */}
        {!isHovering && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!inStock}
            className={styles.addButtonStatic}
          >
            <IconShoppingCart size={14} />
            Add to Cart
          </Button>
        )}
      </div>
    </Card>
  );
}
