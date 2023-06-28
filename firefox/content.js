console.log("[GPT-File-Reader] Starting Script");
const libSrc = browser.runtime.getURL("pdf.js");
const workerSrc = browser.runtime.getURL("pdf.worker.js");
console.log("GPT:", workerSrc);
// console.log("GPT:", libSrc);
// console.log("GPT:", window);
console.log("GPT:", Object.keys(window).length);

// const pdfScript = document.createElement("script");
// pdfScript.src = libSrc;


// pdfScript.addEventListener('load', () => {
//   console.log("GPT: After Loading", Object.keys(window).length);
//   // console.log(window.pdfjsLib)
//   // console.log(window["pdfjs-dist/build/pdf"])
//   // console.log(window)
// })

// document.head.appendChild(pdfScript);
console.log("GPT: After appending", Object.keys(window).length);
console.log("GPT-main:", window);

// console.log("GPT:", pdfjsLib)

// pdfScript.onload=function(){
//   console.log("GPT:", window.pdfjsLib);
//   console.log(window["pdfjs-dist/build/pdf"]);
//   // window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
//   console.log("GPT:", window);
// }
// document.head.appendChild(pdfScript);
// console.log("GPT:", window)

// import * as pdfjsLib from libSrc;


// Set the worker source for PDF.js library
// if (typeof window !== "undefined" && "pdfjsLib" in window) {
//   // Get the URL of the pdf.worker.min.js file
//   const workerSrc = (typeof chrome !== "undefined" && chrome.runtime.getURL) ? chrome.runtime.getURL("pdf.worker.min.js") : browser.runtime.getURL("pdf.worker.min.js");
//   window["pdfjsLib"].GlobalWorkerOptions.workerSrc = workerSrc;
// } else {
//   console.log("GPT: PDF Import failed")
// }


// let pdfjsLib;
// import(libSrc).then((module) => {
//   pdfjsLib = module;
//   pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
// });


// var pdfjsLib = document.createElement('script');
// pdfjsLib.src = libSrc;
// console.log("GPT:", pdfjsLib)
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;


// window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
// var pdfjsLib = window["pdfjsLib"];
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc



// var pdfjsLib = document.createElement('script');
// pdfjsLib.src = 'https://mozilla.github.io/pdf.js/build/pdf.js';
// pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
// console.log("GPT:", pdfjsLib)














// Hinzufügen des Scripts zum Window
// const pdfScript = document.createElement("script");
// pdfScript.src = libSrc;
// pdfScript.onload = function() {
//   if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
//     window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
//   } else {
//     console.error("Failed to load pdfjsLib or GlobalWorkerOptions is undefined");
//   }
// };
// document.head.appendChild(pdfScript);
// console.log("GPT:", window)
// console.log("GPT:", window.pdfjsLib.PDFWorker)


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
      console.log("GPT: In Function",pdfjsLib)
      console.log("GPT: In Function", window)
      console.log("GPT: In Function", window.pdfjsLib)
      console.log("GPT: In Function", Object.keys(window).length);
      // pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
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
      reject(new Error("Error occurred while reading the PDF file."));
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
      const options = { includeDefaultStyleMap: true }; // Customize options as needed
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
      reject(new Error("Error occurred while reading the Word file."));
    };
    reader.readAsArrayBuffer(file);
  });
}

// Define the extractTextFromExcelFile function
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
      reject(new Error("Error occurred while reading the Excel file."));
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
  const sendButton = document.querySelector('.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3.dark\\:hover\\:bg-gray-900.dark\\:disabled\\:hover\\:bg-transparent.right-2.disabled\\:text-gray-400.enabled\\:bg-brand-purple.text-white.bottom-1\\.5.transition-colors.disabled\\:opacity-40');
  
  // // Check if the button is disabled and enable it
  //   if (sendButton.disabled) {
  //     sendButton.disabled = false;
  //   }

  await sleep(500);

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

// // Function to handle the click event on the chat button
// function handleChatButtonClick() {
//   setTimeout(() => {
//     createButton();
//   }, 1000);
// }

// Call createButton when the content script is injected for the first time
setTimeout(createButton, delayTime);

// // Listen for navigation events
// window.addEventListener('popstate', handleNavigation);
// window.addEventListener('pushstate', handleNavigation);
// window.addEventListener('replacestate', handleNavigation);
// // Listen for the click event on the chat buttons
// document.addEventListener('click', function(event) {
//   const newChatClickEvent = event.target.closest('.flex.p-3.items-center.gap-3.transition-colors.duration-200.text-white.cursor-pointer.text-sm.rounded-md.border.border-white/20.hover:bg-gray-500/10.h-11.flex-shrink-0.flex-grow');
//   const oldChatClickEvent= event.target.closest('.flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto.-mr-2');
//   console.log('[GPT-File-Reader]New Chat Button:', newChatButton);
//   console.log('[GPT-File-Reader]Old Chat Button:', oldChatButton);
//   if (newChatButton || oldChatButton) {
//     setTimeout(createButton, 100);
//   }
// });

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