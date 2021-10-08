const main = document.querySelector('main');
const gridSettingsForm = document.getElementById('grid-settings-form');
const rowAmount = document.getElementById('row-amount');
const rowGapAmount = document.getElementById('row-gap-amount');
const columnAmount = document.getElementById('column-amount');
const columnGapAmount = document.getElementById('column-gap-amount');
const containerWidth = document.getElementById('container-width');
const containerHeight = document.getElementById('container-height');
const selectionArea = document.querySelector('.selection-area');
const toggleGuideGrid = document.querySelector('.toggle-grid');
const settingsMenu = document.querySelector('.settings-menu');
const settingsBtn = document.querySelector('.settings-btn');
const generateCodeBtn = document.querySelector('.generate-code-btn');
const close = document.querySelector('.close');
const codeModal = document.querySelector('.code-modal');
const closeModal = document.querySelector('.close-modal');
const HTMLTab = document.getElementById('html-tab');
const CSSTab = document.getElementById('css-tab');
const HTMLCode = document.getElementById('html-code');
const CSSCode = document.getElementById('css-code');

let hideGuideGrid = false;
let startCell = {row: '', col: ''};
let endCell = {row: '', col: ''};
let cellArray = [];
let gridItemArray = [];

generateCodeBtn.addEventListener('click', generateCode);
closeModal.addEventListener('click', closeCodeModal);
HTMLTab.addEventListener('click', () => {
    openTab('HTML');
})

CSSTab.addEventListener('click', () => {
    openTab('CSS');
})

settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('active');
});

close.addEventListener('click', () => {
    settingsMenu.classList.remove('active');
})

gridSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let gridParameters = {
        rows: rowAmount.value, 
        rowGap: rowGapAmount.value, 
        columns: columnAmount.value, 
        columnGap: columnGapAmount.value,
        containerWidth: containerWidth.value,
        containerHeight: containerHeight.value
    }

    // Make sure all inputs are numeric and not blank
    for(var key in gridParameters){
        if(gridParameters[key].trim() === ''){
            return alert('Please enter all fields');
        }else{
            gridParameters[key] = +gridParameters[key];
        }
        if(isNaN(gridParameters[key])){
            return alert('Please enter numbers only');
        }
    }
    generateGrid(gridParameters);
})

let selectionActive = false;

class Cell{
    constructor(row, col, section){
        this.row = row;
        this.col = col;
        this.section = section;
        this.createCell(section);
    }

    createCell(section){
        let cell = document.createElement('div');
        cell.classList.add('cell');
        section.appendChild(cell)
       
        cell.addEventListener('mousedown', () => {
            selectionActive = true;
            startCell.row = this.row;
            startCell.col = this.col;
        })

        cell.addEventListener('mouseup', () => {
            endCell.row = this.row;
            endCell.col = this.col;
            createGridItem();
        })

        cell.addEventListener('mouseenter', () => {
            if(selectionActive){
                endCell.row = this.row;
                endCell.col = this.col;
            }
        });

        this.element = cell;
        this.element.style.gridArea = `${this.row+1} / ${this.col+1} / ${this.row + 2} / ${this.col + 2}`;
       
    }
}

function generateGrid(params){
    main.innerHTML = '';
    let section = document.createElement('section');
    section.classList.add('grid-container');
    section.style.width = `${params.containerWidth}%`;
    section.style.height = `${params.containerHeight}%`;
    section.style.display = 'grid';
    section.style.gridTemplateRows = `repeat(${params.rows}, 1fr)`;
    section.style.gridTemplateColumns = `repeat(${params.columns}, 1fr)`;
    section.style.rowGap = `${params.rowGap}px`;
    section.style.columnGap = `${params.columnGap}px`;
    main.appendChild(section);
    for(let row = 0; row < params.rows; row++){
        for(let col = 0; col < params.columns; col++){
            let cell = new Cell(row, col, section);
             cellArray.push(cell);
        }
    }
}

generateGrid({
    rows: 12, 
    rowGap: 6, 
    columns: 12,
    columnGap: 6
})

let gridTemplateRows = 'repeat(12, 1fr)';
let gridTemplateColumns = 'repeat(12, 1fr)';

// Drag to create cell

main.addEventListener('mousedown', (e) => {
    selectionArea.style.top = `${e.clientY}px`;
    selectionArea.style.left = `${e.clientX}px`;  
})

main.addEventListener('mouseup', (e) => {
    selectionActive = false;
    selectionArea.style.width = `0`;
    selectionArea.style.height = `0`;    
    for(let i = 0; i < cellArray.length; i++){
        if(hideGuideGrid){
            cellArray[i].element.style.opacity = 0;
        }else{
            cellArray[i].element.style.opacity = 1;
        }
     
    }
    startCell = {row: '', col: ''};
    endCell = {row: '', col: ''};
})

