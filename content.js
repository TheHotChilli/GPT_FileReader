var delayTime = 1000;

function createButton() {
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const sendButton = document.querySelector('.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3.dark\\:hover\\:bg-gray-900.dark\\:disabled\\:hover\\:bg-transparent.right-2.disabled\\:text-gray-400.enabled\\:bg-brand-purple.text-white.bottom-1\\.5.transition-colors.disabled\\:opacity-40');
  if (sendButton) {
    const fileButton = document.createElement('button');
    fileButton.id = 'fileButton';
    fileButton.classList.add('file-button');
    fileButton.innerText = 'Select File';

    fileButton.style.position = 'absolute';
    fileButton.style.left = `${sendButton.offsetLeft + 64}px`; // Position 6 pixels to the left
    fileButton.style.top = `${sendButton.offsetTop - 12}px`;
    fileButton.style.whiteSpace = 'nowrap'; //no linebreaks
    fileButton.style.height = '54'; // Adjust the height value as needed
    fileButton.style.padding = '16px 16px';
    fileButton.style.backgroundColor = 'green';
    fileButton.style.border = 'none';
    fileButton.style.color = 'white';
    fileButton.style.fontWeight = 'bold';
    fileButton.style.borderRadius = '4px'; 

    // SVG Button
    // const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    // svg.setAttribute('width', '16');
    // svg.setAttribute('height', '16');
    // svg.setAttribute('viewBox', '0 0 24 24');
    // svg.style.display = 'flex';
    // svg.style.alignItems = 'center';
    // svg.style.justifyContent = 'center';
    // const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // path.setAttribute('fill', 'white');
    // path.setAttribute('d', 'M19 2H9c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 14h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V6h8v2z');
    // svg.appendChild(path);
    // fileButton.appendChild(svg);

    fileButton.addEventListener('click', handleFileSelect);

    buttonContainer.appendChild(fileButton);
    sendButton.parentNode.insertBefore(buttonContainer, sendButton.nextSibling);
  } else {
    console.log('[GPT-File-Reader] Send button not found');
  }
}

// function handleFileSelect(event) {
//   const input = document.createElement('input');
//   input.type = 'file';

//   input.onchange = (e) => {
//     const file = e.target.files[0];
//     // Handle the selected file
//     // You can call a function here to process the file
//   };

//   input.click();
// }
async function handleFileSelect(event) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt, .js, .py, .html, .css, .json, .csv';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const filename = file.name;
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target.result;
        const chunks = splitIntoChunks(content, 15000);
        let part = 1;

        for (const chunk of chunks) {
          const display = `${part}/${chunks.length}`;
          replaceButtonContent(display);
          await submitConversation(chunk, part, filename);
          part++;
        }

        replaceButtonContent('Select File');
      };

      reader.readAsText(file);
    }
  };

  input.click();
}

function splitIntoChunks(content, chunkSize) {
  const chunks = [];
  let i = 0;
  while (i < content.length) {
    chunks.push(content.slice(i, i + chunkSize));
    i += chunkSize;
  }
  return chunks;
}

async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");  //locate the text field

  const sendButton = document.querySelector('.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3.dark\\:hover\\:bg-gray-900.dark\\:disabled\\:hover\\:bg-transparent.right-2.disabled\\:text-gray-400.enabled\\:bg-brand-purple.text-white.bottom-1\\.5.transition-colors.disabled\\:opacity-40');

  const message = `I'm providing a file split into multiple parts. WAIT for all parts before continuing. If you successfully recieved this part confirm by answering "Successfully recieved part ${part}", else answer with "Error while recieving part ${part}". This is part ${part} of ${filename}:\n\n"""${text}""".`;

  textarea.focus(); // Focus on the textarea
  textarea.value = message;
  textarea.setSelectionRange(message.length, message.length);

  textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));   //trigger input event 

  sendButton.click(); // Click the send button
  
  await sleep(4000); // Wait for message to be sent
}

// function replaceButtonContent(content) {
//   const button = document.getElementById('fileButton');
//   button.innerHTML = content;
// }
function replaceButtonContent(content) {
  const button = document.getElementById('fileButton');

  // Remove existing content
  while (button.firstChild) {
    button.firstChild.remove();
  }

  // Create and append text node
  const textNode = document.createTextNode(content);
  button.appendChild(textNode);
}


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


// Function to handle navigation events (innerpage naviagation)
function handleNavigation() {
  // Remove the existing button if present
  removeButton();

  // Call createButton to inject the button into the new chat window
  createButton();
}

// Function to remove the button
function removeButton() {
  const buttonContainer = document.querySelector('.button-container');
  if (buttonContainer) {
    buttonContainer.remove();
  }
}

// // Function to handle the click event on the chat button
// function handleChatButtonClick() {
//   setTimeout(() => {
//     createButton();
//   }, 1000);
// }


console.log("[GPT-File-Reader] Starting Script");
// Call createButton when the content script is injected for the first time
setTimeout(createButton, delayTime);
// Listen for navigation events
window.addEventListener('popstate', handleNavigation);
window.addEventListener('pushstate', handleNavigation);
window.addEventListener('replacestate', handleNavigation);


// Listen for the click event on the chat buttons
document.addEventListener('click', function(event) {
  const newChatClickEvent = event.target.closest('.flex.p-3.items-center.gap-3.transition-colors.duration-200.text-white.cursor-pointer.text-sm.rounded-md.border.border-white/20.hover:bg-gray-500/10.h-11.flex-shrink-0.flex-grow');
  const oldChatClickEvent= event.target.closest('.flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto.-mr-2');

  console.log('[GPT-File-Reader]New Chat Button:', newChatButton);
  console.log('[GPT-File-Reader]Old Chat Button:', oldChatButton);

  // if (newChatButton || oldChatButton) {
  //   console.log("[GPT-File-Reader] Click event logged");
  //   handleNavigation();
  // }
  if (newChatButton || oldChatButton) {
    setTimeout(createButton, 100);
  }
});

// Define the coordinates of the desired display area
var areaLeft = 0;
var areaTop = 0;
var areaWidth = 250;
var areaHeight = 800;

// Function to check if the mouse click is within the desired area
function isClickWithinArea(event) {
  var mouseX = event.clientX;
  var mouseY = event.clientY;
  
  if (mouseX >= areaLeft && mouseX <= areaLeft + areaWidth && mouseY >= areaTop && mouseY <= areaTop + areaHeight) {
    return true;
  }
  
  return false;
}

// Function to be executed when the mouse clicks within the area
function handleClick() {
  setTimeout(createButton, delayTime);
}

// Event listener for the click event on the document
document.addEventListener("click", function(event) {
  if (isClickWithinArea(event)) {
    handleClick();
  }
});





