'use client';

import { useRouter } from 'next/navigation';

export default function SecondPage() {
  const router = useRouter();

  const handleImageClick = (index: number) => {
    if (index === 1) {
      router.push('/form');
    }
  };

  return (
    <div style={styles.gallery}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <img
          key={i}
          src={`/image${i}.jpg`}
          alt={`Image ${i}`}
          style={styles.image}
          onClick={() => handleImageClick(i)}
        />
      ))}
    </div>
  );
}

const styles = {
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    padding: '20px',
  },
  image: {
    width: '100%',
    cursor: 'pointer',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
  },
};
