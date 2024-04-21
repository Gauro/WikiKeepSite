let modal_search_content = "";

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const button = document.getElementById('tag-submit');
const modal = document.getElementById('myModal');
const closeBtn = document.querySelector('.close');

// When the user clicks the button, open the modal
button.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'block';


});

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        alert('Please enter a search term.');
        return;
    }

    const socket = new WebSocket("wss://wiki-keep-9d25a3c99357.herokuapp.com/ws");

    // Event handler for when the WebSocket connection is established
    socket.onopen = async function(event) {
        console.log("WebSocket connection established.");
        
        // Prepare search data
        const data = {
            action: "search_article",
            article: searchTerm
        };
        
        // Send search data to the server
        socket.send(JSON.stringify(data));
    };
    
    // Event handler for incoming messages from the server
    socket.onmessage = async function(event) {
        const articleContent = JSON.parse(event.data);
        displaySearchResults([articleContent]);
    };
    
    // Event handler for WebSocket connection close
    socket.onclose = function(event) {
        console.log("WebSocket connection closed.");
    };
});

function displaySearchResults(results) {
    
    searchResults.innerHTML = '';
    // Replace newline characters with <br> tags
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('searchResult');
        const contentWithBreaks = result.content.replace(/\n/g, '<br>');
        resultItem.innerHTML = `
            <h1>Title: ${result.title}</h1>
            <h2>Sentiment: ${result.sentiment}</h2>
            <p>${contentWithBreaks}</p>
        `;
        searchResults.appendChild(resultItem);
    });
}

function displaySearchResultsModal(results) {
    
    const modalsearchresults = document.getElementById('searchResultsModal');
    modalsearchresults.innerHTML = '';
    // Replace newline characters with <br> tags
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('searchResult');
        modal_search_content = result.content;
        const contentWithBreaks = result.content.replace(/\n/g, '<br>');
        resultItem.innerHTML = `
            <h1>Title: ${result.title}</h1>
            <h2>Sentiment: ${result.sentiment}</h2>
            <p>${contentWithBreaks}</p>
        `;
        modalsearchresults.appendChild(resultItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    const urlParams = new URLSearchParams(window.location.search);

    // Get the user_id parameter value
    const userId = urlParams.get('user_id');
    
    get_tags(userId);
    
});


async function get_tags(userId){
    const socket = new WebSocket("wss://wiki-keep-9d25a3c99357.herokuapp.com/ws");

    // Event handler for when the WebSocket connection is established
    socket.onopen = async function(event) {
        console.log("WebSocket connection established.");
        
        // Prepare data to retrieve user tags
        const data = {
            action: "retrieve_tags",
            user_id: userId
        };
        
        // Send data to the server
        socket.send(JSON.stringify(data));
    };
    
    // Event handler for incoming messages from the server
    socket.onmessage = async function(event) {
        const data = JSON.parse(event.data);
        load_filter_options(data.saved);
        modal_load_filter_options(data.saved);
        modify_tag(data.saved);
    };
    
    // Event handler for WebSocket connection close
    socket.onclose = function(event) {
        console.log("WebSocket connection closed.");
    };
}

function load_filter_options(data){
    
    const select_option_ele = document.getElementById("filterOption");
    const option_ele = document.createElement("option");
    
    option_ele.innerText = "--";
    select_option_ele.append(option_ele);

    data.forEach(tag => {
        const option_ele_text = document.createElement("option");
        option_ele_text.innerText = tag.tag_name;
        select_option_ele.append(option_ele_text);
    });
    

}

function modal_load_filter_options(data){
    
    const select_option_ele = document.getElementById("tagType");
    const option_ele = document.createElement("option");
    option_ele.innerText = "--";
    select_option_ele.append(option_ele);

    data.forEach(tag => {
        const option_ele_text = document.createElement("option");
        option_ele_text.innerText = tag.tag_name;
        select_option_ele.append(option_ele_text);
    });
        
    const option_ele1 = document.createElement("option");
    option_ele1.innerText = "New Tag";
    option_ele1.setAttribute("value","new");
    select_option_ele.append(option_ele1);

}


