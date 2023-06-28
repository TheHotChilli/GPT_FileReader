// Inspired by youtube channel Automate My Life. See https://www.youtube.com/watch?v=f87gW1uj_lc&t=260s

console.log("[GPT-File-Upload] Starting Script");

// Set the worker source for PDF.js library
// const libSrc = chrome.runtime.getURL("pdf.js");
const workerSrc = chrome.runtime.getURL("pdf.worker.js");
if (typeof window !== "undefined" && "pdfjsLib" in window) {
  window["pdfjsLib"].GlobalWorkerOptions.workerSrc = workerSrc;
}

// Load Mammoth.js library
const mammothScript = document.createElement("script");
const mammothSrc = (typeof chrome !== "undefined" && chrome.runtime.getURL) ? chrome.runtime.getURL("mammoth.browser.min.js") : browser.runtime.getURL("mammoth.browser.min.js");
mammothScript.src = mammothSrc;
document.head.appendChild(mammothScript);

// Load xlsx.min.js library
const xlsxScript = document.createElement("script");
const xlsxSrc = (typeof chrome !== "undefined" && chrome.runtime.getURL) ? chrome.runtime.getURL("xlsx.min.js") : browser.runtime.getURL("xlsx.min.js");
xlsxScript.src = xlsxSrc;
document.head.appendChild(xlsxScript);



// content.js

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

    fileButton.addEventListener('click', handleFileSelect);

    buttonContainer.appendChild(fileButton);
    sendButton.parentNode.insertBefore(buttonContainer, sendButton.nextSibling);
  } else {
    console.log('[GPT-File-Reader] Send button not found');
  }
}


async function handleFileSelect(event) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt, .js, .py, .html, .css, .json, .csv, .pdf, .docx';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const filename = file.name;

      // handle cases
      if (file.type === 'application/pdf') {
        text = await handlePDFFile(file);
      }  
      else if (
        file.type == "application/msword" ||
        file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        text = await handleWordFile(file);
      }
      else if (
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        text = await handleExcelFile(file);
      }
      else {
        text = await file.text();
      }

      // split into chunks
      const chunks = splitIntoChunks(text);

      // send to GPT
      let part = 1;
      for (const chunk of chunks) {
        const display = `Uploading ${part}/${chunks.length}`;
        replaceButtonContent(display);
        await submitConversation(chunk, part, filename);
        part++;
      }
      replaceButtonContent('Select File');
    }
  };


  input.click();
}

async function handlePDFFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      loadingTask.promise
        .then((pdfDoc) => {
          let textContent = "";
          const numPages = pdfDoc.numPages;
          console.log("[GPT-File-Reader] Number of pages:", numPages);
          const promises = [];

          for (let i = 1; i <= numPages; i++) {
            promises.push(
              pdfDoc.getPage(i).then((page) => {
                return page.getTextContent().then((content) => {
                  const pageTextContent = content.items
                    .map((item) => item.str)
                    .join(" ");
                  textContent += pageTextContent;
                });
              })
            );
          }

          Promise.all(promises)
            .then(() => {
              resolve(textContent);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    };
    reader.onerror = function (event) {
      reject(new Error("Failed reading the PDF file."));
    };
    reader.readAsArrayBuffer(file);
  });
}


// Function for Word to text conversion
async function handleWordFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      const options = { includeDefaultStyleMap: true }; 
      window.mammoth
        .extractRawText({ arrayBuffer }, options)
        .then((result) => {
          const text = result.value;
          resolve(text);
        })
        .catch((error) => {
          reject(error);
        });
    };
    reader.onerror = function (event) {
      reject(new Error("Failed reading the Word file."));
    };
    reader.readAsArrayBuffer(file);
  });
}

// Function for excel to text conversion
async function handleExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      const options = {
        type: "array",
        cellFormula: false,
        cellHTML: false,
        cellStyles: false,
      }; // Customize options as needed
      const workbook = XLSX.read(arrayBuffer, options);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const text = jsonData.flat().join(" ");
      resolve(text);
    };
    reader.onerror = function (event) {
      reject(new Error("Failed reading the Excel file."));
    };
    reader.readAsArrayBuffer(file);
  });
}


function splitIntoChunks(content, maxChunkLength = 15000) {
  const chunkLength = Math.min(maxChunkLength, content.length);
  const chunks = [];
  let i = 0;
  while (i < content.length) {
    chunks.push(content.slice(i, i + chunkLength));
    i += chunkLength;
  }
  return chunks;
}

async function submitConversation(text, part, filename) {

  //message to be sent
  const message = `I'm providing a file that is split into multiple parts. WAIT for all parts before continuing. If you successfully recieved this part confirm by answering "Successfully recieved part ${part}", else answer with "Error while recieving part ${part}". This is part ${part} of ${filename}:\n\n"""${text}""".`;

  //locate the text field
  const textarea = document.querySelector("textarea[tabindex='0']"); 
  textarea.focus(); // Focus on the textarea
  textarea.value = message; //set message as value
  // textarea.setSelectionRange(message.length, message.length);
  textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));   //trigger input event 

  //find the sendButton
  // const sendButton = document.querySelector('.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3.dark\\:hover\\:bg-gray-900.dark\\:disabled\\:hover\\:bg-transparent.right-2.disabled\\:text-gray-400.enabled\\:bg-brand-purple.text-white.bottom-1\\.5.transition-colors.disabled\\:opacity-40');
  const container = document.querySelector(
    ".flex.flex-col.w-full.flex-grow.md\\:py-4.md\\:pl-4"
  );
  const sendButton = container.querySelector("button");

  // Check if the button is disabled and enable it
    if (sendButton.disabled) {
      await sleep(500);
      sendButton.disabled = false;
    }

  // Click the send button
  sendButton.click(); 
  
  // Wait for message to be sent
  await sleep(4000); 
}

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

// Call createButton when the content script is injected for the first time
setTimeout(createButton, delayTime);

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