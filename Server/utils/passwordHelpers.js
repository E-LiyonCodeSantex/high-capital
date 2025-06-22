

function comparePasswords(password, confirmPassword) {
    if (password === confirmPassword) {
      return 'Passwords match!';
    } else {
      return 'Passwords do not match. Please try again.';
    }
  }

  const isStrongPassword = (password) => {
    // Password strength criteria
    const minLength = 8;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    // Check if password meets criteria
    return password.length >= minLength && regex.test(password);
  };
  
  // Example usage
  const password = 'example123';
  const confirmPassword = 'example123';
  console.log(comparePasswords(password, confirmPassword)); // Output: Passwords match!


  module.exports = comparePasswords;
