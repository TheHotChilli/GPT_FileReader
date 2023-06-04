// Function to handle file selection
function handleFileSelect(event) {
    const input = document.createElement('input');
    input.type = 'file';
  
    input.onchange = (e) => {
      const file = e.target.files[0];
      // Handle the selected file
      // You can call a function here to process the file
      console.log('Selected file:', file);
    };
  
    input.click();
  }
  
  // Attach event listener to the file button
  document.getElementById('fileButton').addEventListener('click', handleFileSelect);
  