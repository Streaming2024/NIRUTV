// Helper function to get query parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Get the JSON file name from the URL parameter and append `.json` if needed
const fileParam = getQueryParam('yonotv');
const jsonFile = fileParam ? `${fileParam}.json` : 'default.json'; // Default to 'default.json' if no parameter provided

// Fetch the JSON file and render content
fetch(jsonFile)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('live-container');
    
    // Create and insert the match info table
    const matchTable = createMatchTable(data.matchInfo);
    container.appendChild(matchTable);
    
    // Add some spacing
    const spacing = document.createElement('div');
    spacing.style.margin = '20px 0';
    container.appendChild(spacing);

    // Add title for streaming links
    const title = document.createElement('h3');
    title.textContent = '📺 Live Streaming Links';
    title.style.cssText = 'text-align: center; color: #3749b4; margin: 20px 0;';
    container.appendChild(title);
    
    // Loop through each event and create a link
    data.events.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'livee';
      eventDiv.style.cssText = data.styles.livee;
      
      eventDiv.innerHTML = `
        <div class="livee-name" style="${data.styles.liveeName}">
          ${event.name}
        </div>
      `;

      // Add hover effects
      eventDiv.addEventListener('mouseenter', () => {
        eventDiv.style.cssText = data.styles.livee + data.styles.liveeHover;
      });
      
      eventDiv.addEventListener('mouseleave', () => {
        eventDiv.style.cssText = data.styles.livee;
      });

      // Add click functionality to navigate to the event link in the same tab
      eventDiv.addEventListener('click', () => {
        window.location.href = event.link;
      });

      container.appendChild(eventDiv);
    });
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
    document.getElementById('live-container').innerHTML = `
      <div style="text-align: center; color: red; padding: 20px;">
        <p>⚠️ Error loading content. Please try refreshing the page.</p>
        <p><small>${error.message}</small></p>
      </div>
    `;
  });

// Function to create match info table
function createMatchTable(matchInfo) {
  const table = document.createElement('table');
  table.style.cssText = 'background-color: white; border-collapse: collapse; border-spacing: 0px; border: 0pt solid rgb(0, 0, 0); color: black; font-family: "Open Sans", Helvetica, Arial, sans-serif; font-size: 14px; margin: 0px 0px 1.25rem; padding: 0px; text-align: center; vertical-align: baseline; width: 100%;';
  
  const tbody = document.createElement('tbody');
  
  // Teams row
  const teamsRow = document.createElement('tr');
  teamsRow.style.height = '50px';
  const teamsCell = document.createElement('td');
  teamsCell.colSpan = 2;
  teamsCell.style.cssText = 'background: rgb(10, 6, 71); border: 0.7pt solid black; height: 50px; padding: 2px; vertical-align: middle;';
  teamsCell.innerHTML = `<span style="color: white; font-size: large;"><br /><b>${matchInfo.teams}</b><br /><br /></span>`;
  teamsRow.appendChild(teamsCell);
  
  // Match Info header
  const infoHeaderRow = document.createElement('tr');
  infoHeaderRow.style.height = '50px';
  const infoHeaderCell = document.createElement('td');
  infoHeaderCell.colSpan = 2;
  infoHeaderCell.style.cssText = 'background: rgb(0, 0, 0); border: 0.7pt solid black; height: 50px; padding: 2px; vertical-align: middle;';
  infoHeaderCell.innerHTML = '<strong style="color: white; font-size: medium;">Match Info</strong>';
  infoHeaderRow.appendChild(infoHeaderCell);
  
  // Date row
  const dateRow = createTableRow('Date', matchInfo.date);
  
  // Time row
  const timeRow = createTableRow('Time', matchInfo.time);
  
  // Stadium row
  const stadiumRow = createTableRow('Stadium', matchInfo.stadium);
  
  // League row
  const leagueRow = createTableRow('League', matchInfo.league);
  
  // Round row
  const roundRow = createTableRow('Round', matchInfo.round);
  
  // Empty row for spacing
  const emptyRow = document.createElement('tr');
  emptyRow.style.height = '50px';
  const emptyCell = document.createElement('td');
  emptyCell.colSpan = 2;
  emptyCell.style.cssText = 'border: 0.7pt solid black; height: 50px; padding: 2px; vertical-align: middle;';
  emptyCell.innerHTML = '<br /><br /><br /><br />';
  emptyRow.appendChild(emptyCell);
  
  // Append all rows to tbody
  tbody.appendChild(teamsRow);
  tbody.appendChild(infoHeaderRow);
  tbody.appendChild(dateRow);
  tbody.appendChild(timeRow);
  tbody.appendChild(stadiumRow);
  tbody.appendChild(leagueRow);
  tbody.appendChild(roundRow);
  tbody.appendChild(emptyRow);
  
  table.appendChild(tbody);
  return table;
}

// Helper function to create table rows
function createTableRow(label, value) {
  const row = document.createElement('tr');
  row.style.height = '50px';
  
  const labelCell = document.createElement('td');
  labelCell.style.cssText = 'border: 0.7pt solid black; height: 50px; padding: 2px; vertical-align: middle; width: 40%;';
  labelCell.innerHTML = `<span style="font-size: small;"><b>${label}</b></span>`;
  
  const valueCell = document.createElement('td');
  valueCell.style.cssText = 'border: 0.7pt solid black; height: 50px; padding: 2px; vertical-align: middle; width: 60%;';
  valueCell.innerHTML = `<span style="font-size: small;"><b>${value}</b></span>`;
  
  row.appendChild(labelCell);
  row.appendChild(valueCell);
  return row;
}