function modify_tag(data){
    
    const select_option_ele = document.getElementById("tagModify");
    const option_ele = document.createElement("option");
    option_ele.innerText = "--";
    select_option_ele.append(option_ele);

    data.forEach(tag => {
        const option_ele_text = document.createElement("option");
        option_ele_text.innerText = tag.tag_name;
        select_option_ele.append(option_ele_text);
    });
        
    const option_ele1 = document.createElement("option");
    option_ele1.innerText = "New Tag";
    option_ele1.setAttribute("value","new");
    select_option_ele.append(option_ele1);

}

function checkIfCustom() {
    var select = document.getElementById('tagType');
    var customTagInputWrapper = document.getElementById('customTagInputWrapper');
    
    if (select.value === 'new') {
        customTagInputWrapper.style.display = 'block';
    } else {
        customTagInputWrapper.style.display = 'none';
    }
}



function modifyTagCustom() {
    var select = document.getElementById('tagModify');
    var modifycustomTagInputWrapper = document.getElementById('modifycustomTagInputWrapper');
    
    if (select.value === 'new') {
        modifycustomTagInputWrapper.style.display = 'block';
    } else {
        modifycustomTagInputWrapper.style.display = 'none';
    }
}


const modal_search = document.getElementById("modal-search");
modal_search.addEventListener('click', async (e) => {
    e.preventDefault();
    const searchInputModal = document.getElementById('searchInputModal');
    const searchTerm = searchInputModal.value.trim();

    if (searchTerm === '') {
        alert('Please enter a search term.');
        return;
    }

    const socket = new WebSocket("wss://wiki-keep-9d25a3c99357.herokuapp.com/ws");

    // Event handler for when the WebSocket connection is established
    socket.onopen = async function(event) {
        console.log("WebSocket connection established.");
        
        // Prepare search data
        const data = {
            action: "search_article",
            article: searchTerm
        };
        
        // Send search data to the server
        socket.send(JSON.stringify(data));
    };

    // Event handler for incoming messages from the server
    socket.onmessage = async function(event) {
        const articleContent = JSON.parse(event.data);
        displaySearchResultsModal([articleContent]);
    };

    // Event handler for WebSocket connection close
    socket.onclose = function(event) {
        console.log("WebSocket connection closed.");
    };
});



const modal_submit = document.getElementById("modal-submit");
modal_submit.addEventListener('click', async (e) => {
    
    e.preventDefault();
    var tag = "";
    const input_title = document.getElementById("searchInputModal").value;
    const title = input_title;
    const content = modal_search_content;
    
    
    const new_tag = document.getElementById("customTagInput").value;

    if(new_tag != ""){
        tag = new_tag;
    }else{
        var selectElement = document.getElementById("tagType");
        var selectedOption = selectElement.options[selectElement.selectedIndex];

        var selectedValue = selectedOption.value;
        var selectedText = selectedOption.textContent;
        tag = selectedText;
    }
    
    const urlParams = new URLSearchParams(window.location.search);

    // Get the user_id parameter value
    const userId = urlParams.get('user_id');
    const user_id = userId;
    
    const socket = new WebSocket("wss://wiki-keep-9d25a3c99357.herokuapp.com/ws");

    // Event handler for when the WebSocket connection is established
    socket.onopen = async function(event) {
    console.log("WebSocket connection established.");
    
    // Prepare data to save article
    const data = {
        action: "save_article",
        title: title,
        content: content,
        tag: tag,
        user_id: user_id
    };
    
    // Send data to the server
    socket.send(JSON.stringify(data));
    };

    // Event handler for incoming messages from the server
    socket.onmessage = async function(event) {
        const response = JSON.parse(event.data);
        if (response) {
            alert('Submitted successfully!');
            modal.style.display = 'none';
        } else {
            // Handle the case when the submission fails
        }
    };

    // Event handler for WebSocket connection close
    socket.onclose = function(event) {
        console.log("WebSocket connection closed.");
    };
})