main.addEventListener('mousemove', (e) => {
    if(selectionActive){
        
        selectionArea.style.width = `${e.clientX - parseInt(selectionArea.style.left)}px`;
        selectionArea.style.height = `${e.clientY - parseInt(selectionArea.style.top)}px`;
       
        for(let i = 0; i < cellArray.length; i++){
           if(cellArray[i].row >= startCell.row && cellArray[i].col >= startCell.col
                && cellArray[i].row <= endCell.row && cellArray[i].col <= endCell.col){
                    cellArray[i].element.style.opacity = 0.5;
                }else{
                    cellArray[i].element.style.opacity = 1;
                }
        }
    }
})

function createGridItem(){
    let div = document.createElement('div');
    div.classList.add('grid-item');
    div.classList.add(`gi-${gridItemArray.length}`);
    
    let classInfo = document.createElement('p');
    div.appendChild(classInfo);

    let removeDiv = document.createElement('div');
    removeDiv.classList.add('remove');
    for(let i = 0; i < 2; i++){
        let span = document.createElement('span');
        removeDiv.appendChild(span);
    }

    div.appendChild(removeDiv);
    document.querySelector('.grid-container').appendChild(div);
    div.style.gridArea = `${startCell.row + 1} / ${startCell.col + 1} / ${endCell.row + 2} / ${endCell.col + 2}`;

    let id = Date.now();

    removeDiv.addEventListener('click', () => {
        for(let i = 0; i < gridItemArray.length; i++){
            if(gridItemArray[i].id === id){
                gridItemArray[i].element.remove();
                gridItemArray.splice(i,1);
            }
        }

        for(let i = 0; i < gridItemArray.length; i++){
            console.log(gridItemArray[i])
            gridItemArray[i].element.classList.remove(gridItemArray[i].class);
            gridItemArray[i].element.classList.add(`gi-${i}`);
            gridItemArray[i].class = `gi-${i}`;
        }   
        updateGridText()     
    })

    let gridItem = {
        id: id,
        element: div,
        class: `gi-${gridItemArray.length}`
    }
    gridItemArray.push(gridItem);

    updateGridText()
   
}

toggleGuideGrid.addEventListener('click', () => {
    hideGuideGrid = !hideGuideGrid;
    if(cellArray.length > 0){
        for(let i = 0; i < cellArray.length; i++){
            if(hideGuideGrid){
                cellArray[i].element.style.opacity = 0;
            }else{
                cellArray[i].element.style.opacity = 1;
            }
        }
    }
})

function updateGridText(){
    for(let i = 0; i< gridItemArray.length; i++){
        gridItemArray[i].element.querySelector('p').innerText = gridItemArray[i].class.substring(3);
    }
}

// Code generations

function generateHTMLCode(){
    let htmlCodeSnippet = `&lt<span class="highlight">section</span> class="grid-container"&gt</br>`
    for(let i = 0; i < gridItemArray.length; i++){
        htmlCodeSnippet += `<span class="html-param-highlight">&lt<span class="highlight">div</span> class="grid-item ${gridItemArray[i].class}"&gt&lt/<span class="highlight">div</span>&gt </br>`;
    }
    htmlCodeSnippet += `&lt/<span class="highlight">section</span>&gt`;  
    HTMLCode.innerHTML = htmlCodeSnippet;
}

function generateCSSCode(){
    let section = document.querySelector('.grid-container');
    let cssCodeSnippet = ` 
        <span class="highlight">.grid-container</span> { </br>
            <span class="param-highlight">width:</span> 100vw;</br>
            <span class="param-highlight">height:</span> 100vh;</br>
            <span class="param-highlight">display:</span> grid;</br>
            <span class="param-highlight">grid-template-columns:</span> ${section.style.gridTemplateColumns};</br>
            <span class="param-highlight">grid-template-rows:</span> ${section.style.gridTemplateRows};</br>
            <span class="param-highlight">column-gap:</span> ${section.style.columnGap};</br>
            <span class="param-highlight">row-gap:</span> ${section.style.rowGap};</br>
        }</br></br>
        <span class="highlight">.grid-item</span> { </br>
            <span class="param-highlight">border:</span> 1px solid #000000;</br>
        }</br></br>
        `

        for(let i = 0; i < gridItemArray.length; i++){
            console.log(gridItemArray[i])
            let code = `
                <span class="highlight">.${gridItemArray[i].class}</span> {</br>
                    <span class="param-highlight">grid-area</span>: ${gridItemArray[i].element.style.gridArea};</br>
                }</br></br>
            `;
            cssCodeSnippet += code;
        }
        CSSCode.innerHTML = cssCodeSnippet;
}

function generateCode(){
    codeModal.classList.add('active');
    openTab('HTML');
}

function closeCodeModal(){
    codeModal.classList.remove('active');
}

function openTab(tab) {
    if(tab === 'HTML'){
        try{
            CSSCode.style.display = 'none';
        }catch(e){
            console.log(e)
        }
        HTMLCode.style.display = 'block';
        generateHTMLCode();
    }else if(tab === 'CSS'){
        try{
            HTMLCode.style.display = 'none';
        }catch(e){
            console.log(e)
        }
        CSSCode.style.display = 'block'; 
        generateCSSCode();
    }
  }