import React, { useState, useEffect } from 'react';

// picks a random number from 1 to var count
// used by the random function
export function randomID() {
    return  (Math.floor(Math.random()* count +1))
}

// Defines how many recipes are available in the database
// Should be automatically updated
let count = 5

// function to automatically update the variable "count"
async function getCount() {
    const [data, setData] = useState(null);
  
        const response = await fetch('/api/getAmount')
    
        if (!response.ok) {
            throw new Error('Network response was not okay')
        }

        const answer = await response.json()
        count = data.count

        if (isNaN(count)) {
            throw new Error('Invalid count value: ' + count)
        }
  
    useEffect(() => {
      fetchData();
  
      // Schedule API call every hour
      const interval = setInterval(() => {
        fetchData();
      }, 3600000); // 3600000 milliseconds = 1 hour
  
      // Clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, []);
  
  }