const filterSubmitEve = document.getElementById("filterSubmit");
filterSubmitEve.addEventListener("click", async (e) => {
    try {
        e.preventDefault();

        var selectElement = document.getElementById("filterOption");
        var selectedOption = selectElement.options[selectElement.selectedIndex];

        var selectedValue = selectedOption.value;
        var selectedText = selectedOption.textContent;

        const urlParams = new URLSearchParams(window.location.search);

        const userId = urlParams.get('user_id');
        const user_id = userId;
        
        const socket = new WebSocket("wss://wiki-keep-9d25a3c99357.herokuapp.com/ws");

        // Event handler for when the WebSocket connection is established
        socket.onopen = async function(event) {
            console.log("WebSocket connection established.");
            
            // Prepare data to filter articles
            const data = {
                action: "filter_articles_on_tag",
                tag: selectedText,
                user_id: user_id
            };
            
            // Send data to the server
            socket.send(JSON.stringify(data));
        };

        // Event handler for incoming messages from the server
        socket.onmessage = async function(event) {
            const data = JSON.parse(event.data);
            displaySearchResultsFilter(data.articles);
            // Process the articles received from the server
        };

        // Event handler for WebSocket connection close
        socket.onclose = function(event) {
            console.log("WebSocket connection closed.");
        };


        
    } catch (error) {
        console.error('Error fetching search results:', error);
    }  
})



function displaySearchResultsFilter(results) {
    
    searchResults.innerHTML = '';
    // Replace newline characters with <br> tags
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('searchResult');
        const contentWithBreaks = result.content.replace(/\n/g, '<br>');
        resultItem.innerHTML = `
            <div style="display:flex;"><h1>Title: ${result.title}</h1> <button article_id=${result.id} onClick="updateTag(event)" type="" style="height: 10%;margin-top: 25px;margin-left: 95px;">Update Tag</button></div>
            <h2>Sentiment: ${result.sentiment}</h2>
            <hr>
            <p>${contentWithBreaks}</p>
        `;
        searchResults.appendChild(resultItem);
    });
}



const logOut = document.getElementById("logOut");
logOut.addEventListener("click", async (e) => {
    e.preventDefault();
    window.location.href = '/index.html';    
})


function updateTag(event){
    try{
        const article_id = event.srcElement.attributes.getNamedItem('article_id').value;

        const modify_tag_modal = document.getElementById("updateTagModal");
        modify_tag_modal.setAttribute("article_id", article_id);
        modify_tag_modal.style.display = 'block';


        window.onclick = function(event) {
            if (event.target == modal) {
                modify_tag_modal.style.display = 'none';
            }
        }
        const closeBtnModify = document.querySelector('.closemodify');
        closeBtnModify.addEventListener('click', function() {
            modify_tag_modal.style.display = 'none';
        });


    }catch(error){
        console.error(error);
    }
}


const modify_modal_submit = document.getElementById("modify-modal-submit");
modify_modal_submit.addEventListener('click', async (e) => {
    
    e.preventDefault();
    var tag = "";
    
    const new_tag = document.getElementById("modifycustomTagInput").value;

    if(new_tag != ""){
        tag = new_tag;
    }else{
        var selectElement = document.getElementById("tagModify");
        var selectedOption = selectElement.options[selectElement.selectedIndex];

        var selectedValue = selectedOption.value;
        var selectedText = selectedOption.textContent;
        tag = selectedText;
    }
    
    const modify_tag_modal = document.getElementById("updateTagModal");
    const article_id= modify_tag_modal.getAttribute("article_id");


    const urlParams = new URLSearchParams(window.location.search);

    // Get the user_id parameter value
    const userId = urlParams.get('user_id');
    const user_id = userId;
    
    const socket = new WebSocket("wss://wiki-keep-9d25a3c99357.herokuapp.com/ws");

    // Event handler for when the WebSocket connection is established
    socket.onopen = async function(event) {
    console.log("WebSocket connection established.");
    
    // Prepare data to save article
    const data = {
        action: "modify_tag",
        tag: tag,
        article_id: article_id,
        user_id: user_id
    };
    
    // Send data to the server
    socket.send(JSON.stringify(data));
    };

    // Event handler for incoming messages from the server
    socket.onmessage = async function(event) {
        const response = JSON.parse(event.data);
        if (response) {
            alert('Update successfully!');
            const modify_tag_modal = document.getElementById("updateTagModal");
            modify_tag_modal.setAttribute("article_id", article_id);
            modify_tag_modal.style.display = 'none';
        } else {
            // Handle the case when the submission fails
        }
    };

    // Event handler for WebSocket connection close
    socket.onclose = function(event) {
        console.log("WebSocket connection closed.");
    };
})