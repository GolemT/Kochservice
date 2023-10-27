import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Navbar.module.css'

const Searchbar = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim() !== '') {
      router.push(`/search?input=${searchValue}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <input
      type="text"
      className={styles.search}
      placeholder="Search..."
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyPress={handleKeyPress}
    />
  );
};

export default Searchbar;
